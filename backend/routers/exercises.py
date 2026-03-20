from fastapi import APIRouter, HTTPException
from database import supabase

router = APIRouter(prefix="/api/exercises", tags=["Exercise Library"])


# get all exercises
@router.get("/")
def get_all_exercises(category: str = None):
    """
    Fetch the video library.
    Frontend usage: GET /exercises or GET /exercises?category=Shoulder
    """
    try:
        # We query the video_metadata table we built earlier
        query = supabase.table("videos_metadata").select("*")

        if category:
            query = query.eq("body_part", category)

        response = query.execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# see exercise
@router.get("/{exercise_id}")
def get_single_exercise(exercise_id: str):
    """
    Fetch a single video by its UUID.
    Frontend usage: GET /exercises/550e8400-e29b-41d4-a716-446655440000
    """
    try:
        response = (
            supabase.table("video_metadata")
            .select("*")
            .eq("id", exercise_id)
            .single()
            .execute()
        )
        return {"status": "success", "data": response.data}
    except Exception as e:
        # If .single() finds nothing, it throws an error
        raise HTTPException(status_code=404, detail="Exercise not found or invalid ID.")
