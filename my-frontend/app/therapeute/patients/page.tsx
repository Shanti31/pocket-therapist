'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock patient data from database
const MOCK_PATIENTS = [
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    adherence: 85,
    exerciseDifficulty: 6,
    painLevel: 3,
    assignedPrograms: [],
  },
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [patients] = useState(MOCK_PATIENTS)

  const filteredPatients = patients.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">% Adhésion</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Difficulté Exercice</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Douleur</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Programmes</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => (
                  <tr key={patient.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{patient.lastName}</td>
                    <td className="px-6 py-4 text-gray-600">{patient.firstName}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${patient.adherence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-10">{patient.adherence}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm ${
                        patient.exerciseDifficulty <= 3 ? 'bg-green-100 text-green-800' :
                        patient.exerciseDifficulty <= 6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {patient.exerciseDifficulty}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm ${
                        patient.painLevel < 5 ? 'bg-green-100 text-green-800' :
                        patient.painLevel < 8 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {patient.painLevel}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-900">{patient.assignedPrograms.length}</td>
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
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg">Aucun patient trouvé.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
