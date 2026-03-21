'use client';

import { useState } from 'react';

interface PatientNotesCardProps {
  /** Patient ID — passed through to the submit function */
  patientId?: number;
  /** Initial note value (e.g. fetched from backend) */
  initialNote?: string;
}

/**
 * Feature 7 – Journal de bord patient
 * Le patient peut écrire des notes libres visibles par le thérapeute.
 */
export default function PatientNotesCard({ patientId, initialNote = '' }: PatientNotesCardProps) {
  const [note, setNote] = useState(initialNote);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!note.trim()) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      if (!patientId) {
        throw new Error("No patient ID provided");
      }
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${API_BASE_URL}/patients/${patientId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: note.trim() }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to save note");
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">📝 Mon journal</h2>
      <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
        <p className="text-sm text-gray-500">
          Notez vos pensées, ressentis ou questions pour votre thérapeute.
        </p>

        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setSaved(false);
          }}
          placeholder="Comment vous sentez-vous aujourd'hui ?"
          rows={4}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={saving || !note.trim()}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
            saved
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          {saving ? 'Enregistrement…' : saved ? '✓ Note enregistrée' : 'Enregistrer la note'}
        </button>
      </div>
    </section>
  );
}
