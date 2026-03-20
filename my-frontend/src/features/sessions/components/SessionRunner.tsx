'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Session, SkipReason, ExerciseSkipFeedback, SessionFeedback } from '../types';
import SkipFeedbackSheet from './SkipFeedbackSheet';
import PostSessionFeedback from './PostSessionFeedback';

interface SessionRunnerProps {
  session: Session;
  onComplete: () => void;
  onCancel: () => void;
}

export default function SessionRunner({
  session,
  onComplete,
  onCancel,
}: SessionRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSkipSheet, setShowSkipSheet] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [skippedExercises, setSkippedExercises] = useState<ExerciseSkipFeedback[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  const exercises = session.exercises;
  const currentExercise = exercises[currentIndex];
  const isLastExercise = currentIndex >= exercises.length - 1;

  // Initialize timer when exercise changes
  useEffect(() => {
    if (currentExercise?.durationSeconds) {
      setTimeRemaining(currentExercise.durationSeconds);
      setTimerRunning(true);
    } else {
      setTimeRemaining(null);
      setTimerRunning(false);
    }
  }, [currentIndex, currentExercise]);

  // Timer countdown
  useEffect(() => {
    if (!timerRunning || timeRemaining === null || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timeRemaining]);

  const goToNext = useCallback(() => {
    if (isLastExercise) {
      setShowFeedback(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLastExercise]);

  const handleSkipConfirm = (reason: SkipReason, customReason?: string) => {
    setSkippedExercises((prev) => [
      ...prev,
      {
        exerciseId: currentExercise.id,
        reason,
        customReason,
      },
    ]);
    setShowSkipSheet(false);
    goToNext();
  };

  const handleFeedbackSubmit = (feedback: SessionFeedback) => {
    // In real app: send feedback + skippedExercises to API
    console.log('Session feedback:', feedback);
    console.log('Skipped exercises:', skippedExercises);
    onComplete();
  };

  // Full-screen post-session feedback
  if (showFeedback) {
    return (
      <PostSessionFeedback
        sessionId={session.id}
        onSubmit={handleFeedbackSubmit}
      />
    );
  }

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          ✕ Quitter
        </button>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {exercises.length}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {session.title}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-1">
        <div
          className="bg-blue-600 h-1 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
        />
      </div>

      {/* Exercise content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          {currentExercise.title}
        </h2>

        <p className="text-gray-600 text-center max-w-sm mb-8 leading-relaxed">
          {currentExercise.description}
        </p>

        {/* Timer display */}
        {timeRemaining !== null && (
          <div className="mb-6 text-center">
            <div className="text-5xl font-mono font-bold text-blue-600">
              {formatTime(timeRemaining)}
            </div>
            {timeRemaining === 0 && (
              <p className="text-green-600 font-medium mt-2">Temps écoulé !</p>
            )}
            {timeRemaining > 0 && (
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="mt-2 text-sm text-gray-500 underline"
              >
                {timerRunning ? 'Pause' : 'Reprendre'}
              </button>
            )}
          </div>
        )}

        {/* Repetitions display */}
        {currentExercise.repetitions && (
          <div className="mb-6 text-center">
            <div className="text-5xl font-bold text-blue-600">
              {currentExercise.repetitions}
            </div>
            <p className="text-gray-500 mt-1">répétitions</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t border-gray-200 bg-white space-y-2">
        <button
          onClick={goToNext}
          className="w-full py-3.5 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          {isLastExercise ? 'Terminer' : 'Suivant →'}
        </button>
        <button
          onClick={() => setShowSkipSheet(true)}
          className="w-full py-2.5 text-gray-500 font-medium hover:text-gray-700 transition-colors"
        >
          Passer cet exercice
        </button>
      </div>

      {/* Skip feedback sheet */}
      {showSkipSheet && (
        <SkipFeedbackSheet
          exerciseTitle={currentExercise.title}
          onConfirmSkip={handleSkipConfirm}
          onCancel={() => setShowSkipSheet(false)}
        />
      )}
    </div>
  );
}
