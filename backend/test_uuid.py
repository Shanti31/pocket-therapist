#!/usr/bin/env python3
"""Check actual column types in session_feedback table."""

from database import supabase
import json

print("=" * 60)
print("Checking actual column schema...")
print("=" * 60)

try:
    # Query the table_info via SQL if available
    # Or just try different data types
    
    # Try with a proper UUID format
    import uuid
    test_uuid = str(uuid.uuid4())
    
    print(f"Attempting insertion with UUID: {test_uuid}...\n")
    
    response = supabase.table("session_feedback").insert({
        "session_id": test_uuid,  # Use a real UUID
        "patient_id": 1,
        "pain_level": 5,
        "effort_level": 6,
        "notes": "Test with UUID",
    }).execute()
    
    print("✓ SUCCESS with UUID!")
    print(f"✓ Inserted record:\n{json.dumps(response.data[0], indent=2, default=str)}")
    
    # Now delete this test record
    supabase.table("session_feedback").delete().eq("id", response.data[0]['id']).execute()
    print("\n✓ Test record deleted")
    
except Exception as e:
    print(f"✗ ERROR:\n{str(e)}")
