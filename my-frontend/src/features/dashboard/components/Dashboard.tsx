'use client'

import { AlertCard } from './AlertCard'
import { RecentPatientsTable } from './RecentPatientsTable'
import { StatsCards } from './StatsCards'
import type { PainAlert, PatientRecent, DashboardStats } from '../types'

interface DashboardProps {
  painAlerts: PainAlert[]
  recentPatients: PatientRecent[]
  stats: DashboardStats
}

export function Dashboard({
  painAlerts,
  recentPatients,
  stats,
}: DashboardProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de vos patients</p>
      </div>

      {/* Pain Alerts */}
      {painAlerts.length > 0 && (
        <div className="mb-8">
          {painAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* Recent Patients Table */}
      <RecentPatientsTable patients={recentPatients} />

      {/* Stats Cards */}
      <StatsCards stats={stats} />
    </div>
  )
}
