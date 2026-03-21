import {
  PatientDashboard,
  mockPendingSessions,
  mockCompletedSessions,
  mockProgress,
  mockTherapists,
} from '@/src/features/sessions';

export default function PatientPage() {
  // Patient fictif pour la démo
  const patientName = 'Jean';
  
  // Utiliser directement les mock data (pas d'appels API)
  const pendingSessions = mockPendingSessions;
  const completedSessions = mockCompletedSessions;
  const progress = mockProgress;
  const therapists = mockTherapists;

  return (
    <PatientDashboard
      therapists={therapists}
      pendingSessions={pendingSessions}
      completedSessions={completedSessions}
      progress={progress}
      patientName={patientName}
    />
  );
}
