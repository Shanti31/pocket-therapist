'use client';

import { useState } from 'react';
import type { SkipReason } from '../types';
import { SKIP_REASON_LABELS } from '../types';

interface SkipFeedbackSheetProps {
  exerciseTitle: string;
  onConfirmSkip: (reason: SkipReason, customReason?: string) => void;
  onCancel: () => void;
}

export default function SkipFeedbackSheet({
  exerciseTitle,
  onConfirmSkip,
  onCancel,
}: SkipFeedbackSheetProps) {
  const [selectedReason, setSelectedReason] = useState<SkipReason | null>(null);
  const [customReason, setCustomReason] = useState('');

  const reasons: SkipReason[] = ['too_painful', 'no_time', 'cannot_do', 'other'];

  const handleConfirm = () => {
    if (!selectedReason) return;
    onConfirmSkip(
      selectedReason,
      selectedReason === 'other' ? customReason : undefined,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-t-2xl p-6 space-y-4 animate-[slideUp_0.3s_ease-out]">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Passer l&apos;exercice</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Pourquoi souhaitez-vous passer &quot;{exerciseTitle}&quot; ?
        </p>

        <div className="space-y-2">
          {reasons.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedReason === reason
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {SKIP_REASON_LABELS[reason]}
            </button>
          ))}
        </div>

        {selectedReason === 'other' && (
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Précisez la raison..."
            rows={2}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedReason}
            className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
