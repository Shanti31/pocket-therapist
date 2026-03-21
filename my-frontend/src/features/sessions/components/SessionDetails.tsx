'use client';

import { useState } from 'react';
import type { Session, ExerciseResult } from '../types';

interface SessionDetailsProps {
  session: Session;
  onClose: () => void;
}

/**
 * Feature 6 – Historique détaillé d'une séance
 * BottomSheet/overlay affichant les exercices complétés, passés et les retours.
 */
export default function SessionDetails({ session, onClose }: SessionDetailsProps) {
  const results: ExerciseResult[] = session.exerciseResults ?? [];

  const completed = results.filter((r) => r.status === 'completed');
  const skipped = results.filter((r) => r.status === 'skipped');

  // If no results recorded (old session), fall back to listing all exercises as completed
  const exercisesToShow: ExerciseResult[] =
    results.length > 0
      ? results
      : session.exercises.map((ex) => ({
          exerciseId: ex.id,
          exerciseTitle: ex.title,
          status: 'completed' as const,
        }));

  const date = session.completedDate
    ? new Date(session.completedDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl max-h-[85vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-2 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{session.title}</h3>
            {date && <p className="text-sm text-gray-400 mt-0.5">{date}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4 mt-0.5"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex gap-0 border-b border-gray-100">
          <div className="flex-1 text-center py-3">
            <p className="text-xl font-bold text-green-600">{completed.length}</p>
            <p className="text-xs text-gray-400">Complétés</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="flex-1 text-center py-3">
            <p className="text-xl font-bold text-orange-500">{skipped.length}</p>
            <p className="text-xs text-gray-400">Passés</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="flex-1 text-center py-3">
            <p className="text-xl font-bold text-gray-700">
              {session.painRating !== undefined ? `${session.painRating}/10` : '–'}
            </p>
            <p className="text-xs text-gray-400">Douleur fin</p>
          </div>
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Détail des exercices
          </p>
          {exercisesToShow.map((result, index) => (
            <div
              key={result.exerciseId}
              className={`p-3 rounded-xl border ${
                result.status === 'completed'
                  ? 'bg-green-50 border-green-100'
                  : 'bg-orange-50 border-orange-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {result.status === 'completed' ? '✅' : '⏭️'}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {index + 1}. {result.exerciseTitle}
                  </p>
                  <div className="flex gap-3 mt-0.5">
                    <span
                      className={`text-xs font-medium ${
                        result.status === 'completed' ? 'text-green-600' : 'text-orange-500'
                      }`}
                    >
                      {result.status === 'completed' ? 'Complété' : 'Passé'}
                    </span>
                    {result.prePainRating !== undefined && (
                      <span className="text-xs text-gray-400">
                        Douleur avant : {result.prePainRating}/10
                      </span>
                    )}
                    {result.skipReason && (
                      <span className="text-xs text-gray-400">
                        Raison : {result.skipReason}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
