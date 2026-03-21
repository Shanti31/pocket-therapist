'use client';

import { useState } from 'react';
import type { Therapist, Session, PatientProgress } from '../types';
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
}

export default function PatientDashboard({
  therapists,
  pendingSessions,
  completedSessions,
  progress,
  patientId,
}: PatientDashboardProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const activeSession = pendingSessions.find((s) => s.id === activeSessionId);

  // If a session is active, show the full-screen SessionRunner
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

      {/* Feature 6 progression globale */}
      <ProgressTracker progress={progress} />

      {/* Feature 3 – aperçu + démarrage */}
      <PendingSessions
        sessions={pendingSessions}
        onStartSession={(id) => setActiveSessionId(id)}
      />

      <TherapistList therapists={therapists} />

      {/* Feature 6 – historique cliquable */}
      <CompletedSessions sessions={completedSessions} />

      {/* Feature 7 – journal de bord */}
      <PatientNotesCard patientId={patientId} />
    </div>
  );
}
