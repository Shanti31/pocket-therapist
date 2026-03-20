import {
  PatientDashboard,
  mockTherapists,
  mockPendingSessions,
  mockCompletedSessions,
  mockProgress,
} from '@/src/features/sessions';

export default function PatientPage() {
  return (
    <PatientDashboard
      therapists={mockTherapists}
      pendingSessions={mockPendingSessions}
      completedSessions={mockCompletedSessions}
      progress={mockProgress}
    />
  );
}
