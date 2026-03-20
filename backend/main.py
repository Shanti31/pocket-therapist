# initializes fastapi
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import supabase
from routers import exercises, patients, programs

app = FastAPI(title="Pocket Therapist API")

# 1. The CORS Middleware (Crucial for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows your React/Vue app to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(exercises.router)
app.include_router(patients.router)
app.include_router(programs.router)


@app.get("/")
def read_root():
    return {"status": "FastAPI is running!"}


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
