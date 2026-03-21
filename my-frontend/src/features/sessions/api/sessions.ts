/**
 * Session API client - handles session lifecycle operations
 */

const API_BASE = 'http://localhost:8000';

export interface CreateSessionPayload {
  patient_id: number;
}

export interface CreateSessionResponse {
  status: string;
  session_id: string;
  data: any[];
}

/**
 * Create a new session and return its UUID
 */
export async function createSession(payload: CreateSessionPayload): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CreateSessionResponse = await response.json();
    console.log('✓ Session created:', data.session_id);
    return data.session_id;
  } catch (error) {
    console.error('✗ Failed to create session:', error);
    return null;
  }
}

/**
 * Mark a session as completed
 */
export async function completeSession(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✓ Session completed:', sessionId);
    return true;
  } catch (error) {
    console.error('✗ Failed to complete session:', error);
    return false;
  }
}
