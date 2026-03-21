import type { PatientRecent, PainAlert, DashboardStats } from './types';

/**
 * Données mock pour le Dashboard
 */

export const mockPainAlerts: PainAlert[] = [
  {
    id: 'alert-1',
    patientId: 'patient-1',
    patientName: 'Marie Martin',
    painLevel: 8,
    timestamp: '2026-03-18T15:00:00Z',
    comment: 'Beaucoup de douleur aujourd\'hui',
  },
];

export const mockRecentPatients: PatientRecent[] = [
  {
    id: 'patient-1',
    initials: 'PD',
    firstName: 'Pierre',
    lastName: 'Dubois',
    pathology: 'Fracture Poignet',
    adherence: {
      current: 1,
      total: 2,
    },
    painLevel: 4,
    difficulty: 5,
    lastSessionDate: '2026-03-20',
  },
  {
    id: 'patient-2',
    initials: 'JD',
    firstName: 'Jean',
    lastName: 'Dupont',
    pathology: 'Post-op Hanche Droite',
    adherence: {
      current: 4,
      total: 4,
    },
    painLevel: 2,
    difficulty: 3,
    lastSessionDate: '2026-03-20',
  },
  {
    id: 'patient-3',
    initials: 'MM',
    firstName: 'Marie',
    lastName: 'Martin',
    pathology: 'AVC Ischémique',
    adherence: {
      current: 2,
      total: 2,
    },
    painLevel: 0,
    difficulty: 5,
    lastSessionDate: '2026-03-19',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalPatients: 3,
  activeExercises: 8,
  activeAlerts: 1,
};
