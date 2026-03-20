from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import supabase

router = APIRouter(prefix="/api/programs", tags=["Clinical Programs"])


class ProgramCreate(BaseModel):
    title: str
    description: str | None = None
    therapist_id: str
    exercise_ids: list[str]  # This is where the "Add" button IDs go


class ProgramPatch(BaseModel):
    title: str | None = None
    description: str | None = None


class ExerciseList(BaseModel):
    exercise_ids: list[str]


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
        # 3. Inside that, join with 'video_metadata' to get the actual video details
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
