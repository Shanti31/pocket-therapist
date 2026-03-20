/**
 * Feature: Expérience Patient et Séances
 * Module qui gère ce que le patient voit au quotidien
 */

// Types
export type {
  Therapist,
  Session,
  Exercise,
  SessionFeedback,
  ExerciseSkipFeedback,
  PatientProgress,
  Badge,
  SkipReason,
  DifficultyLevel,
  FatigueLevel,
} from './types';

export { SKIP_REASON_LABELS, DIFFICULTY_LABELS, FATIGUE_LABELS } from './types';

// Mock data (kept for fallback/reference if needed)
export {
  mockTherapists,
  mockPendingSessions,
  mockCompletedSessions,
  mockProgress,
} from './mock-data';

// API
export {
  fetchPatientSessions,
  fetchPatientProgress,
  fetchPatientTherapists,
  updateSessionStatus,
} from './api';

// Components
export { default as PatientDashboard } from './components/PatientDashboard';
export { default as SessionRunner } from './components/SessionRunner';
export { default as PostSessionFeedback } from './components/PostSessionFeedback';
export { default as TherapistList } from './components/TherapistList';
export { default as PendingSessions } from './components/PendingSessions';
export { default as CompletedSessions } from './components/CompletedSessions';
export { default as ProgressTracker } from './components/ProgressTracker';
export { default as SkipFeedbackSheet } from './components/SkipFeedbackSheet';
