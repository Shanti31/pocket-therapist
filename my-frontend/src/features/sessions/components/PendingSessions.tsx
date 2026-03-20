'use client';

import type { Session } from '../types';

interface PendingSessionsProps {
  sessions: Session[];
  onStartSession: (sessionId: string) => void;
}

export default function PendingSessions({ sessions, onStartSession }: PendingSessionsProps) {
  if (sessions.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Séances à faire</h2>
        <p className="text-gray-500 text-sm">Aucune séance prévue pour le moment.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Séances à faire</h2>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{session.title}</h3>
                <p className="text-sm text-gray-500">{session.therapistName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span>⏱ {session.estimatedDurationMinutes} min</span>
              <span>📋 {session.exercises.length} exercices</span>
            </div>
            <button
              onClick={() => onStartSession(session.id)}
              className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Démarrer
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
