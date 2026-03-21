'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  SessionRunner, 
  Session,
  fetchPatientSessions,
  updateSessionStatus
} from '@/src/features/sessions';

export default function SeancesPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const patientId = 1; // Temporairement en dur

  useEffect(() => {
    async function loadSession() {
      try {
        const sessions = await fetchPatientSessions(patientId);
        // Prendre la première session en attente
        const pending = sessions.find(s => s.status === 'pending' || s.status === 'in_progress');
        setSession(pending || null);
      } catch (error) {
        console.error("Failed to fetch session for runner:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const handleComplete = async () => {
    if (session) {
      await updateSessionStatus(patientId, session.id, 'completed');
    }
    router.push('/patient');
  };

  const handleCancel = () => {
    router.push('/patient');
  };

  if (loading) {
    return (
      <div className="px-4 py-8 text-center text-gray-500">
        Chargement de votre séance...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="px-4 py-8 text-center">
        <h1 className="text-xl font-bold text-gray-900">Aucune séance disponible</h1>
        <p className="text-gray-500 mt-2">Toutes vos séances sont terminées.</p>
        <button 
          onClick={() => router.push('/patient')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded font-medium"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <SessionRunner
      session={session}
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
}
