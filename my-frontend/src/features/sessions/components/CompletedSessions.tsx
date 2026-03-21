'use client';

import { useState } from 'react';
import type { Session } from '../types';
import SessionDetails from './SessionDetails';

interface CompletedSessionsProps {
  sessions: Session[];
}

/**
 * Feature 6 – les sessions terminées sont cliquables
 * et ouvrent SessionDetails pour le récapitulatif détaillé.
 */
export default function CompletedSessions({ sessions }: CompletedSessionsProps) {
  const [detailSession, setDetailSession] = useState<Session | null>(null);

  if (sessions.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Séances terminées</h2>
        <p className="text-gray-500 text-sm">Aucune séance terminée pour le moment.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Séances terminées</h2>
      <div className="space-y-2">
        {sessions.map((session) => {
          const date = session.completedDate
            ? new Date(session.completedDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
              })
            : '';

          const completedCount = session.exerciseResults
            ? session.exerciseResults.filter((r) => r.status === 'completed').length
            : session.exercises.length;

          return (
            <button
              key={session.id}
              onClick={() => setDetailSession(session)}
              className="w-full text-left flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-green-600 text-lg">✓</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{session.title}</p>
                  <p className="text-xs text-gray-500">{date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {session.painRating !== undefined && (
                  <span className="text-xs text-gray-400">
                    {session.painRating}/10
                  </span>
                )}
                <span className="text-xs text-green-600 font-medium">
                  {completedCount}/{session.exercises.length}
                </span>
                <span className="text-xs text-gray-400">›</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail sheet */}
      {detailSession && (
        <SessionDetails
          session={detailSession}
          onClose={() => setDetailSession(null)}
        />
      )}
    </section>
  );
}
