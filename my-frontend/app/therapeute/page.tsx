'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function TherapeuteDashboard() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [programs, setPrograms] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newProgram, setNewProgram] = useState({ name: '', description: '' })

  // Ouvrir la modal si le param createProgram=true
  useEffect(() => {
    if (searchParams.get('createProgram') === 'true') {
      setShowModal(true)
    }
  }, [searchParams])

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === 'all' ||
      (filter === 'actif' && program.status === 'Actif') ||
      (filter === 'inactif' && program.status === 'Inactif')
    return matchesSearch && matchesFilter
  })

  const handleCreateProgram = () => {
    if (newProgram.name.trim()) {
      const programId = programs.length + 1
      const program = {
        id: programId,
        name: newProgram.name,
        description: newProgram.description,
        duration: '0 semaines',
        difficulty: 'Facile',
        patients: 0,
        status: 'Actif',
        exercises: [],
      }
      setPrograms([...programs, program])
      setNewProgram({ name: '', description: '' })
      setShowModal(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes Programmes</h1>
        <p className="text-gray-600 mt-2">Gérez et suivez vos programmes d\'exercices</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Rechercher un programme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="inactif">Inactifs</option>
          </select>
        </div>
      </div>

      {/* Programs List - Table view */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">📚 Liste des Programmes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Durée</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Difficulté</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">👥 Patients</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program, index) => (
                  <tr key={program.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{program.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{program.description}</td>
                    <td className="px-6 py-4 text-center text-gray-900">⏱️ {program.duration}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm ${
                        program.difficulty === 'Facile' ? 'bg-green-100 text-green-800' :
                        program.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {program.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-900">{program.patients}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm ${
                        program.status === 'Actif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {program.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/therapeute/programmes/${program.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Voir détails →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg">Aucun programme trouvé. Créez votre premier programme! 🚀</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Program Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Créer un nouveau programme</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
              <input
                type="text"
                value={newProgram.name}
                onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                placeholder="Ex: Réhabilitation Épaule"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newProgram.description}
                onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                placeholder="Ex: Programme de 4 semaines pour récupération d'épaule"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowModal(false)
                  setNewProgram({ name: '', description: '' })
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateProgram}
                className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Créer Programme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exercises Modal - Now removed from this page, moved to program detail page */}
    </div>
  )
}
