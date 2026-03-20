from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import supabase

router = APIRouter(prefix="/api/patients", tags=["Patients (Frontend Contract)"])


class SessionCreate(BaseModel):
    therapist_id: str
    exercise_ids: list[str]


class SessionUpdate(BaseModel):
    status: str


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
        query = (
            supabase.table("sessions")
            .select("*, therapists(*), session_exercises(*, video_metadata(*))")
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
