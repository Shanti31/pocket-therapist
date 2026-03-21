# initializes fastapi
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from database import supabase
from routers import exercises, patients, programs


# ---- Pydantic Models ----

class CreateSessionRequest(BaseModel):
    patient_id: int


class SessionFeedbackRequest(BaseModel):
    session_id: str
    patient_id: int
    pain_rating: int  # 1-10
    fatigue: str  # "low", "moderate", "high"
    difficulty: str  # "easy", "medium", "hard"
    comment: Optional[str] = None


# ---- FastAPI App ----

app = FastAPI(title="Pocket Therapist API")

# 1. The CORS Middleware (Crucial for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows your React/Vue app to connect
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)


app.include_router(exercises.router)
app.include_router(patients.router)
app.include_router(programs.router)


@app.get("/")
def read_root():
    return {"status": "FastAPI is running!"}


@app.get("/api/videos")
def get_videos():
    """Fetch all videos from Supabase with their public URLs."""
    try:
        response = supabase.table("videos_metadata").select("*").execute()
        
        # Transform the response to include video URLs
        videos = []
        for video in response.data:
            videos.append({
                "id": video.get("id"),
                "title": video.get("title"),
                "description": video.get("description"),
                "category": video.get("category"),
                "duration": video.get("duration"),
                "url": video.get("url"),  # This is the Supabase Storage URL
            })
        
        return {"status": "success", "data": videos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ---- Session Feedback ----

def map_fatigue_to_effort(fatigue: str) -> int:
    """Convert fatigue level to effort level (1-10)."""
    mapping = {
        "low": 3,
        "moderate": 6,
        "high": 9,
    }
    return mapping.get(fatigue.lower(), 5)


@app.post("/api/session-feedback")
def create_session_feedback(feedback: SessionFeedbackRequest):
    """Save session feedback to the database."""
    try:
        effort_level = map_fatigue_to_effort(feedback.fatigue)
        pain_level = max(0, feedback.pain_rating - 1)  # Convert 1-10 to 0-9
        
        print(f"[FEEDBACK] Saving: session={feedback.session_id}, patient={feedback.patient_id}, pain={pain_level}, effort={effort_level}")
        
        response = supabase.table("session_feedback").insert({
            "session_id": feedback.session_id,
            "patient_id": feedback.patient_id,
            "pain_level": pain_level,
            "effort_level": effort_level,
            "notes": feedback.comment or "",
        }).execute()
        
        print(f"[FEEDBACK] Success! Inserted record: {response.data}")
        return {"status": "success", "data": response.data}
    except Exception as e:
        error_msg = str(e)
        print(f"[FEEDBACK ERROR] {error_msg}")
        raise HTTPException(status_code=500, detail=f"Failed to save feedback: {error_msg}")


@app.get("/api/session-feedback/{session_id}")
def get_session_feedback(session_id: str):
    """Retrieve feedback for a specific session."""
    try:
        response = supabase.table("session_feedback").select("*").eq(
            "session_id", session_id
        ).single().execute()
        
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Feedback not found: {str(e)}")


@app.get("/api/patient-feedback/{patient_id}")
def get_patient_feedback(patient_id: int):
    """Retrieve all feedback for a patient."""
    try:
        response = supabase.table("session_feedback").select("*").eq(
            "patient_id", patient_id
        ).order("created_at", desc=True).execute()
        
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch feedback: {str(e)}")


@app.get("/db-test")
def test_database_connection():
    """Verify Supabase is responding via the modular connection."""
    try:
        # We use the imported 'supabase' client here
        response = supabase.table("videos_metadata").select("*").execute()
        return {
            "db_status": "Connected!",
            "record_count": len(response.data),
            "content": response.data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database connection failed: {str(e)}"
        )


# ---- Session Management ----

@app.post("/api/sessions")
def create_session(session: CreateSessionRequest):
    """Create a new session and return its ID."""
    try:
        print(f"[SESSION] Creating session for patient {session.patient_id}")
        
        response = supabase.table("sessions").insert({
            "patient_id": session.patient_id,
            "status": "pending",
        }).execute()
        
        session_id = response.data[0]['id'] if response.data else None
        print(f"[SESSION] Created session: {session_id}")
        
        return {
            "status": "success",
            "session_id": session_id,
            "data": response.data
        }
    except Exception as e:
        error_msg = str(e)
        print(f"[SESSION ERROR] {error_msg}")
        raise HTTPException(status_code=500, detail=f"Failed to create session: {error_msg}")


@app.patch("/api/sessions/{session_id}")
def complete_session(session_id: str):
    """Mark a session as completed."""
    try:
        print(f"[SESSION] Completing session: {session_id}")
        
        response = supabase.table("sessions").update({
            "status": "completed",
            "completed_at": "now()",
        }).eq("id", session_id).execute()
        
        print(f"[SESSION] Completed session: {session_id}")
        return {"status": "success", "data": response.data}
    except Exception as e:
        error_msg = str(e)
        print(f"[SESSION ERROR] {error_msg}")
        raise HTTPException(status_code=500, detail=f"Failed to complete session: {error_msg}")
