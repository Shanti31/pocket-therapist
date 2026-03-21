#!/usr/bin/env python3
"""Check the sessions table structure."""

from database import supabase

print("=" * 60)
print("Checking sessions table structure...")
print("=" * 60)

try:
    # Fetch one record to see columns
    response = supabase.table("sessions").select("*").limit(1).execute()
    
    if response.data:
        first_record = response.data[0]
        print("\nSessions table columns:")
        for key in sorted(first_record.keys()):
            value = first_record[key]
            print(f"  - {key}: {type(value).__name__} = {value}")
    else:
        print("\n⚠ Table is empty (no test data)")
        print("\nTrying to get column info via direct query...")
        # If table is empty, just show what columns we expect
        
except Exception as e:
    print(f"✗ ERROR: {str(e)}")
    print("\nPossible issues:")
    print("1. sessions table doesn't exist")
    print("2. Connection to Supabase failed")
