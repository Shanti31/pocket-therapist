#!/usr/bin/env python3
"""Test script to verify session_feedback table structure in Supabase."""

from database import supabase

print("=" * 60)
print("Testing session_feedback table structure...")
print("=" * 60)

try:
    # Try to fetch the table structure
    response = supabase.table("session_feedback").select("*").limit(1).execute()
    print("✓ Table 'session_feedback' exists!")
    print(f"✓ Response contains {len(response.data)} records")
    
    if response.data:
        first_record = response.data[0]
        print("\nFirst record columns:")
        for key in first_record.keys():
            print(f"  - {key}: {type(first_record[key]).__name__}")
    else:
        print("\n⚠ Table is empty (no test data)")
    
except Exception as e:
    print(f"✗ ERROR: {str(e)}")
    print("\nPossible issues:")
    print("1. Table 'session_feedback' does not exist in Supabase")
    print("2. Connection to Supabase failed")
    print("3. Table columns don't match expected schema")

print("\n" + "=" * 60)
print("Expected table structure:")
print("=" * 60)
print("""
  - id: uuid (primary key, auto)
  - session_id: text
  - patient_id: integer
  - pain_level: integer (0-10)
  - effort_level: integer (1-10)
  - notes: text
  - created_at: timestamp (auto)
  - updated_at: timestamp (auto)
""")
