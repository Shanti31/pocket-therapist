'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  Session,
  SkipReason,
  ExerciseSkipFeedback,
  SessionFeedback,
  ExerciseResult,
} from '../types';
import SkipFeedbackSheet from './SkipFeedbackSheet';
import PostSessionFeedback from './PostSessionFeedback';

// ─── Pain emoji scale ───────────────────────────────────────────────────────
const PAIN_EMOJIS = ['😊', '🙂', '😐', '😕', '😣', '😖', '😫', '😰', '🤕', '😵', '💀'];
// index 0 = douleur 0, index 10 = douleur 10

// ─── Phase machine ───────────────────────────────────────────────────────────
type Phase = 'pre_pain' | 'video' | 'exercise';

interface SessionRunnerProps {
  session: Session;
  onComplete: () => void;
  onCancel: () => void;
}

export default function SessionRunner({ session, onComplete, onCancel }: SessionRunnerProps) {
  // ── Navigation state ────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('pre_pain');

  // ── Pre-pain state ───────────────────────────────────────────────────────
  const [selectedPain, setSelectedPain] = useState<number>(0);
  const [prePainRatings, setPrePainRatings] = useState<Record<string, number>>({});

  // ── Video state ──────────────────────────────────────────────────────────
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Timer state ──────────────────────────────────────────────────────────
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  // ── Session completion state ─────────────────────────────────────────────
  const [showSkipSheet, setShowSkipSheet] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [skippedExercises, setSkippedExercises] = useState<ExerciseSkipFeedback[]>([]);
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([]);

  const exercises = session.exercises;
  const currentExercise = exercises[currentIndex];
  const isLastExercise = currentIndex >= exercises.length - 1;

  // ── Reset phase whenever exercise changes ────────────────────────────────
  useEffect(() => {
    setPhase('pre_pain');
    setSelectedPain(0);
    setVideoEnded(false);
    setTimeRemaining(currentExercise?.durationSeconds ?? null);
    setTimerRunning(false);
  }, [currentIndex, currentExercise?.durationSeconds]);

  // ── Timer countdown (only runs in exercise phase) ─────────────────────────
  useEffect(() => {
    if (phase !== 'exercise') return;
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
  }, [timerRunning, timeRemaining, phase]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((currentIndex) / exercises.length) * 100;

  // ── Phase transitions ────────────────────────────────────────────────────
  const handlePrePainConfirm = () => {
    setPrePainRatings((prev) => ({ ...prev, [currentExercise.id]: selectedPain }));
    if (currentExercise.videoUrl) {
      setPhase('video');
    } else {
      // No video → go straight to exercise
      startExercisePhase();
    }
  };

  const startExercisePhase = () => {
    setPhase('exercise');
    if (currentExercise?.durationSeconds) {
      setTimeRemaining(currentExercise.durationSeconds);
      setTimerRunning(true);
    }
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  const handleSkipVideo = () => {
    setVideoEnded(true);
    startExercisePhase();
  };

  const handleStartAfterVideo = () => {
    startExercisePhase();
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const goToNext = useCallback(
    (skipped = false, skipReason?: string) => {
      // Record result
      setExerciseResults((prev) => [
        ...prev,
        {
          exerciseId: currentExercise.id,
          exerciseTitle: currentExercise.title,
          status: skipped ? 'skipped' : 'completed',
          prePainRating: prePainRatings[currentExercise.id],
          skipReason,
        },
      ]);

      if (isLastExercise) {
        setShowFeedback(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [isLastExercise, currentExercise, prePainRatings],
  );

  const handleSkipConfirm = (reason: SkipReason, customReason?: string) => {
    setSkippedExercises((prev) => [
      ...prev,
      { exerciseId: currentExercise.id, reason, customReason },
    ]);
    setShowSkipSheet(false);
    goToNext(true, customReason ?? reason);
  };

  const handleFeedbackSubmit = (feedback: SessionFeedback) => {
    console.log('Session feedback:', feedback);
    console.log('Skipped exercises:', skippedExercises);
    console.log('Exercise results:', exerciseResults);
    onComplete();
  };

  // ── Full-screen feedback ──────────────────────────────────────────────────
  if (showFeedback) {
    return (
      <PostSessionFeedback
        sessionId={session.id}
        onSubmit={handleFeedbackSubmit}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          ✕ Quitter
        </button>
        <span className="text-sm font-semibold text-gray-700">
          {session.title}
        </span>
        <span className="text-sm text-gray-500">
          {currentIndex + 1}/{exercises.length}
        </span>
      </div>

      {/* ── Progress bar ───────────────────────────────────────────────── */}
      <div className="w-full bg-gray-100 h-2">
        <div
          className="bg-[#00BAA8] h-1 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
        />
      </div>
      <div className="px-4 py-1.5 text-xs text-gray-400 text-right">
        Exercice {currentIndex + 1} sur {exercises.length}
      </div>

      {/* ── Phase: pre_pain ─────────────────────────────────────────────── */}
      {phase === 'pre_pain' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 text-center mb-2">
              Avant de commencer
            </p>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
              {currentExercise.title}
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">
              Quelle est votre douleur en ce moment ?
            </p>

        <p className="text-gray-600 text-center max-w-sm mb-8 leading-relaxed">
          {currentExercise.description}
        </p>

        {/* Timer display */}
        {timeRemaining !== null && (
          <div className="mb-6 text-center">
            <div className="text-5xl font-mono font-bold text-[#00BAA8]">
              {formatTime(timeRemaining)}
            </div>

            {/* Slider-style buttons */}
            <div className="flex justify-between gap-1 mb-2">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPain(i)}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                    selectedPain === i
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-8">
              <span>Aucune</span>
              <span>Insupportable</span>
            </div>

            <button
              onClick={handlePrePainConfirm}
              className="w-full py-4 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {/* ── Phase: video ────────────────────────────────────────────────── */}
      {phase === 'video' && currentExercise.videoUrl && (
        <div className="flex-1 flex flex-col">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-lg font-bold text-gray-900">{currentExercise.title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Regardez la vidéo avant de commencer</p>
          </div>

          {/* Video player */}
          <div className="relative bg-black flex-1 min-h-0">
            <video
              ref={videoRef}
              src={currentExercise.videoUrl}
              controls
              playsInline
              className="w-full h-full object-contain"
              onEnded={handleVideoEnded}
            />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white space-y-2">
            {videoEnded ? (
              <button
                onClick={handleStartAfterVideo}
                className="w-full py-4 bg-green-600 text-white text-base font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                🏃 Démarrer l&apos;exercice
              </button>
            ) : (
              <button
                onClick={handleSkipVideo}
                className="w-full py-3 text-gray-500 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Passer l&apos;instruction →
              </button>
            )}
          </div>
        </div>
      )}

        {/* Repetitions display */}
        {currentExercise.repetitions && (
          <div className="mb-6 text-center">
            <div className="text-5xl font-bold text-[#00BAA8]">
              {currentExercise.repetitions}
            </div>
            <p className="text-gray-500 mt-1">répétitions</p>
          </div>

      {/* Action buttons */}
      <div className="p-4 border-t border-gray-200 bg-white space-y-2">
        <button
          onClick={goToNext}
          className="w-full py-3.5 bg-[#00BAA8] text-white text-lg font-semibold rounded-xl hover:bg-[#008C7E] transition-colors"
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

      {/* ── Skip feedback sheet ─────────────────────────────────────────── */}
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
