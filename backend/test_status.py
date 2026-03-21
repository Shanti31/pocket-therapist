#!/usr/bin/env python3
"""Test session creation with different status values."""

from database import supabase

print("=" * 60)
print("Testing Session Status Values")
print("=" * 60)

status_values = ["pending", "in_progress", "completed", "active"]

for status in status_values:
    print(f"\n[Testing] status = '{status}'...")
    try:
        session_resp = supabase.table("sessions").insert({
            "patient_id": 1,
            "status": status,
        }).execute()
        
        session_id = session_resp.data[0]['id']
        print(f"✓ SUCCESS! Session created with status='{status}'")
        print(f"  ID: {session_id}")
        
        # Try creating feedback too
        try:
            feedback_resp = supabase.table("session_feedback").insert({
                "session_id": session_id,
                "patient_id": 1,
                "pain_level": 5,
                "effort_level": 6,
                "notes": "Demo",
            }).execute()
            print(f"✓ Feedback also works!")
        except Exception as fe:
            print(f"⚠ Feedback failed: {str(fe)[:60]}")
        
        break  # Stop on first success
        
    except Exception as e:
        error = str(e)
        if "check constraint" in error:
            print(f"✗ Check constraint violation")
        else:
            print(f"✗ {error[:60]}")
