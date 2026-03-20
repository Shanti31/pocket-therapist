'use client';

import { SessionRunner, mockPendingSessions } from '@/src/features/sessions';
import { useRouter } from 'next/navigation';

export default function SeancesPage() {
  const router = useRouter();

  // For now, load the first pending session as a demo
  const session = mockPendingSessions[0];

  if (!session) {
    return (
      <div className="px-4 py-8 text-center">
        <h1 className="text-xl font-bold text-gray-900">Aucune séance disponible</h1>
        <p className="text-gray-500 mt-2">Toutes vos séances sont terminées.</p>
      </div>
    );
  }

  return (
    <SessionRunner
      session={session}
      onComplete={() => router.push('/patient')}
      onCancel={() => router.push('/patient')}
    />
  );
}
