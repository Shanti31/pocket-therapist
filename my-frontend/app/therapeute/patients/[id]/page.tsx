'use client'

import { useState, use } from 'react'
import Link from 'next/link'

// Mock data
const MOCK_PATIENTS_DETAIL = {
  1: {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    adherence: 85,
    exerciseDifficulty: 6,
    painLevel: 3,
    assignedPrograms: [],
  },
}

// Mock programs from therapist
const MOCK_PROGRAMS = [
  { id: 1, name: 'Réhabilitation Épaule', description: 'Programme de 4 semaines', difficulty: 'Moyen', exercises: [] },
  { id: 2, name: 'Renforcement Genoux', description: 'Programme de 6 semaines', difficulty: 'Facile', exercises: [] },
  { id: 3, name: 'Mobilité Hanche', description: 'Programme de 5 semaines', difficulty: 'Difficile', exercises: [] },
]

export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const patientId = parseInt(unwrappedParams.id)
  const patient = MOCK_PATIENTS_DETAIL[patientId as keyof typeof MOCK_PATIENTS_DETAIL]
  
  const [assignedPrograms, setAssignedPrograms] = useState(patient?.assignedPrograms || [])
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showAdaptModal, setShowAdaptModal] = useState(false)
  const [selectedPrograms, setSelectedPrograms] = useState<number[]>([])
  const [programToAdapt, setProgramToAdapt] = useState<typeof MOCK_PROGRAMS[0] | null>(null)
  const [adaptedData, setAdaptedData] = useState({ name: '', difficulty: 'Moyen', duration: '' })

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

  const handleAssignPrograms = () => {
    const newPrograms = selectedPrograms
      .map((programId) => MOCK_PROGRAMS.find((p) => p.id === programId))
      .filter(Boolean) as typeof MOCK_PROGRAMS
    
    setAssignedPrograms([...assignedPrograms, ...newPrograms])
    setSelectedPrograms([])
    setShowAssignModal(false)
  }

  const handleRemoveProgram = (programId: number) => {
    setAssignedPrograms(assignedPrograms.filter((p) => p.id !== programId))
  }

  const openAdaptModal = (program: typeof MOCK_PROGRAMS[0]) => {
    setProgramToAdapt(program)
    setAdaptedData({
      name: `${program.name} - ${patient.firstName}`,
      difficulty: program.difficulty,
      duration: program.description.match(/\d+\s+semaines/) ? program.description.match(/\d+\s+semaines/)![0] : '4 semaines'
    })
    setShowAdaptModal(true)
  }

  const handleAdaptProgram = () => {
    if (programToAdapt && patient) {
      const adaptedProgram = {
        ...programToAdapt,
        id: Math.random(),
        name: adaptedData.name,
        difficulty: adaptedData.difficulty,
        description: `Programme de ${adaptedData.duration} (Adapté pour ${patient.firstName})`,
        isAdapted: true,
      }
      setAssignedPrograms([...assignedPrograms, adaptedProgram])
      setShowAdaptModal(false)
      setProgramToAdapt(null)
      setAdaptedData({ name: '', difficulty: 'Moyen', duration: '' })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-gray-600 mt-2">ID Patient: {patient.id}</p>
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
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Difficulté</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedPrograms.map((program, index) => (
                  <tr key={program.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{program.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{program.description}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm ${
                        program.difficulty === 'Facile' ? 'bg-green-100 text-green-800' :
                        program.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {program.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
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
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Assigner des programmes</h3>
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  setSelectedPrograms([])
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3">
              <p className="text-gray-600 mb-4">Choisissez d'assigner un programme ou de l'adapter pour ce client</p>
              {MOCK_PROGRAMS.map((program) => (
                <div
                  key={program.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{program.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          program.difficulty === 'Facile' ? 'bg-green-100 text-green-800' :
                          program.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {program.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => {
                          const newProgram = { ...program, id: Math.random() }
                          setAssignedPrograms([...assignedPrograms, newProgram])
                          setShowAssignModal(false)
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
                      >
                        ➕ Assigner
                      </button>
                      <button
                        onClick={() => openAdaptModal(program)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        ✏️ Adapter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  setSelectedPrograms([])
                }}
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
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Adapter le programme pour {patient.firstName}</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom du programme</label>
              <input
                type="text"
                value={adaptedData.name}
                onChange={(e) => setAdaptedData({ ...adaptedData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
              <input
                type="text"
                value={adaptedData.duration}
                onChange={(e) => setAdaptedData({ ...adaptedData, duration: e.target.value })}
                placeholder="Ex: 4 semaines"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulté</label>
              <select
                value={adaptedData.difficulty}
                onChange={(e) => setAdaptedData({ ...adaptedData, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
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
                ✓ Assigner adapté
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
