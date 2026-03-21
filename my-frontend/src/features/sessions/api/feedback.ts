const API_BASE = 'http://localhost:8000';

export interface SessionFeedback {
  session_id: string;
  patient_id: number;
  pain_rating: number;
  fatigue: string;
  difficulty: string;
  comment?: string;
}

/**
 * Save session feedback to Supabase
 */
export async function saveSessionFeedback(feedback: SessionFeedback): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/session-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Feedback saved:', data);
    return true;
  } catch (error) {
    console.error('Failed to save feedback:', error);
    return false;
  }
}

/**
 * Retrieve feedback for a specific session
 */
export async function getSessionFeedback(sessionId: string) {
  try {
    const response = await fetch(`${API_BASE}/api/session-feedback/${sessionId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch session feedback:', error);
    return null;
  }
}

/**
 * Retrieve all feedback for a patient
 */
export async function getPatientFeedback(patientId: number) {
  try {
    const response = await fetch(`${API_BASE}/api/patient-feedback/${patientId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch patient feedback:', error);
    return [];
  }
}
