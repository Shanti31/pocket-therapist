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
import { createSession, completeSession } from '../api/sessions';

// --- Pain emoji scale ---------------------------------------------------
const PAIN_EMOJIS = ['😊', '🙂', '😐', '😕', '😣', '😖', '😫', '😰', '🤕', '😵', '💀'];
// index 0 = douleur 0, index 10 = douleur 10

// --- Phase machine ---------------------------------------------------
type Phase = 'initial_pain' | 'pre_exercise' | 'exercise';

interface SessionRunnerProps {
  session: Session;
  onComplete: () => void;
  onCancel: () => void;
}

export default function SessionRunner({ session, onComplete, onCancel }: SessionRunnerProps) {
  // -- Navigation state --
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('initial_pain');

  // -- Session state --
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionIdLoading, setSessionIdLoading] = useState(true);

  // -- Session-level pain state --
  const [hasStartedSession, setHasStartedSession] = useState(false);
  const [sessionInitialPain, setSessionInitialPain] = useState<number>(0);
  const [selectedPain, setSelectedPain] = useState<number>(0);

  // -- Video state --
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // -- Timer state --
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  // -- Session completion state --
  const [showSkipSheet, setShowSkipSheet] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [skippedExercises, setSkippedExercises] = useState<ExerciseSkipFeedback[]>([]);
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([]);

  const exercises = session.exercises;
  const currentExercise = exercises[currentIndex];
  const isLastExercise = currentIndex >= exercises.length - 1;

  // -- Create session in backend on mount --
  useEffect(() => {
    const initSession = async () => {
      const newSessionId = await createSession({
        patient_id: 1, // Demo: hardcoded patient ID
      });
      setSessionId(newSessionId);
      setSessionIdLoading(false);
    };
    
    initSession();
  }, []); // Only on mount

  // -- Debug logs --
  useEffect(() => {
    console.log(`Exercise ${currentIndex + 1}:`, {
      title: currentExercise?.title,
      videoUrl: currentExercise?.videoUrl,
      hasVideo: !!currentExercise?.videoUrl,
    });
  }, [currentIndex, currentExercise]);

  // -- Reset phase when moving to next exercise (skip initial_pain phase) --
  useEffect(() => {
    if (!hasStartedSession) return; // Don't reset if session hasn't started yet
    setPhase('pre_exercise');
    setSelectedPain(0);
    setVideoEnded(false);
    setTimeRemaining(currentExercise?.durationSeconds ?? null);
    setTimerRunning(false);
  }, [currentIndex, hasStartedSession, currentExercise?.durationSeconds]);

  // -- Timer countdown (only runs in exercise phase) --
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

  // -- Helpers --
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((currentIndex) / exercises.length) * 100;

  // -- Phase transitions --
  const handleInitialPainConfirm = () => {
    // Save initial session pain and mark session as started
    setSessionInitialPain(selectedPain);
    setHasStartedSession(true);
    setPhase('pre_exercise');
  };

  const handlePrePainConfirm = () => {
    startExercisePhase();
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

  // -- Navigation --
  const goToNext = useCallback(
    (skipped = false, skipReason?: string) => {
      // Record result
      setExerciseResults((prev) => [
        ...prev,
        {
          exerciseId: currentExercise.id,
          exerciseTitle: currentExercise.title,
          status: skipped ? 'skipped' : 'completed',
          prePainRating: sessionInitialPain,
          skipReason,
        },
      ]);

      if (isLastExercise) {
        // Go directly to feedback (no final pain screen)
        setShowFeedback(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [isLastExercise, currentExercise, sessionInitialPain],
  );



  const handleSkipConfirm = (reason: SkipReason, customReason?: string) => {
    setSkippedExercises((prev) => [
      ...prev,
      { exerciseId: currentExercise.id, reason, customReason },
    ]);
    setShowSkipSheet(false);
    goToNext(true, customReason ?? reason);
  };

  const handleFeedbackSubmit = async (feedback: SessionFeedback) => {
    console.log('Session feedback:', feedback);
    console.log('Initial pain:', sessionInitialPain);
    console.log('Final pain:', selectedPain);
    console.log('Skipped exercises:', skippedExercises);
    console.log('Exercise results:', exerciseResults);
    
    // Mark session as completed in backend
    if (sessionId) {
      await completeSession(sessionId);
    }
    
    onComplete();
  };

  // -- Full-screen feedback --
  if (showFeedback) {
    return (
      <PostSessionFeedback
        sessionId={sessionId || session.id}
        patientId={1}
        onSubmit={handleFeedbackSubmit}
      />
    );
  }

  // -- Safety check: ensure we have exercises --
  if (!currentExercise) {
    return (
      <div className="fixed inset-0 z-40 bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-500 mb-6">Aucun exercice disponible pour cette séance.</p>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-[#00BAA8] text-white font-semibold rounded-lg hover:bg-[#008C7E]"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // ---
  // RENDER
  // ---
  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col">
      {/* -- Header -- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          ✕ Quitter
        </button>
        {hasStartedSession && (
          <span className="text-sm font-semibold text-gray-900 flex-1 text-center px-4">
            {currentExercise?.title}
          </span>
        )}
        {!hasStartedSession && (
          <span className="text-sm font-semibold text-gray-700 flex-1 text-center px-4">
            {session.title}
          </span>
        )}
        <span className="text-sm text-gray-500">
          {currentIndex + 1}/{exercises.length}
        </span>
      </div>

      {/* -- Progress bar with all exercises -- */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex gap-1.5">
          {exercises.map((exercise, index) => {
            let bgColor = 'bg-gray-200'; // À faire
            if (index < currentIndex) {
              // Exercice complété ou sauté
              const isSkipped = skippedExercises.some(s => s.exerciseId === exercise.id);
              bgColor = isSkipped ? 'bg-yellow-400' : 'bg-[#00BAA8]';
            } else if (index === currentIndex && hasStartedSession) {
              // Exercice actuel
              bgColor = 'bg-[#00BAA8] ring-2 ring-offset-2 ring-[#00BAA8]';
            }
            
            return (
              <div
                key={exercise.id}
                className={`flex-1 h-2 rounded-full transition-all ${bgColor}`}
                title={exercise.title}
              />
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Exercice {currentIndex + 1} sur {exercises.length}
        </p>
      </div>

      {/* -- Phase: initial_pain (only at session start) -- */}
      {phase === 'initial_pain' && !hasStartedSession && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-lg space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comment évaluez-vous votre douleur avant de commencer ?
              </h2>
              <p className="text-gray-500">
                Cela nous aide à adapter l'exercice à votre état actuel
              </p>
            </div>

            {/* Pain scale with emojis */}
            <div className="space-y-4">
              <div className="flex justify-between gap-1">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPain(i)}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      selectedPain === i
                        ? 'bg-[#00BAA8] text-white shadow-lg scale-110'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 px-1">
                <span>Aucune douleur</span>
                <span>Douleur extrême</span>
              </div>
            </div>

            {/* Large emoji display */}
            <div className="text-center">
              <div className="text-8xl mb-4">
                {PAIN_EMOJIS[selectedPain]}
              </div>
              <p className="text-gray-600 font-semibold">
                Niveau de douleur: <span className="text-[#00BAA8] text-xl">{selectedPain}/10</span>
              </p>
            </div>

            {/* Button */}
            <button
              onClick={handleInitialPainConfirm}
              className="w-full py-4 bg-[#00BAA8] text-white text-base font-semibold rounded-xl hover:bg-[#008C7E] transition-colors"
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {/* -- Phase: pre_exercise -- */}
      {phase === 'pre_exercise' && (
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">
              Avant de commencer
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentExercise.title}
            </h2>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Video player */}
            {currentExercise.videoUrl ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Vidéo d'instruction
                </p>
                <div className="relative bg-black rounded-lg overflow-hidden w-full aspect-video">
                  <video
                    ref={videoRef}
                    src={currentExercise.videoUrl}
                    controls
                    playsInline
                    controlsList="nodownload"
                    crossOrigin="anonymous"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Video load error:', e, 'URL:', currentExercise.videoUrl);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Vidéo d'instruction
                </p>
                <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Vidéo non disponible</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Instructions
              </p>
              <p className="text-gray-700 leading-relaxed">
                {currentExercise.description}
              </p>
            </div>

            {/* Duration or Repetitions */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Durée estimée
              </p>
              <div className="text-5xl font-mono font-bold text-[#00BAA8] text-center py-4">
                {currentExercise.durationSeconds
                  ? formatTime(currentExercise.durationSeconds)
                  : currentExercise.repetitions
                    ? `${currentExercise.repetitions} reps`
                    : '—'}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <button
              onClick={handlePrePainConfirm}
              className="w-full py-4 bg-[#00BAA8] text-white text-base font-semibold rounded-xl hover:bg-[#008C7E] transition-colors"
            >
              Commencer l'exercice →
            </button>
          </div>
        </div>
      )}

      {/* -- Phase: exercise -- */}
      {phase === 'exercise' && (
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header with title and repetitions/timer */}
          <div className="px-6 py-6 border-b border-gray-200 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{currentExercise.title}</h2>
            
            {/* Repetitions or Timer display */}
            {currentExercise.repetitions && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Répétitions</p>
                <div className="text-6xl font-bold text-[#00BAA8]">
                  {currentExercise.repetitions}
                </div>
              </div>
            )}
            
            {currentExercise.durationSeconds && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Durée</p>
                <div className="text-6xl font-mono font-bold text-[#00BAA8]">
                  {formatTime(timeRemaining ?? currentExercise.durationSeconds)}
                </div>
              </div>
            )}
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <p className="text-gray-600 leading-relaxed text-center">
              {currentExercise.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white space-y-3">
            <button
              onClick={() => goToNext(false)}
              className="w-full py-3.5 bg-[#00BAA8] text-white text-lg font-semibold rounded-xl hover:bg-[#008C7E] transition-colors"
            >
              {isLastExercise ? 'Terminer la séance' : 'Suivant →'}
            </button>
            <button
              onClick={() => setShowSkipSheet(true)}
              className="w-full py-2.5 text-gray-600 font-medium hover:text-gray-800 transition-colors"
            >
              Passer cet exercice
            </button>
          </div>
        </div>
      )}

      {/* -- Skip feedback sheet -- */}
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
