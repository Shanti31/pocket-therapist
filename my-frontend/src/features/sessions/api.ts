import { Session, PatientProgress, Therapist } from './types';
import { mapSession, mapProgress, mapTherapist } from './mappers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchPatientSessions(patientId: number): Promise<Session[]> {
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/sessions`, {
    // next: { revalidate: 0 } or cache: 'no-store' if we want fresh data always
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch patient sessions');
  const json = await res.json();
  const rawSessions = json.data || [];
  return rawSessions.map(mapSession);
}

export async function fetchPatientProgress(patientId: number): Promise<PatientProgress> {
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/progress`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch patient progress');
  const json = await res.json();
  // json itself seems to be the object directly based on patients.py
  return mapProgress(json.data || json);
}

export async function fetchPatientTherapists(patientId: number): Promise<Therapist[]> {
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/therapists`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch patient therapists');
  const rawTherapists = await res.json();
  return (rawTherapists || []).map(mapTherapist);
}

export async function updateSessionStatus(patientId: number, sessionId: string, status: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/patients/${patientId}/sessions/${sessionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.ok;
}
