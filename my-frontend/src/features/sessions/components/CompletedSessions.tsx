import type { Session } from '../types';

interface CompletedSessionsProps {
  sessions: Session[];
}

export default function CompletedSessions({ sessions }: CompletedSessionsProps) {
  if (sessions.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Séances terminées</h2>
        <p className="text-gray-500 text-sm">Aucune séance terminée pour le moment.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Séances terminées</h2>
      <div className="space-y-2">
        {sessions.map((session) => {
          const date = session.completedDate
            ? new Date(session.completedDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
              })
            : '';

          return (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-green-600 text-lg">✓</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{session.title}</p>
                  <p className="text-xs text-gray-500">{date}</p>
                </div>
              </div>
              {session.painRating !== undefined && (
                <span className="text-xs text-gray-500">
                  Douleur : {session.painRating}/10
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
