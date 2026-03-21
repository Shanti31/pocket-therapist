'use client'

import { useEffect, useState } from 'react'
import { Dashboard, mockDashboardStats } from '@/src/features/dashboard'
import type { PatientRecent, PainAlert } from '@/src/features/dashboard'

export default function DashboardPage() {
  const [recentPatients, setRecentPatients] = useState<PatientRecent[]>([])
  const [painAlerts, setPainAlerts] = useState<PainAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/api/patients')
        if (!response.ok) throw new Error('Failed to fetch patients')
        const { data } = await response.json()
        
        // Transform backend data to frontend format
        const transformedPatients: PatientRecent[] = data.map((patient: any, index: number) => {
          // Generate initials from first and last name
          const initials = (
            (patient.first_name?.[0] || '') + 
            (patient.last_name?.[0] || '')
          ).toUpperCase()

          return {
            id: patient.id,
            initials: initials || `P${index + 1}`,
            firstName: patient.first_name || 'Patient',
            lastName: patient.last_name || '',
            pathology: patient.pathology || 'Non spécifiée',
            adherence: {
              current: patient.adhesion || 0,
              total: patient.number_of_programs || 0,
            },
            painLevel: patient.pain_level || 0,
            difficulty: patient.exercise_difficulty || 5,
            lastSessionDate: patient.last_session || new Date().toISOString().split('T')[0],
          }
        })

        setRecentPatients(transformedPatients)

        // Create alert from first patient if they exist
        if (transformedPatients.length > 0) {
          const firstPatient = transformedPatients[0]
          const alert: PainAlert = {
            id: 'alert-1',
            patientId: data[0].id, // Use the real patient ID from database
            patientName: `${firstPatient.firstName} ${firstPatient.lastName}`,
            painLevel: firstPatient.painLevel,
            timestamp: new Date().toISOString(),
            comment: 'Alerte douleur du patient',
          }
          setPainAlerts([alert])
        }
      } catch (err) {
        console.error('Error fetching patients:', err)
        setRecentPatients([])
        setPainAlerts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Chargement des patients...</p>
      </div>
    )
  }

  return (
    <Dashboard
      painAlerts={painAlerts}
      recentPatients={recentPatients}
      stats={{
        ...mockDashboardStats,
        totalPatients: recentPatients.length,
      }}
    />
  )
}
