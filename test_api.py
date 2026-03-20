import requests
import json

# 1. GET all exercises
print('=== Fetching exercises ===')
resp = requests.get('http://localhost:8000/api/exercises/')
exercises = resp.json()
if isinstance(exercises, dict) and 'data' in exercises:
    exercises_list = exercises['data']
else:
    exercises_list = exercises

print(f'Found {len(exercises_list)} exercises')
if exercises_list:
    first_exercise = exercises_list[0]
    print(f'First exercise ID: {first_exercise.get("id")}')
    print(f'First exercise title: {first_exercise.get("title")}')

# 2. Create a program with exercises
if exercises_list:
    exercise_id = first_exercise.get('id')
    print(f'\n=== Creating program with exercise ===')
    resp = requests.post(
        'http://localhost:8000/api/programs',
        json={
            'title': 'Program with Exercise',
            'description': 'Test program with exercise',
            'exercise_ids': [exercise_id]
        }
    )
    print(f'Status: {resp.status_code}')
    program_data = resp.json()
    print(f'Response: {json.dumps(program_data, indent=2)}')

# 3. GET the program with exercises
print('\n=== Getting program with exercises ===')
if 'program_data' in locals() and resp.status_code == 200:
    program_id = program_data['data']['id']
    resp = requests.get(f'http://localhost:8000/api/programs/{program_id}')
    print(f'Status: {resp.status_code}')
    result = resp.json()
    print(f'Response: {json.dumps(result, indent=2)[:500]}...')
