#!/usr/bin/env python3
"""Test to reproduce the patients list endpoint issue."""

import requests
import time

API_BASE = "http://localhost:8000"

print("=" * 60)
print("Testing Patients API Endpoint")
print("=" * 60)

# Test 1: Get all patients
print("\n[1] GET /api/patients (fetch all)")
try:
    response = requests.get(f"{API_BASE}/api/patients")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Fetched {len(data.get('data', []))} patients")
    else:
        print(f"✗ Error: {response.text}")
except Exception as e:
    print(f"✗ Request failed: {str(e)}")

# Test 2: Get a single patient (simulate navigation to detail page)
print("\n[2] GET /api/patients/1 (navigate to detail)")
try:
    response = requests.get(f"{API_BASE}/api/patients/1")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✓ Fetched patient details")
    else:
        print(f"! Not found (expected if no patient with id=1): {response.text[:100]}")
except Exception as e:
    print(f"✗ Request failed: {str(e)}")

# Test 3: Get all patients again (simulate going back)
print("\n[3] GET /api/patients again (go back to list)")
try:
    time.sleep(0.5)
    response = requests.get(f"{API_BASE}/api/patients")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Fetched {len(data.get('data', []))} patients")
    else:
        print(f"✗ Error: {response.text}")
except Exception as e:
    print(f"✗ Request failed: {str(e)}")

# Test 4: Multiple rapid requests (stress test)
print("\n[4] Multiple rapid requests")
for i in range(3):
    try:
        response = requests.get(f"{API_BASE}/api/patients")
        print(f"  Request {i+1}: Status {response.status_code}")
    except Exception as e:
        print(f"  Request {i+1}: Failed - {str(e)}")
    time.sleep(0.2)

print("\n" + "=" * 60)
