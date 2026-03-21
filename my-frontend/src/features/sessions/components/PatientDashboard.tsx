'use client';

import { useState, useCallback } from 'react';
import type { Therapist, Session, PatientProgress } from '../types';
import { loadExercisesWithVideos } from '../mock-data';
import TherapistList from './TherapistList';
import PendingSessions from './PendingSessions';
import CompletedSessions from './CompletedSessions';
import ProgressTracker from './ProgressTracker';
import SessionRunner from './SessionRunner';
import PatientNotesCard from './PatientNotesCard';

interface PatientDashboardProps {
  therapists: Therapist[];
  pendingSessions: Session[];
  completedSessions: Session[];
  progress: PatientProgress;
  patientId?: number;
  patientName?: string;
}

export default function PatientDashboard({
  therapists,
  pendingSessions,
  completedSessions,
  progress,
  patientId,
  patientName = 'Patient',
}: PatientDashboardProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const handleStartSession = useCallback(
    async (sessionId: string) => {
      const session = pendingSessions.find((s) => s.id === sessionId);
      if (!session) return;

      // Load videos from Supabase
      const exercisesWithVideos = await loadExercisesWithVideos(session.exercises);

      setActiveSession({
        ...session,
        exercises: exercisesWithVideos,
      });
      setActiveSessionId(sessionId);
    },
    [pendingSessions]
  );

  // If a session is active, show the full-screen SessionRunner
  if (activeSession) {
    return (
      <SessionRunner
        session={activeSession}
        onComplete={() => {
          setActiveSessionId(null);
          setActiveSession(null);
        }}
        onCancel={() => {
          setActiveSessionId(null);
          setActiveSession(null);
        }}
      />
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bonjour {patientName} ! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Prêt pour votre séance d'aujourd'hui ?</p>
      </div>

      {/* Feature 6 progression globale */}
      <ProgressTracker progress={progress} />

      {/* Feature 3 – aperçu + démarrage */}
      <PendingSessions
        sessions={pendingSessions}
        onStartSession={handleStartSession}
      />

      <TherapistList therapists={therapists} />

      {/* Feature 6 – historique cliquable */}
      <CompletedSessions sessions={completedSessions} />

      {/* Feature 7 – journal de bord */}
      <PatientNotesCard patientId={patientId} />
    </div>
  );
}
