/**
 * Types pour la Feature D : Expérience Patient et Séances
 */

export interface Therapist {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  avatarUrl?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  durationSeconds?: number; // si basé sur un timer
  repetitions?: number;     // si basé sur des répétitions
  imageUrl?: string;
  videoUrl?: string;        // URL de la vidéo d'instruction
}

/** Résultat d'un exercice dans la session (pour l'historique) */
export interface ExerciseResult {
  exerciseId: string;
  exerciseTitle: string;
  status: 'completed' | 'skipped';
  prePainRating?: number;  // douleur avant l'exercice (0-10)
  skipReason?: string;
}

export interface Session {
  id: string;
  title: string;
  therapistId: string;
  therapistName: string;
  exercises: Exercise[];
  estimatedDurationMinutes: number;
  status: 'pending' | 'in_progress' | 'completed';
  scheduledDate: string; // ISO date string
  completedDate?: string;
  painRating?: number;
  /** Résultats détaillés par exercice (disponible après complétion) */
  exerciseResults?: ExerciseResult[];
}

export type SkipReason =
  | 'too_painful'
  | 'no_time'
  | 'cannot_do'
  | 'other';

export const SKIP_REASON_LABELS: Record<SkipReason, string> = {
  too_painful: 'Trop douloureux',
  no_time: 'Pas le temps',
  cannot_do: "Je n'y arrive pas",
  other: 'Autre raison',
};

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

export type FatigueLevel = 'low' | 'moderate' | 'high';

export const FATIGUE_LABELS: Record<FatigueLevel, string> = {
  low: 'Peu fatigué',
  moderate: 'Moyennement fatigué',
  high: 'Très fatigué',
};

export interface SessionFeedback {
  sessionId: string;
  painRating: number;        // 1-10
  difficulty: DifficultyLevel;
  fatigue: FatigueLevel;
  comment?: string;
}

export interface ExerciseSkipFeedback {
  exerciseId: string;
  reason: SkipReason;
  customReason?: string;
}

export interface Badge {
  id: string;
  label: string;
  earned: boolean;
}

export interface PatientProgress {
  completedCount: number;
  totalCount: number;
  streakDays: number;
  badges: Badge[];
}
