#!/usr/bin/env python3
"""Test insertion with real UUID format."""

from database import supabase

print("=" * 60)
print("Testing insertion with UUID format...")
print("=" * 60)

# Use a valid UUID format matching the mock frontend sessions
test_session_id = '550e8400-e29b-41d4-a716-446655440001'

try:
    response = supabase.table("session_feedback").insert({
        "session_id": test_session_id,
        "patient_id": 1,
        "pain_level": 5,
        "effort_level": 6,
        "notes": "Test feedback with UUID session",
    }).execute()
    
    print("✓ Insertion SUCCESS!")
    print(f"✓ Record inserted with session_id: {test_session_id}")
    print(f"✓ Data: {response.data}")
    
    # Delete the test record
    if response.data:
        record_id = response.data[0]['id']
        supabase.table("session_feedback").delete().eq("id", record_id).execute()
        print(f"\n✓ Test record cleaned up")
    
except Exception as e:
    print(f"✗ ERROR:\n{str(e)}")
    print("\nDebugging info:")
    print(f"  Session ID used: {test_session_id}")
    print(f"  Patient ID: 1")
    print(f"  Expected columns: session_id (UUID), patient_id (int), pain_level (int), effort_level (int), notes (text)")
