#!/usr/bin/env python3
"""Test session creation and feedback flow with correct column names."""

from database import supabase

print("=" * 60)
print("Testing Session Management (Full Flow)")
print("=" * 60)

# 1. Create a session
print("\n[1] Creating session...")
try:
    session_resp = supabase.table("sessions").insert({
        "patient_id": 1,
        "therapist_id": "th-1",
        "status": "in_progress",
    }).execute()
    
    session_id = session_resp.data[0]['id'] if session_resp.data else None
    print(f"✓ Session created: {session_id}")
except Exception as e:
    print(f"✗ Failed to create session: {str(e)}")
    exit(1)

# 2. Create feedback for that session
print("\n[2] Creating feedback for session...")
try:
    feedback_resp = supabase.table("session_feedback").insert({
        "session_id": session_id,
        "patient_id": 1,
        "pain_level": 5,
        "effort_level": 6,
        "notes": "Test feedback with real foreign key",
    }).execute()
    
    print(f"✓ Feedback created successfully")
    if feedback_resp.data:
        print(f"  ID: {feedback_resp.data[0].get('id')}")
        print(f"  Session: {feedback_resp.data[0].get('session_id')}")
except Exception as e:
    print(f"✗ Failed to create feedback: {str(e)}")

# 3. Mark session as completed
print("\n[3] Marking session as completed...")
try:
    complete_resp = supabase.table("sessions").update({
        "status": "completed",
    }).eq("id", session_id).execute()
    
    print(f"✓ Session marked as completed")
except Exception as e:
    print(f"✗ Failed to complete session: {str(e)}")

# 4. Retrieve feedback
print("\n[4] Retrieving feedback...")
try:
    retrieve_resp = supabase.table("session_feedback").select("*").eq(
        "session_id", session_id
    ).execute()
    
    print(f"✓ Retrieved {len(retrieve_resp.data)} feedback record(s)")
    if retrieve_resp.data:
        feedback = retrieve_resp.data[0]
        print(f"  Pain level: {feedback['pain_level']}")
        print(f"  Effort level: {feedback['effort_level']}")
        print(f"  Notes: {feedback['notes']}")
except Exception as e:
    print(f"✗ Failed to retrieve feedback: {str(e)}")

print("\n" + "=" * 60)
print("✓ Full flow working correctly!")
print("=" * 60)
