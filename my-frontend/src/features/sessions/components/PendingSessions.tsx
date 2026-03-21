'use client';

import { useState } from 'react';
import type { Session } from '../types';
import SessionPreviewSheet from './SessionPreviewSheet';

interface PendingSessionsProps {
  sessions: Session[];
  onStartSession: (sessionId: string) => void;
}

/**
 * Feature 3 – l'utilisateur clique sur la séance pour voir l'aperçu,
 * puis démarre depuis le BottomSheet.
 */
export default function PendingSessions({ sessions, onStartSession }: PendingSessionsProps) {
  const [previewSession, setPreviewSession] = useState<Session | null>(null);

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
          <button
            key={session.id}
            onClick={() => setPreviewSession(session)}
            className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 hover:shadow-md active:scale-98 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{session.title}</h3>
                <p className="text-sm text-gray-500">{session.therapistName}</p>
              </div>
              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full mt-0.5">
                Voir →
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>⏱ {session.estimatedDurationMinutes} min</span>
              <span>📋 {session.exercises.length} exercices</span>
              {session.exercises.some((e) => e.videoUrl) && (
                <span>🎥 Vidéos</span>
              )}
            </div>
            <button
              onClick={() => onStartSession(session.id)}
              className="w-full py-2.5 bg-[#00BAA8] text-white font-medium rounded-lg hover:bg-[#008C7E] transition-colors"
            >
              Démarrer
            </button>
          </div>
        ))}
      </div>

      {/* Preview sheet */}
      {previewSession && (
        <SessionPreviewSheet
          session={previewSession}
          onClose={() => setPreviewSession(null)}
          onStart={() => {
            setPreviewSession(null);
            onStartSession(previewSession.id);
          }}
        />
      )}
    </section>
  );
}
