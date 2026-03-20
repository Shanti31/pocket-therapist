'use client'

import { useState } from 'react'

export default function BibliothequePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: 'Rotation épaule',
      description: 'Rotation externe de l\'épaule pour améliorer la mobilité',
      videoUrl: 'video1.mp4',
      category: 'Épaule',
      difficulty: 'Facile',
    },
    {
      id: 2,
      name: 'Flexion avant',
      description: 'Flexion antérieure du bras pour renforcer les muscles avant',
      videoUrl: 'video2.mp4',
      category: 'Épaule',
      difficulty: 'Moyen',
    },
    {
      id: 3,
      name: 'Squats légers',
      description: 'Exercice au poids du corps pour les jambes',
      videoUrl: 'video3.mp4',
      category: 'Jambes',
      difficulty: 'Facile',
    },
    {
      id: 4,
      name: 'Montées escalier',
      description: 'Renforcement des quadriceps et mollets',
      videoUrl: 'video4.mp4',
      category: 'Jambes',
      difficulty: 'Moyen',
    },
    {
      id: 5,
      name: 'Abduction hanche',
      description: 'Exercice pour renforcer les abducteurs de la hanche',
      videoUrl: 'video5.mp4',
      category: 'Hanche',
      difficulty: 'Facile',
    },
  ])
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || exercise.category === filter
    return matchesSearch && matchesFilter
  })

  const categories = ['all', ...new Set(exercises.map((ex) => ex.category))]

  const handleEdit = (exercise) => {
    setEditingId(exercise.id)
    setEditData({ ...exercise })
  }

  const handleSave = (id) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...editData } : ex))
    )
    setEditingId(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📚 Bibliothèque d\'Exercices</h1>
        <p className="text-gray-600 mt-2">Gérez vos exercices et utilisez-les dans vos programmes</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Rechercher un exercice..."
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Toutes les catégories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exercises List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Exercices ({filteredExercises.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <div key={exercise.id} className="p-6 hover:bg-gray-50 transition-colors">
                {editingId === exercise.id ? (
                  // Edit mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                        <input
                          type="text"
                          value={editData.category}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté</label>
                        <select
                          value={editData.difficulty}
                          onChange={(e) => setEditData({ ...editData, difficulty: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option>Facile</option>
                          <option>Moyen</option>
                          <option>Difficile</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(exercise.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        ✓ Sauvegarder
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{exercise.name}</h3>
                      <p className="text-gray-600 mt-1">{exercise.description}</p>
                      <div className="flex gap-4 mt-3 text-sm">
                        <span className="text-gray-500">📁 {exercise.category}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            exercise.difficulty === 'Facile'
                              ? 'bg-green-100 text-green-800'
                              : exercise.difficulty === 'Moyen'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {exercise.difficulty}
                        </span>
                        <a href={`#${exercise.videoUrl}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                          🎥 Voir vidéo
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(exercise)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      ✏️ Modifier
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">Aucun exercice trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
