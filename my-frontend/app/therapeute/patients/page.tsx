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
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/api/patients')
        if (!response.ok) throw new Error('Failed to fetch patients')
        const { data } = await response.json()
        setPatients(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching patients:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
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

      {/* Patients List - Table view */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">👥 Liste des Patients</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Prénom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">% Adhésion</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Difficulté Exercice</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Douleur</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Programmes</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredPatients.length > 0 ? (
                filteredPatients.map((patient: any, index) => (
                  <tr key={patient.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{patient.last_name || patient.first_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600">{patient.first_name || patient.last_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{patient.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${patient.adhesion || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-10">{patient.adhesion || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm ${
                        (patient.exercise_difficulty || 5) <= 3 ? 'bg-green-100 text-green-800' :
                        (patient.exercise_difficulty || 5) <= 6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {patient.exercise_difficulty || 5}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm ${
                        (patient.pain_level || 0) < 5 ? 'bg-green-100 text-green-800' :
                        (patient.pain_level || 0) < 8 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {patient.pain_level || 0}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-900">{patient.number_of_programs || 0}</td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/therapeute/patients/${patient.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Voir profil →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : !loading && filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg">Aucun patient trouvé.</p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input
                type="text"
                value={newPatient.last_name}
                onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
                placeholder="Ex: Student"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                placeholder="Ex: timo.test@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Âge</label>
              <input
                type="number"
                value={newPatient.age || ''}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="Ex: 25"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                💾 Créer patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
