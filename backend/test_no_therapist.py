#!/usr/bin/env python3
"""Test session creation with NULL therapist_id."""

from database import supabase

print("=" * 60)
print("Testing Session Creation")
print("=" * 60)

# Try creating with NULL therapist_id
print("\n[1] Creating session with NULL therapist_id...")
try:
    session_resp = supabase.table("sessions").insert({
        "patient_id": 1,
        "status": "in_progress",
    }).execute()
    
    session_id = session_resp.data[0]['id'] if session_resp.data else None
    print(f"✓ Session created: {session_id}")
    
    # Now create feedback
    print("\n[2] Creating feedback...")
    feedback_resp = supabase.table("session_feedback").insert({
        "session_id": session_id,
        "patient_id": 1,
        "pain_level": 5,
        "effort_level": 6,
        "notes": "Demo feedback",
    }).execute()
    
    print(f"✓ Feedback created successfully")
    print(f"\n✓ Full flow WORKS!")
    
except Exception as e:
    print(f"✗ ERROR: {str(e)}")
