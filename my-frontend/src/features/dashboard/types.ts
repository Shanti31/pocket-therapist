/**
 * Types pour le Dashboard Thérapeute
 */

export interface PatientRecent {
  id: string;
  initials: string;
  firstName: string;
  lastName: string;
  pathology: string;
  adherence: {
    current: number;
    total: number;
  };
  painLevel: number; // 0-10
  difficulty: number; // 0-10
  lastSessionDate: string;
}

export interface PainAlert {
  id: string;
  patientId: string;
  patientName: string;
  painLevel: number; // 0-10
  timestamp: string;
  comment: string;
}

export interface DashboardStats {
  totalPatients: number;
  activeExercises: number;
  activeAlerts: number;
}
