'use client';

import { useState } from 'react';
import type { Therapist, Session, PatientProgress } from '../types';
import TherapistList from './TherapistList';
import PendingSessions from './PendingSessions';
import CompletedSessions from './CompletedSessions';
import ProgressTracker from './ProgressTracker';
import SessionRunner from './SessionRunner';

interface PatientDashboardProps {
  therapists: Therapist[];
  pendingSessions: Session[];
  completedSessions: Session[];
  progress: PatientProgress;
}

export default function PatientDashboard({
  therapists,
  pendingSessions,
  completedSessions,
  progress,
}: PatientDashboardProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const activeSession = pendingSessions.find((s) => s.id === activeSessionId);

  // If a session is active, show the SessionRunner in full-screen mode
  if (activeSession) {
    return (
      <SessionRunner
        session={activeSession}
        onComplete={() => setActiveSessionId(null)}
        onCancel={() => setActiveSessionId(null)}
      />
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bonjour 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Voici votre programme du jour</p>
      </div>

      <ProgressTracker progress={progress} />

      <PendingSessions
        sessions={pendingSessions}
        onStartSession={(id) => setActiveSessionId(id)}
      />

      <TherapistList therapists={therapists} />

      <CompletedSessions sessions={completedSessions} />
    </div>
  );
}
