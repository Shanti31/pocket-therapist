'use client';

import type { Session } from '../types';

interface SessionPreviewSheetProps {
  session: Session;
  onStart: () => void;
  onClose: () => void;
}

/**
 * Feature 3 – Aperçu du programme
 * BottomSheet qui liste les exercices de la séance avant démarrage.
 */
export default function SessionPreviewSheet({ session, onClose, onStart }: SessionPreviewSheetProps) {
  const totalSeconds = session.exercises.reduce(
    (acc, ex) => acc + (ex.durationSeconds ?? 120),
    0,
  );
  const totalMin = Math.ceil(totalSeconds / 60);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl max-h-[80vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-2 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{session.title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {session.therapistName} · {session.exercises.length} exercices · ~{totalMin} min
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4 mt-0.5"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
          {session.exercises.map((exercise, index) => {
            const durMin = exercise.durationSeconds
              ? Math.ceil(exercise.durationSeconds / 60)
              : null;
            const reps = exercise.repetitions;

            return (
              <div
                key={exercise.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                {/* Index badge */}
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                </div>

                {/* Exercise info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{exercise.title}</p>
                  {exercise.videoUrl && (
                    <p className="text-xs text-blue-500 mt-0.5">🎥 Vidéo disponible</p>
                  )}
                </div>

                {/* Duration / reps */}
                <div className="text-right flex-shrink-0">
                  {durMin && (
                    <span className="text-xs text-gray-500">⏱ {durMin} min</span>
                  )}
                  {!durMin && reps && (
                    <span className="text-xs text-gray-500">× {reps} reps</span>
                  )}
                  {!durMin && !reps && (
                    <span className="text-xs text-gray-400">–</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={onStart}
            className="w-full py-4 bg-blue-600 text-white text-base font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all"
          >
            Démarrer la séance 🚀
          </button>
        </div>
      </div>
    </>
  );
}
