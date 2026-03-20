import type { PatientProgress } from '../types';

interface ProgressTrackerProps {
  progress: PatientProgress;
}

export default function ProgressTracker({ progress }: ProgressTrackerProps) {
  const { completedCount, totalCount, streakDays, badges } = progress;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // SVG circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Votre progression</h2>
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-6">
          {/* Circular progress */}
          <div className="relative flex-shrink-0">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-900">{percentage}%</span>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{completedCount}</span> / {totalCount} séances
            </p>
            <p className="text-sm text-gray-700">
              🔥 <span className="font-semibold">{streakDays}</span> jours consécutifs
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge.id}
              className={`text-xs px-2 py-1 rounded-full ${
                badge.earned
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {badge.earned ? '🏅 ' : '🔒 '}
              {badge.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
