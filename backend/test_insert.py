#!/usr/bin/env python3
"""Test insertion into session_feedback table."""

from database import supabase

print("=" * 60)
print("Testing insertion into session_feedback table...")
print("=" * 60)

try:
    # Try to insert a test record
    response = supabase.table("session_feedback").insert({
        "session_id": "test-session-001",
        "patient_id": 1,
        "pain_level": 5,
        "effort_level": 6,
        "notes": "Test feedback",
    }).execute()
    
    print("✓ Insertion successful!")
    print(f"✓ Record inserted: {response.data}")
    
except Exception as e:
    print(f"✗ INSERTION ERROR:\n{str(e)}")
    print("\nThis is the actual error from Supabase.")
    print("Possible issues:")
    print("1. Column names don't match (check exact column names in Supabase)")
    print("2. Foreign key constraint failed (patient_id doesn't exist)")
    print("3. Data type mismatch (e.g., pain_level must be integer)")
    print("4. Row-level security (RLS) policy blocks insertion")
