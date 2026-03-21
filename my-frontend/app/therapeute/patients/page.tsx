'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function PatientsPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(
    searchParams.get('createPatient') === 'true'
  )
  const [newPatient, setNewPatient] = useState({
    first_name: '',
    last_name: '',
    age: null,
    email: '',
    exercise_difficulty: 5,
    adhesion: 0,
    pain_level: 0,
    number_of_programs: 0,
  })

  // Check for createPatient query param
  useEffect(() => {
    if (searchParams.get('createPatient') === 'true') {
      setShowCreateModal(true)
    }
  }, [searchParams])

  // Fetch patients from API on page load
  useEffect(() => {
    const fetchPatients = async () => {
      let retries = 3
      let lastError: Error | null = null
      
      while (retries > 0) {
        try {
          setLoading(true)
          const response = await fetch('http://localhost:8000/api/patients', {
            headers: { 'Cache-Control': 'no-cache' }
          })
          
          if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch patients`)
          
          const { data } = await response.json()
          setPatients(data || [])
          setError(null)
          return // Success - exit the retry loop
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Unknown error')
          retries--
          
          if (retries > 0) {
            console.warn(`Retrying... (${retries} attempts left)`)
            await new Promise(resolve => setTimeout(resolve, 500)) // Wait before retrying
          }
        } finally {
          setLoading(false)
        }
      }
      
      // If we got here, all retries failed
      if (lastError) {
        console.error('Error fetching patients:', lastError)
        setError(lastError.message)
      }
    }

    fetchPatients()
  }, [])

  const filteredPatients = patients.filter((patient: any) => {
    const name = `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase()
    return name.includes(searchTerm.toLowerCase())
  })

  const handleCreatePatient = async () => {
    if (!newPatient.first_name.trim() || !newPatient.last_name.trim() || !newPatient.email.trim()) {
      alert('Veuillez remplir les champs (Prénom, Nom, Email)')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: newPatient.first_name,
          last_name: newPatient.last_name,
          age: newPatient.age ? parseInt(newPatient.age.toString()) : null,
          email: newPatient.email,
          exercise_difficulty: newPatient.exercise_difficulty,
          adhesion: newPatient.adhesion,
          pain_level: newPatient.pain_level,
          number_of_programs: newPatient.number_of_programs,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create patient')
      }

      const { data } = await response.json()
      setPatients([...patients, data])
      
      // Reset form
      setNewPatient({
        first_name: '',
        last_name: '',
        age: null,
        email: '',
        exercise_difficulty: 5,
        adhesion: 0,
        pain_level: 0,
        number_of_programs: 0,
      })
      setShowCreateModal(false)
      alert('Patient créé avec succès!')
    } catch (err) {
      console.error('Error creating patient:', err)
      alert(`Erreur: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes Patients</h1>
        <p className="text-gray-600 mt-2">Gérez et suivez vos patients</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="🔍 Rechercher un patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">Chargement des patients...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erreur: {error}</p>
        </div>
      )}

      {/* Patients Grid - Card view */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">👥 Liste des Patients</h2>
        </div>
        
        {!loading && filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient: any) => {
              const initials = `${(patient.first_name || '?')[0]}${(patient.last_name || '?')[0]}`.toUpperCase()
              return (
                <Link
                  key={patient.id}
                  href={`/therapeute/patients/${patient.id}`}
                  className="group"
                >
                  <div className="h-full bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    {/* Header avec avatar et nom */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-[#00BAA8] text-white rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {patient.first_name} {patient.last_name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">{patient.email || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Stats Section */}
                    <div className="space-y-3 border-t border-gray-100 pt-4">
                      {/* Adhésion */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Adhésion</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#00BAA8] rounded-full"
                              style={{ width: `${patient.adhesion || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{patient.adhesion || 0}%</span>
                        </div>
                      </div>

                      {/* Difficulté */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Difficulté</span>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            (patient.exercise_difficulty || 5) <= 3
                              ? 'bg-green-100 text-green-800'
                              : (patient.exercise_difficulty || 5) <= 6
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {patient.exercise_difficulty || 5}/10
                        </span>
                      </div>

                      {/* Douleur */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Douleur</span>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            (patient.pain_level || 0) < 5
                              ? 'bg-green-100 text-green-800'
                              : (patient.pain_level || 0) < 8
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {patient.pain_level || 0}/10
                        </span>
                      </div>

                      {/* Programmes */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Programmes</span>
                        <span className="text-sm font-medium text-gray-900">
                          {patient.number_of_programs || 0}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-[#00BAA8] hover:text-[#008C7E] font-medium transition text-sm group-hover:underline">
                        Voir profil →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : !loading && filteredPatients.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-lg text-gray-500">Aucun patient trouvé.</p>
          </div>
        ) : null}
      </div>

      {/* Modal - Create Patient */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Créer un nouveau patient</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
              <input
                type="text"
                value={newPatient.first_name}
                onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
                placeholder="Ex: Timo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAA8] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input
                type="text"
                value={newPatient.last_name}
                onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
                placeholder="Ex: Student"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAA8] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                placeholder="Ex: timo.test@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAA8] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Âge</label>
              <input
                type="number"
                value={newPatient.age || ''}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="Ex: 25"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BAA8] focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewPatient({
                    first_name: '',
                    last_name: '',
                    age: null,
                    email: '',
                    exercise_difficulty: 5,
                    adhesion: 0,
                    pain_level: 0,
                    number_of_programs: 0,
                  })
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreatePatient}
                className="flex-1 px-4 py-2 text-white bg-[#00BAA8] rounded-lg font-medium hover:bg-[#008C7E] transition-colors"
              >
                Créer patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
