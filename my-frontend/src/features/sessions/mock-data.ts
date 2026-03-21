import type { Therapist, Session, Exercise, PatientProgress } from './types';
import { v4 as uuidv4 } from 'uuid';

// ---- Exercices ----

const exercisesKnee: Exercise[] = [
  {
    id: 'ex-1',
    title: 'Flexion du genou',
    description: 'Allongé sur le dos, pliez doucement le genou en glissant le talon vers les fesses. Maintenez 5 secondes puis relâchez.',
    repetitions: 12,
    videoUrl: '',
  },
  {
    id: 'ex-2',
    title: 'Extension de la jambe',
    description: 'Assis sur une chaise, tendez la jambe devant vous et maintenez 5 secondes. Revenez lentement.',
    repetitions: 10,
    videoUrl: '',
  },
  {
    id: 'ex-3',
    title: 'Marche sur place',
    description: 'Marchez sur place pendant la durée indiquée en levant bien les genoux.',
    durationSeconds: 120,
    videoUrl: '',
  },
  {
    id: 'ex-4',
    title: 'Étirement quadriceps',
    description: 'Debout, attrapez votre cheville derrière vous et tirez doucement vers les fesses. Maintenez 20 secondes de chaque côté.',
    durationSeconds: 40,
    videoUrl: '',
  },
];

const exercicesShoulder: Exercise[] = [
  {
    id: 'ex-5',
    title: 'Élévation latérale',
    description: "Debout, bras le long du corps, levez les bras sur les côtés jusqu'à l'horizontale. Redescendez lentement.",
    repetitions: 15,
    videoUrl: '',
  },
  {
    id: 'ex-6',
    title: 'Rotation externe',
    description: 'Coude collé au corps, tournez l\'avant-bras vers l\'extérieur. Maintenez 3 secondes.',
    repetitions: 10,
    videoUrl: '',
  },
  {
    id: 'ex-7',
    title: 'Pendulaire',
    description: 'Penché en avant, laissez le bras pendre et faites de petits cercles. 30 secondes dans chaque sens.',
    durationSeconds: 60,
    videoUrl: '',
  },
];

/**
 * Load video URLs from Supabase backend and inject them into exercises
 */
export async function loadExercisesWithVideos(
  exercises: Exercise[]
): Promise<Exercise[]> {
  try {
    const response = await fetch('http://localhost:8000/api/videos');
    if (!response.ok) throw new Error('Failed to fetch videos');
    
    const { data: videos } = await response.json();
    
    console.log('Fetched videos from Supabase:', videos);
    console.log('Exercises to map:', exercises);
    
    // Sort videos by creation date (oldest first) to match exercise order
    const sortedVideos = [...(videos as Array<any>)].sort(
      (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
    );
    
    // Map videos to exercises by index (in order)
    return exercises.map((ex, index) => ({
      ...ex,
      videoUrl: sortedVideos[index]?.url || '',
    }));
  } catch (error) {
    console.error('Failed to load videos from Supabase:', error);
    return exercises; // Return with empty videoUrls if fetch fails
  }
}

// ---- Thérapeutes ----

export const mockTherapists: Therapist[] = [
  {
    id: 'th-1',
    firstName: 'Marie',
    lastName: 'Dupont',
    specialty: 'Kinésithérapie du genou',
  },
  {
    id: 'th-2',
    firstName: 'Jean',
    lastName: 'Martin',
    specialty: 'Rééducation épaule',
  },
];

// ---- Séances ----

// Generate fixed UUIDs for mock sessions (consistent across reloads)
const SESSION_IDS = {
  pending1: '550e8400-e29b-41d4-a716-446655440001',
  pending2: '550e8400-e29b-41d4-a716-446655440002',
  completed1: '550e8400-e29b-41d4-a716-446655440011',
  completed2: '550e8400-e29b-41d4-a716-446655440012',
  completed3: '550e8400-e29b-41d4-a716-446655440013',
};

export const mockPendingSessions: Session[] = [
  {
    id: SESSION_IDS.pending1,
    title: 'Rééducation genou — Jour 12',
    therapistId: 'th-1',
    therapistName: 'Dr. Marie Dupont',
    exercises: exercisesKnee,
    estimatedDurationMinutes: 20,
    status: 'pending',
    scheduledDate: new Date().toISOString(),
  },
  {
    id: SESSION_IDS.pending2,
    title: 'Mobilité épaule — Semaine 3',
    therapistId: 'th-2',
    therapistName: 'Dr. Jean Martin',
    exercises: exercicesShoulder,
    estimatedDurationMinutes: 15,
    status: 'pending',
    scheduledDate: new Date().toISOString(),
  },
];

export const mockCompletedSessions: Session[] = [
  {
    id: SESSION_IDS.completed1,
    title: 'Rééducation genou — Jour 11',
    therapistId: 'th-1',
    therapistName: 'Dr. Marie Dupont',
    exercises: exercisesKnee,
    estimatedDurationMinutes: 20,
    status: 'completed',
    scheduledDate: new Date(Date.now() - 86400000).toISOString(),
    completedDate: new Date(Date.now() - 86400000).toISOString(),
    painRating: 4,
  },
  {
    id: SESSION_IDS.completed2,
    title: 'Rééducation genou — Jour 10',
    therapistId: 'th-1',
    therapistName: 'Dr. Marie Dupont',
    exercises: exercisesKnee,
    estimatedDurationMinutes: 20,
    status: 'completed',
    scheduledDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    completedDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    painRating: 5,
  },
  {
    id: SESSION_IDS.completed3,
    title: 'Mobilité épaule — Semaine 2',
    therapistId: 'th-2',
    therapistName: 'Dr. Jean Martin',
    exercises: exercicesShoulder,
    estimatedDurationMinutes: 15,
    status: 'completed',
    scheduledDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    completedDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    painRating: 3,
  },
];

// ---- Progression ----

export const mockProgress: PatientProgress = {
  completedCount: 8,
  totalCount: 20,
  streakDays: 5,
  badges: [
    { id: 'b1', label: 'Première séance', earned: true },
    { id: 'b2', label: '5 jours consécutifs', earned: true },
    { id: 'b3', label: '10 séances complétées', earned: false },
    { id: 'b4', label: 'Zéro skip en 1 semaine', earned: false },
  ],
};
