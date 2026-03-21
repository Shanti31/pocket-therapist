'use client';

import { useState } from 'react';
import type { SessionFeedback, DifficultyLevel, FatigueLevel } from '../types';
import { DIFFICULTY_LABELS, FATIGUE_LABELS } from '../types';

interface PostSessionFeedbackProps {
  sessionId: string;
  onSubmit: (feedback: SessionFeedback) => void;
}

// Pain emojis: index = pain value 1-10
const PAIN_EMOJIS = ['😊', '🙂', '😐', '😕', '😣', '😖', '😫', '😰', '🤕', '😵'];

// Difficulty info avec emojis
const DIFFICULTY_INFO: Record<DifficultyLevel, { emoji: string; color: string; activeColor: string }> = {
  easy:   { emoji: '😊', color: 'border-gray-200 text-gray-700', activeColor: 'bg-green-500  text-white border-green-500' },
  medium: { emoji: '😤', color: 'border-gray-200 text-gray-700', activeColor: 'bg-orange-500 text-white border-orange-500' },
  hard:   { emoji: '😩', color: 'border-gray-200 text-gray-700', activeColor: 'bg-red-500    text-white border-red-500' },
};

// Fatigue info avec emojis
const FATIGUE_INFO: Record<FatigueLevel, { emoji: string; color: string; activeColor: string }> = {
  low:      { emoji: '⚡', color: 'border-gray-200 text-gray-700', activeColor: 'bg-green-500  text-white border-green-500' },
  moderate: { emoji: '😮‍💨', color: 'border-gray-200 text-gray-700', activeColor: 'bg-orange-500 text-white border-orange-500' },
  high:     { emoji: '🥱', color: 'border-gray-200 text-gray-700', activeColor: 'bg-red-500    text-white border-red-500' },
};

export default function PostSessionFeedback({ sessionId, onSubmit }: PostSessionFeedbackProps) {
  const [painRating, setPainRating] = useState(1);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [fatigue, setFatigue] = useState<FatigueLevel>('moderate');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit({
      sessionId,
      painRating,
      difficulty,
      fatigue,
      comment: comment.trim() || undefined,
    });
  };

  const difficultyOptions: DifficultyLevel[] = ['easy', 'medium', 'hard'];
  const fatigueOptions: FatigueLevel[] = ['low', 'moderate', 'high'];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900">Bravo !</h2>
          <p className="text-gray-500 mt-1">Dites-nous comment ça s&apos;est passé</p>
        </div>

        {/* Pain Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Niveau de douleur
          </label>
          <p className="text-xs text-gray-400 mb-3">Après la séance, comment vous sentez-vous ?</p>

          {/* Selected emoji feedback */}
          <div className="text-center mb-3">
            <span className="text-4xl">{PAIN_EMOJIS[painRating - 1]}</span>
            <p className="text-sm text-gray-500 mt-1">{painRating}/10</p>
          </div>

          <div className="flex justify-between items-center gap-1">
            {PAIN_EMOJIS.map((emoji, i) => (
              <button
                key={i}
                onClick={() => setPainRating(i + 1)}
                title={`Douleur ${i + 1}/10`}
                className={`flex-1 flex flex-col items-center py-2 rounded-lg transition-all ${
                  painRating === i + 1
                    ? 'bg-blue-100 ring-2 ring-blue-500 scale-110'
                    : 'hover:bg-gray-50 opacity-60 hover:opacity-90'
                }`}
              >
                <span className="text-xl leading-none">{emoji}</span>
                <span className={`text-xs mt-0.5 font-medium ${painRating === i + 1 ? 'text-blue-600' : 'text-gray-400'}`}>{i + 1}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Aucune douleur</span>
            <span>Insupportable</span>
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Difficulté ressentie
          </label>
          <div className="flex gap-2">
            {difficultyOptions.map((level) => {
              const info = DIFFICULTY_INFO[level];
              const isActive = difficulty === level;
              return (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                    isActive ? info.activeColor : info.color + ' hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{info.emoji}</span>
                  <span>{DIFFICULTY_LABELS[level]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fatigue */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Niveau de fatigue
          </label>
          <div className="flex gap-2">
            {fatigueOptions.map((level) => {
              const info = FATIGUE_INFO[level];
              const isActive = fatigue === level;
              return (
                <button
                  key={level}
                  onClick={() => setFatigue(level)}
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                    isActive ? info.activeColor : info.color + ' hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{info.emoji}</span>
                  <span>{FATIGUE_LABELS[level]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Commentaire (facultatif)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Un message pour votre thérapeute..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sticky submit */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-green-600 text-white text-lg font-bold rounded-xl hover:bg-green-700 transition-colors"
        >
          Terminer la séance ✓
        </button>
      </div>
    </div>
  );
}
