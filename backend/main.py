# initializes fastapi
from fastapi import FastAPI, HTTPException
from database import supabase

app = FastAPI(title="Pocket Therapist API")


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
