'use client'

import type { PainAlert } from '../types'
import Link from 'next/link'

interface AlertCardProps {
  alert: PainAlert
}

export function AlertCard({ alert }: AlertCardProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            ⚠️ Alerte Douleur: {alert.patientName}
          </h3>
          <p className="text-sm text-red-700 mb-3">
            Douleur de {alert.painLevel}/10 signalée le{' '}
            {new Date(alert.timestamp).toLocaleDateString('fr-FR')} à{' '}
            {new Date(alert.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
      <p className="italic text-red-800 mb-4 pl-4 border-l-4 border-red-400">
        "{alert.comment}"
      </p>
      <Link
        href={`/therapeute/patients/${alert.patientId}`}
        className="inline-block bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-medium transition"
      >
        Adapter le programme
      </Link>
    </div>
  )
}
