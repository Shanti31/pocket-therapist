'use client'

import type { DashboardStats } from '../types'

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <p className="text-sm font-medium text-[#00BAA8] mb-2">Total Patients</p>
        <p className="text-4xl font-bold text-[#00BAA8]">{stats.totalPatients}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
        <p className="text-sm font-medium text-purple-600 mb-2">
          Exercices Actifs
        </p>
        <p className="text-4xl font-bold text-purple-900">
          {stats.activeExercises}
        </p>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
        <p className="text-sm font-medium text-red-600 mb-2">Alertes en cours</p>
        <p className="text-4xl font-bold text-red-900">{stats.activeAlerts}</p>
      </div>
    </div>
  )
}
