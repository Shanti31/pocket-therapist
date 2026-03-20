from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import supabase

router = APIRouter(prefix="/api/patients", tags=["Patients (Frontend Contract)"])


class SessionCreate(BaseModel):
    therapist_id: str
    exercise_ids: list[str]


class SessionUpdate(BaseModel):
    status: str


class FeedbackCreate(BaseModel):
    pain_level: int
    effort_level: int | None = None
    notes: str | None = None


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    age: int | None = None
    email: str
    exercise_difficulty: int = 5
    adhesion: int = 0
    pain_level: int = 0
    number_of_programs: int = 0


# --- GET ENDPOINTS ---


@router.get("/")
def get_all_patients():
    try:
        response = supabase.table("patients").select("*").execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{patient_id}")
def get_single_patient(patient_id: int):
    try:
        response = (
            supabase.table("patients")
            .select("*")
            .eq("id", patient_id)
            .single()
            .execute()
        )
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Patient not found.")


@router.get("/{patient_id}/therapists")
def get_patient_therapists(patient_id: int):
    try:
        res = (
            supabase.table("patient_therapists")
            .select("therapists(*)")
            .eq("patient_id", patient_id)
            .execute()
        )
        return [item["therapists"] for item in res.data] if res.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{patient_id}/sessions")
def get_patient_sessions(patient_id: int, status: str | None = None):
    """
    Fetches sessions with nested therapist info AND all assigned exercises.
    """
    try:
        # THE DEEP JOIN: session -> therapist AND session -> exercises -> video_metadata
        # THE DEEP JOIN: Now includes session_feedback
        # WARNING: Ensure videos_metadata matches your actual Supabase table name!
        query = (
            supabase.table("sessions")
            .select(
                "*, therapists(*), session_exercises(*, videos_metadata(*)), session_feedback(*)"
            )
            .eq("patient_id", patient_id)
        )

        if status:
            query = query.eq("status", status)

        res = query.execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch sessions: {str(e)}"
        )


@router.get("/{patient_id}/progress")
def get_patient_progress(patient_id: int):
    try:
        pending = (
            supabase.table("sessions")
            .select("*", count="exact")
            .eq("patient_id", patient_id)
            .eq("status", "pending")
            .execute()
        )
        completed = (
            supabase.table("sessions")
            .select("*", count="exact")
            .eq("patient_id", patient_id)
            .eq("status", "completed")
            .execute()
        )

        comp_count = completed.count or 0
        total = comp_count + (pending.count or 0)

        return {
            "completedCount": comp_count,
            "totalCount": total,
            "streakDays": 1,
            "badges": ["First Step"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- POST & PATCH ENDPOINTS ---


@router.post("/")
def create_patient(payload: PatientCreate):
    """
    Create a new patient.
    """
    try:
        patient_data = {
            "first_name": payload.first_name,
            "last_name": payload.last_name,
            "age": payload.age,
            "email": payload.email,
            "exercise_difficulty": payload.exercise_difficulty,
            "adhesion": payload.adhesion,
            "pain_level": payload.pain_level,
            "number_of_programs": payload.number_of_programs,
        }

        print(f"Creating patient with data: {patient_data}")
        
        response = supabase.table("patients").insert(patient_data).execute()
        
        print(f"Patient response: {response}")

        if not response.data:
            raise Exception(f"No data returned. Response: {response}")

        created_patient = response.data[0]
        
        print(f"Created patient with ID: {created_patient.get('id')}")

        return {
            "status": "success",
            "data": created_patient
        }

    except Exception as e:
        error_msg = str(e)
        print(f"ERROR creating patient: {error_msg}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Failed to create patient: {error_msg}"
        )


@router.post("/{patient_id}/sessions")
def create_session(patient_id: int, payload: SessionCreate):
    try:
        # 1. Create the Session Header
        new_session = {
            "patient_id": patient_id,
            "therapist_id": payload.therapist_id,
            "status": "pending",
        }
        session_res = supabase.table("sessions").insert(new_session).execute()

        if not session_res.data:
            raise HTTPException(
                status_code=500, detail="Failed to create session header."
            )

        new_session_id = session_res.data[0]["id"]

        # 2. Link multiple exercises to this session
        exercises_to_insert = [
            {"session_id": new_session_id, "exercise_id": ex_id}
            for ex_id in payload.exercise_ids
        ]

        if exercises_to_insert:
            supabase.table("session_exercises").insert(exercises_to_insert).execute()

        return {"status": "success", "session_id": new_session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assignment failed: {str(e)}")


@router.patch("/{patient_id}/sessions/{session_id}")
def update_session_status(patient_id: int, session_id: str, payload: SessionUpdate):
    try:
        res = (
            supabase.table("sessions")
            .update({"status": payload.status})
            .eq("id", session_id)
            .eq("patient_id", patient_id)
            .execute()
        )

        if not res.data:
            raise HTTPException(status_code=404, detail="Session not found.")

        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{patient_id}/sessions/{session_id}/feedback")
def submit_session_feedback(patient_id: int, session_id: str, payload: FeedbackCreate):
    """
    Patient Action: Submit post-workout feedback.
    This is blocked if feedback already exists due to the UNIQUE constraint.
    """
    try:
        feedback_data = {
            "session_id": session_id,
            "patient_id": patient_id,
            "pain_level": payload.pain_level,
            "effort_level": payload.effort_level,
            "notes": payload.notes,
        }

        res = supabase.table("session_feedback").insert(feedback_data).execute()

        # Optional: Automatically mark the session as 'completed' when feedback is submitted
        supabase.table("sessions").update({"status": "completed"}).eq(
            "id", session_id
        ).execute()

        return {"status": "success", "message": "Feedback recorded.", "data": res.data}

    except Exception as e:
        # Supabase will throw a specific error if the UNIQUE constraint is violated
        if "duplicate key value" in str(e).lower():
            raise HTTPException(
                status_code=400,
                detail="Feedback has already been submitted for this session.",
            )
        raise HTTPException(
            status_code=500, detail=f"Failed to submit feedback: {str(e)}"
        )
