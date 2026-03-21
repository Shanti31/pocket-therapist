import {
  PatientDashboard,
  fetchPatientSessions,
  fetchPatientProgress,
  fetchPatientTherapists,
  Session,
  PatientProgress,
  Therapist
} from '@/src/features/sessions';

export default async function PatientPage() {
  const patientId = 1; // Temporairement en dur

  let sessions: Session[] = [];
  let progress: PatientProgress = { completedCount: 0, totalCount: 0, streakDays: 0, badges: [] };
  let therapists: Therapist[] = [];

  try {
    // Paralléliser les appels
    const [fetchedSessions, fetchedProgress, fetchedTherapists] = await Promise.all([
      fetchPatientSessions(patientId),
      fetchPatientProgress(patientId),
      fetchPatientTherapists(patientId)
    ]);
    
    sessions = fetchedSessions;
    progress = fetchedProgress;
    therapists = fetchedTherapists;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  }

  const pendingSessions = sessions.filter(s => s.status === 'pending' || s.status === 'in_progress');
  const completedSessions = sessions.filter(s => s.status === 'completed');

  return (
    <PatientDashboard
      therapists={therapists}
      pendingSessions={pendingSessions}
      completedSessions={completedSessions}
      progress={progress}
    />
  );
}
