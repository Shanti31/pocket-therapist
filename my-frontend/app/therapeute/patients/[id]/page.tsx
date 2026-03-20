'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import React from 'react'

export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [patient, setPatient] = useState<any>(null)
  const [assignedPrograms, setAssignedPrograms] = useState<any[]>([])
  const [availablePrograms, setAvailablePrograms] = useState<any[]>([])
  const [loadingPatient, setLoadingPatient] = useState(true)
  const [loadingPrograms, setLoadingPrograms] = useState(true)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showAdaptModal, setShowAdaptModal] = useState(false)
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)
  const [programToAdapt, setProgramToAdapt] = useState<any>(null)
  const [adaptedData, setAdaptedData] = useState({ 
    name: '', 
    difficulty: 5,
    duration: '4 semaines' 
  })

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoadingPatient(true)
        const response = await fetch(`http://localhost:8000/api/patients/${id}`)
        if (!response.ok) throw new Error('Failed to fetch patient')
        const { data } = await response.json()
        setPatient(data)
      } catch (err) {
        console.error('Error fetching patient:', err)
      } finally {
        setLoadingPatient(false)
      }
    }

    fetchPatient()
  }, [id])

  // Fetch assigned programs for this patient
  useEffect(() => {
    const fetchAssignedPrograms = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/patients/${id}/programs`)
        if (!response.ok) {
          console.warn(`Status ${response.status} fetching programs, using empty list`)
          setAssignedPrograms([])
          return
        }
        const { data } = await response.json()
        setAssignedPrograms(data || [])
      } catch (err) {
        console.error('Error fetching assigned programs:', err)
        // Gracefully handle error - show empty list instead
        setAssignedPrograms([])
      }
    }

    if (id) {
      fetchAssignedPrograms()
    }
  }, [id])

  // Fetch all programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoadingPrograms(true)
        const response = await fetch('http://localhost:8000/api/programs')
        if (!response.ok) throw new Error('Failed to fetch programs')
        const { data } = await response.json()
        setAvailablePrograms(data || [])
      } catch (err) {
        console.error('Error fetching programs:', err)
      } finally {
        setLoadingPrograms(false)
      }
    }

    fetchPrograms()
  }, [])

  if (loadingPatient) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">Chargement du patient...</p>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="space-y-6">
        <p className="text-gray-600">Patient non trouvé.</p>
        <Link href="/therapeute/patients" className="text-indigo-600 hover:text-indigo-800">
          ← Retour aux patients
        </Link>
      </div>
    )
  }

  const handleAssignProgram = async (programId: string) => {
    if (!programId) return

    try {
      const response = await fetch(`http://localhost:8000/api/patients/${id}/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program_id: programId,
          is_personal: false,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to assign program')
      }

      // Ajouter le programme à la liste locale immédiatement
      const programToAdd = availablePrograms.find(p => p.id === programId)
      if (programToAdd && !assignedPrograms.find(p => p.id === programId)) {
        setAssignedPrograms([...assignedPrograms, { ...programToAdd, is_personal: false }])
      }

      setShowAssignModal(false)
      setSelectedProgramId(null)
      alert('Programme assigné au patient!')
    } catch (err) {
      console.error('Error assigning program:', err)
      alert(`Erreur: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleRemoveProgram = async (programId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${id}/programs/${programId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to remove program')

      setAssignedPrograms(assignedPrograms.filter(p => p.id !== programId))
      alert('Programme retiré du patient!')
    } catch (err) {
      console.error('Error removing program:', err)
      alert(`Erreur: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const openAdaptModalFromTable = (program: any) => {
    setProgramToAdapt(program)
    setAdaptedData({
      name: `${program.title} - ${patient.first_name}`,
      difficulty: 5,
      duration: '4 semaines'
    })
    setShowAdaptModal(true)
  }

  const handleAdaptProgram = async () => {
    if (programToAdapt && patient) {
      try {
        // 1. Create an adapted program
        const adaptResponse = await fetch(
          `http://localhost:8000/api/programs/${programToAdapt.id}/adapt`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: adaptedData.name,
              difficulty: adaptedData.difficulty,
              duration: adaptedData.duration,
            }),
          }
        )

        if (!adaptResponse.ok) {
          const errorData = await adaptResponse.json()
          throw new Error(errorData.detail || 'Failed to create adapted program')
        }

        const { data: adaptedProgram } = await adaptResponse.json()

        // 2. Assign the adapted program to the patient
        const assignResponse = await fetch(`http://localhost:8000/api/patients/${id}/programs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            program_id: adaptedProgram.id,
            is_personal: true,
          }),
        })

        if (!assignResponse.ok) {
          const errorData = await assignResponse.json()
          throw new Error(errorData.detail || 'Failed to assign adapted program')
        }

        // 3. Ajouter le programme adapté à la liste locale immédiatement
        const newAdaptedProgram = {
          id: adaptedProgram.id,
          title: adaptedData.name,
          description: adaptedProgram.description,
          is_personal: true,
          program_exercises: programToAdapt.program_exercises || [],
        }
        setAssignedPrograms([...assignedPrograms, newAdaptedProgram])

        setShowAdaptModal(false)
        setProgramToAdapt(null)
        setAdaptedData({ name: '', difficulty: 5, duration: '' })
        alert('Programme adapté créé et assigné au patient!')
      } catch (err) {
        console.error('Error adapting program:', err)
        alert(`Erreur: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {patient.first_name} {patient.last_name}
            </h1>
            <p className="text-gray-500 mt-1">
              {patient.email}
            </p>
            <p className="text-gray-600 mt-2">ID Patient: {patient.id}</p>
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Adhésion:</span>
                <span className="text-gray-600 ml-2">{patient.adhesion || 0}%</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Difficulté Exercice:</span>
                <span className="text-gray-600 ml-2">{patient.exercise_difficulty || 5}/10</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Douleur:</span>
                <span className="text-gray-600 ml-2">{patient.pain_level || 0}/10</span>
              </div>
            </div>
          </div>
          <Link
            href="/therapeute/patients"
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            ← Retour
          </Link>
        </div>
      </div>

      {/* Assigned Programs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">📋 Programmes Assignés ({assignedPrograms.length})</h2>
          <button
            onClick={() => setShowAssignModal(true)}
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + Assigner programme
          </button>
        </div>
        
        {assignedPrograms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nom du Programme</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedPrograms.map((program, index) => (
                  <tr key={program.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{program.title || program.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{program.description}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm ${
                        program.is_personal ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {program.is_personal ? '👤 Personnel' : '📋 Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2 flex items-center justify-center">
                      {!program.is_personal && (
                        <button
                          onClick={() => openAdaptModalFromTable(program)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          ✏️ Adapter
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveProgram(program.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        🗑️ Retirer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="text-lg">Aucun programme assigné à ce patient.</p>
          </div>
        )}
      </div>

      {/* Modal - Assign Programs */}
      {showAssignModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Assigner un programme au patient</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3">
              {loadingPrograms ? (
                <p className="text-center text-gray-500">Chargement des programmes...</p>
              ) : availablePrograms.length > 0 ? (
                availablePrograms.map((program) => (
                  <div
                    key={program.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{program.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                      </div>
                      <button
                        onClick={() => handleAssignProgram(program.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap ml-4"
                      >
                        ➕ Assigner
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Aucun programme disponible</p>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowAssignModal(false)}
                className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Adapt Program for Client */}
      {showAdaptModal && programToAdapt && patient && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Adapter le programme</h2>
            <p className="text-gray-600 text-sm">Créer une version personnalisée du programme pour {patient.first_name}</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom du programme personnalisé</label>
              <input
                type="text"
                value={adaptedData.name}
                onChange={(e) => setAdaptedData({ ...adaptedData, name: e.target.value })}
                placeholder="Ex: Réhabilitation Épaule - Timo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulté (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={adaptedData.difficulty}
                onChange={(e) => setAdaptedData({ ...adaptedData, difficulty: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée du programme</label>
              <input
                type="text"
                value={adaptedData.duration}
                onChange={(e) => setAdaptedData({ ...adaptedData, duration: e.target.value })}
                placeholder="Ex: 4 semaines"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowAdaptModal(false)
                  setProgramToAdapt(null)
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAdaptProgram}
                className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Créer programme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
