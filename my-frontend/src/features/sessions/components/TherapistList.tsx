import type { Therapist } from '../types';

interface TherapistListProps {
  therapists: Therapist[];
}

export default function TherapistList({ therapists }: TherapistListProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Vos thérapeutes</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {therapists.map((t) => (
          <div
            key={t.id}
            className="flex-shrink-0 flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-w-[120px]"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
              {t.firstName[0]}{t.lastName[0]}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {t.firstName} {t.lastName}
              </p>
              <p className="text-xs text-gray-500">{t.specialty}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
