#!/usr/bin/env python3
"""Final test of the session/feedback flow."""

from database import supabase

print("=" * 60)
print("FINAL TEST: Session + Feedback Flow")
print("=" * 60)

try:
    # Create session
    print("\n[1] Creating session...")
    session_resp = supabase.table("sessions").insert({
        "patient_id": 1,
        "status": "pending",
    }).execute()
    session_id = session_resp.data[0]['id']
    print(f"✓ Session created: {session_id}")
    
    # Create feedback
    print("[2] Creating feedback...")
    feedback_resp = supabase.table("session_feedback").insert({
        "session_id": session_id,
        "patient_id": 1,
        "pain_level": 5,
        "effort_level": 6,
        "notes": "Final test feedback",
    }).execute()
    print(f"✓ Feedback created")
    
    # Mark session as completed
    print("[3] Completing session...")
    supabase.table("sessions").update({
        "status": "completed",
    }).eq("id", session_id).execute()
    print(f"✓ Session marked as completed")
    
    # Retrieve feedback
    print("[4] Retrieving feedback...")
    retrieve_resp = supabase.table("session_feedback").select("*").eq(
        "session_id", session_id
    ).execute()
    feedback = retrieve_resp.data[0]
    print(f"✓ Retrieved feedback:")
    print(f"   Pain: {feedback['pain_level']}, Effort: {feedback['effort_level']}")
    
    print("\n" + "=" * 60)
    print("✓✓✓ ALL TESTS PASSED! ✓✓✓")
    print("=" * 60)
    
except Exception as e:
    print(f"\n✗ ERROR: {str(e)}")
    exit(1)
