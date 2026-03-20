from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import supabase

# 1. Initialize the Router (This fixes your AttributeError)
router = APIRouter(prefix="/api/patients", tags=["Patients (Frontend Contract)"])


# 2. Pydantic Models for Data Validation (POST & PATCH)
class SessionCreate(BaseModel):
    exercise_id: str


class SessionUpdate(BaseModel):
    status: str  # e.g., "completed"


# --- GET ENDPOINTS (Reading Data) ---


@router.get("/")
def get_all_patients():
    """
    Fetch all patients.
    Frontend usage: GET /api/patients
    """
    try:
        response = supabase.table("patients").select("*").execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{patient_id}")
def get_single_patient(patient_id: int):
    """
    Fetch a single patient by ID.
    Frontend usage: GET /api/patients/1
    """
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
        raise HTTPException(status_code=404, detail="Patient not found or invalid ID.")


@router.get("/{patient_id}/therapists")
def get_patient_therapists(patient_id: int):
    """
    Returns therapists assigned to this patient.
    Frontend usage: GET /api/patients/1/therapists
    """
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
    """Returns sessions, optionally filtered by status (pending/completed)."""
    try:
        # Fetches the session AND nests the video details inside it
        query = (
            supabase.table("sessions")
            .select("*, videos_metadata(*)")
            .eq("patient_id", patient_id)
        )
        if status:
            query = query.eq("status", status)

        res = query.execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{patient_id}/progress")
def get_patient_progress(patient_id: int):
    """Calculates completion stats for the ProgressTracker."""
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
            "streakDays": 1,  # Hardcoded for hackathon prototype
            "badges": ["First Step"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- POST & PATCH ENDPOINTS (Writing Data) ---


@router.post("/{patient_id}/sessions")
def create_session(patient_id: int, payload: SessionCreate):
    """Clinician Action: Assign a new video to a patient."""
    try:
        new_session = {
            "patient_id": patient_id,
            "exercise_id": payload.exercise_id,
            "status": "pending",
        }
        res = supabase.table("sessions").insert(new_session).execute()
        return {"status": "success", "message": "Exercise assigned", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{patient_id}/sessions/{session_id}")
def update_session_status(patient_id: int, session_id: str, payload: SessionUpdate):
    """Patient Action: Mark a video as completed."""
    try:
        # Update the database to flip 'pending' to 'completed'
        res = (
            supabase.table("sessions")
            .update({"status": payload.status})
            .eq("id", session_id)
            .eq(
                "patient_id", patient_id
            )  # Security check: ensure session belongs to patient
            .execute()
        )

        if not res.data:
            raise HTTPException(status_code=404, detail="Session not found")

        return {
            "status": "success",
            "message": f"Session marked as {payload.status}",
            "data": res.data,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
