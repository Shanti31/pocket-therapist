from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import supabase

router = APIRouter(prefix="/api/programs", tags=["Clinical Programs"])


class ProgramCreate(BaseModel):
    title: str
    description: str | None = None
    therapist_id: str = None
    exercise_ids: list[str] = []  # Optional - programs can start empty


class ProgramPatch(BaseModel):
    title: str | None = None
    description: str | None = None


class ExerciseList(BaseModel):
    exercise_ids: list[str]


class AdaptProgramRequest(BaseModel):
    title: str
    difficulty: int = 5
    duration: str = "4 semaines"


class AssignProgramRequest(BaseModel):
    program_id: str
    is_personal: bool = False


@router.get("/")
def get_all_programs(therapist_id: str | None = None):
    """
    Fetch all program templates.
    Optional: Filter by therapist_id to see only 'my' programs.
    """
    try:
        # THE DEEP JOIN:
        # 1. Get all columns from 'programs' (*)
        # 2. Join with 'program_exercises'
        # 3. Inside that, join with 'videos_metadata' to get the actual video details
        query = supabase.table("programs").select(
            "*, program_exercises(*, videos_metadata(*))"
        )

        if therapist_id:
            query = query.eq("therapist_id", therapist_id)

        response = query.execute()

        return {"status": "success", "data": response.data}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve programs: {str(e)}"
        )


@router.get("/{program_id}")
def get_single_program(program_id: str):
    """
    Fetch a single program with all its exercises.
    """
    try:
        response = (
            supabase.table("programs")
            .select("*, program_exercises(*, videos_metadata(*))")
            .eq("id", program_id)
            .single()
            .execute()
        )

        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Program not found.")


@router.post("/")
def create_program(payload: ProgramCreate):
    """
    Create a new program.
    """
    try:
        # Prepare program data - only add therapist_id if provided
        program_data = {
            "title": payload.title,
            "description": payload.description,
        }
        
        if payload.therapist_id:
            program_data["therapist_id"] = payload.therapist_id

        print(f"Inserting program with data: {program_data}")
        
        program_response = supabase.table("programs").insert(program_data).execute()
        
        print(f"Program response: {program_response}")

        if not program_response.data:
            raise Exception(f"No data returned. Response: {program_response}")

        created_program = program_response.data[0]
        program_id = created_program["id"]
        
        print(f"Created program with ID: {program_id}")

        # Add exercises if provided
        if payload.exercise_ids and len(payload.exercise_ids) > 0:
            try:
                links = [
                    {"program_id": program_id, "exercise_id": eid}
                    for eid in payload.exercise_ids
                ]
                supabase.table("program_exercises").insert(links).execute()
            except Exception as ex:
                print(f"Warning: Failed to add exercises: {str(ex)}")
                # Continue anyway - program was created successfully

        # Return the created program
        return {
            "status": "success",
            "data": {
                "id": created_program["id"],
                "title": created_program["title"],
                "description": created_program.get("description"),
                "therapist_id": created_program.get("therapist_id"),
                "created_at": created_program.get("created_at"),
                "updated_at": created_program.get("updated_at"),
                "program_exercises": [],
            }
        }

    except Exception as e:
        error_msg = str(e)
        print(f"ERROR creating program: {error_msg}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Failed to create program: {error_msg}"
        )


@router.patch("/{program_id}")
def update_program_metadata(program_id: str, payload: ProgramPatch):
    """Update only the title or description of a program."""
    try:
        # Convert Pydantic model to a dict, excluding unset values
        update_data = payload.model_dump(exclude_unset=True)

        if not update_data:
            raise HTTPException(
                status_code=400, detail="No fields provided for update."
            )

        res = (
            supabase.table("programs")
            .update(update_data)
            .eq("id", program_id)
            .execute()
        )

        if not res.data:
            raise HTTPException(status_code=404, detail="Program not found.")

        return {"status": "success", "data": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{program_id}/exercises")
def add_exercises_to_program(program_id: str, payload: ExerciseList):
    """Add one or more exercises to an existing program."""
    try:
        links = [
            {"program_id": program_id, "exercise_id": eid}
            for eid in payload.exercise_ids
        ]

        # Use upsert to handle cases where the link might already exist
        res = supabase.table("program_exercises").upsert(links).execute()
        return {"status": "success", "added_count": len(res.data)}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to add exercises: {str(e)}"
        )


@router.delete("/{program_id}/exercises/{exercise_id}")
def remove_exercise_from_program(program_id: str, exercise_id: str):
    """Remove a single exercise from a program."""
    try:
        res = (
            supabase.table("program_exercises")
            .delete()
            .eq("program_id", program_id)
            .eq("exercise_id", exercise_id)
            .execute()
        )

        return {"status": "success", "message": "Exercise removed from program."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{program_id}/exercises")
def sync_program_exercises(program_id: str, payload: ExerciseList):
    """
    Wipes the current exercises for a program and replaces them with a new list.
    This ensures the DB perfectly matches the 'Save' state of the frontend.
    """
    try:
        # 1. Delete all existing links for this program
        supabase.table("program_exercises").delete().eq(
            "program_id", program_id
        ).execute()

        # 2. Insert the new list
        if payload.exercise_ids:
            links = [
                {"program_id": program_id, "exercise_id": eid}
                for eid in payload.exercise_ids
            ]
            supabase.table("program_exercises").insert(links).execute()

        return {
            "status": "success",
            "message": "Program exercises synced successfully.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")


@router.delete("/{program_id}")
def delete_program(program_id: str):
    """Delete a program and all its associated exercises."""
    try:
        # 1. Delete all exercises linked to this program
        supabase.table("program_exercises").delete().eq(
            "program_id", program_id
        ).execute()

        # 2. Delete the program itself
        res = (
            supabase.table("programs")
            .delete()
            .eq("id", program_id)
            .execute()
        )

        if not res.data:
            raise HTTPException(status_code=404, detail="Program not found.")

        return {"status": "success", "message": "Program deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete program: {str(e)}")


@router.post("/{program_id}/adapt")
def adapt_program(program_id: str, payload: AdaptProgramRequest):
    """
    Create an adapted (personalized) copy of an existing program.
    The adapted program includes the original exercises and metadata.
    """
    try:
        # 1. Get the original program with its exercises
        original = (
            supabase.table("programs")
            .select("*, program_exercises(*, videos_metadata(*))")
            .eq("id", program_id)
            .single()
            .execute()
        )

        if not original.data:
            raise HTTPException(status_code=404, detail="Original program not found.")

        original_program = original.data

        # 2. Create the new adapted program
        # Only use fields that exist in the programs table schema
        adapted_program_data = {
            "title": payload.title,
            "description": f"Programme adapté - Difficulté: {payload.difficulty}/10, Durée: {payload.duration}",
            "therapist_id": original_program.get("therapist_id"),
        }

        adapted_response = supabase.table("programs").insert(adapted_program_data).execute()

        if not adapted_response.data:
            raise Exception("Failed to create adapted program")

        adapted_program = adapted_response.data[0]
        adapted_program_id = adapted_program["id"]

        # 3. Copy all exercises from the original program to the adapted one
        if original_program.get("program_exercises"):
            exercise_ids = [ex["exercise_id"] for ex in original_program["program_exercises"]]
            if exercise_ids:
                links = [
                    {"program_id": adapted_program_id, "exercise_id": eid}
                    for eid in exercise_ids
                ]
                supabase.table("program_exercises").insert(links).execute()

        return {
            "status": "success",
            "data": {
                "id": adapted_program["id"],
                "title": adapted_program["title"],
                "description": adapted_program.get("description"),
                "created_at": adapted_program.get("created_at"),
            }
        }

    except Exception as e:
        error_msg = str(e)
        print(f"ERROR adapting program: {error_msg}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Failed to adapt program: {error_msg}"
        )
