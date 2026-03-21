import { Session, Therapist, Exercise, PatientProgress } from './types';

// Map the Supabase backend response to the frontend Session format
export function mapSession(backendSession: any): Session {
  // Extract therapists, handling object or array
  const therapistObj = Array.isArray(backendSession.therapists) 
    ? backendSession.therapists[0] 
    : backendSession.therapists;
    
  // Format therapist name
  const therapistName = therapistObj 
    ? `Dr. ${therapistObj.first_name || therapistObj.firstName || ''} ${therapistObj.last_name || therapistObj.lastName || ''}`.trim()
    : 'Thérapeute inconnu';

  // Map exercises
  const sessionExercisesRaw = backendSession.session_exercises || [];
  const exercises: Exercise[] = sessionExercisesRaw.map((se: any) => {
    const video = se.video_metadata || se.videos_metadata;
    if (!video) return null;
    return {
      id: video.id,
      title: video.title || 'Exercice',
      description: video.description || 'Description indisponible',
      durationSeconds: video.duration_seconds || video.durationSeconds,
      repetitions: video.repetitions,
      imageUrl: video.thumbnail_url || video.imageUrl,
      videoUrl: video.video_url || video.videoUrl,   // URL de la vidéo d'instruction
    };
  }).filter(Boolean) as Exercise[];

  // Calculate total duration (assume 2 min roughly per exercise if no duration)
  const estimatedDurationMinutes = exercises.reduce((total: number, ex: Exercise) => {
    return total + (ex.durationSeconds ? Math.ceil(ex.durationSeconds / 60) : 2);
  }, 0) || 10;

  return {
    id: backendSession.id,
    title: backendSession.title || 'Séance de rééducation',
    therapistId: backendSession.therapist_id,
    therapistName,
    exercises,
    estimatedDurationMinutes,
    status: backendSession.status === 'completed' ? 'completed' : 'pending',
    scheduledDate: backendSession.created_at || new Date().toISOString(),
    completedDate: backendSession.updated_at,
  };
}

export function mapProgress(backendProgress: any): PatientProgress {
  return {
    completedCount: backendProgress.completedCount || 0,
    totalCount: backendProgress.totalCount || 0,
    streakDays: backendProgress.streakDays || 0,
    badges: (backendProgress.badges || []).map((b: any, i: number) => {
      // Si la db retourne juste des strings (ce qui semble être le cas dans patients.py)
      if (typeof b === 'string') {
        return { id: `b${i}`, label: b, earned: true };
      }
      return b;
    }),
  };
}

export function mapTherapist(backendTherapist: any): Therapist {
  return {
    id: backendTherapist.id,
    firstName: backendTherapist.first_name || backendTherapist.firstName || '',
    lastName: backendTherapist.last_name || backendTherapist.lastName || '',
    specialty: backendTherapist.specialty || backendTherapist.speciality || 'Spécialiste',
  };
}
