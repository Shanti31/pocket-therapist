'use client';

import { useState } from 'react';
import type { SessionFeedback, DifficultyLevel, FatigueLevel } from '../types';
import { DIFFICULTY_LABELS, FATIGUE_LABELS } from '../types';

interface PostSessionFeedbackProps {
  sessionId: string;
  onSubmit: (feedback: SessionFeedback) => void;
}

const painEmojis = ['😊', '🙂', '😐', '😕', '😣', '😖', '😫', '😰', '🤕', '😵'];

export default function PostSessionFeedback({
  sessionId,
  onSubmit,
}: PostSessionFeedbackProps) {
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Bravo ! 🎉</h2>
          <p className="text-gray-500 mt-1">Dites-nous comment ça s&apos;est passé</p>
        </div>

        {/* Pain Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau de douleur
          </label>
          <div className="flex justify-between items-center mb-1">
            {painEmojis.map((emoji, i) => (
              <button
                key={i}
                onClick={() => setPainRating(i + 1)}
                className={`text-2xl p-1 rounded transition-transform ${
                  painRating === i + 1 ? 'scale-125 bg-[#e9ebef]' : 'opacity-50 hover:opacity-80'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Aucune</span>
            <span>Insupportable</span>
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulté ressentie
          </label>
          <div className="flex gap-2">
            {difficultyOptions.map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  difficulty === level
                    ? 'bg-[#00BAA8] text-white border-[#00BAA8]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {DIFFICULTY_LABELS[level]}
              </button>
            ))}
          </div>
        </div>

        {/* Fatigue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau de fatigue
          </label>
          <div className="flex gap-2">
            {fatigueOptions.map((level) => (
              <button
                key={level}
                onClick={() => setFatigue(level)}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  fatigue === level
                    ? 'bg-[#00BAA8] text-white border-[#00BAA8]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {FATIGUE_LABELS[level]}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire (facultatif)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Un message pour votre thérapeute..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sticky submit button */}
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
