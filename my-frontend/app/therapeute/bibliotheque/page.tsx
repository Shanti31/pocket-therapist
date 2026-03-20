'use client'

import { useState, useEffect } from 'react'

export default function BibliothequePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null)

  // Fetch exercises from API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/exercises/')
        if (!response.ok) throw new Error('Failed to fetch exercises')
        const data = await response.json()
        
        // Map API data to component structure
        const mappedExercises = data.data.map((exercise: any) => ({
          id: exercise.id,
          name: exercise.title,
          description: exercise.description,
          videoUrl: exercise.url,
          category: exercise.category || 'Non catégorisé',
          difficulty: 'Moyen', // Default since API doesn't have difficulty
        }))
        
        setExercises(mappedExercises)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
        console.error('Error fetching exercises:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [])

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 Bibliothèque d'Exercices</h1>
          <p className="text-gray-600 mt-2">Chargement des exercices...</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 Bibliothèque d'Exercices</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erreur: {error}</p>
      </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📚 Bibliothèque d'Exercices</h1>
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
                        {exercise.videoUrl && (
                          <button 
                            onClick={() => setPlayingVideoUrl(exercise.videoUrl)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            🎥 Voir vidéo
                          </button>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(exercise)}
                      className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
                    >
                      ✏️ Modifier
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              <p className="text-lg">Aucun exercice trouvé.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Video Player */}
      {playingVideoUrl && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Lecteur vidéo</h3>
              <button 
                onClick={() => setPlayingVideoUrl(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl">
                ✕
              </button>
            </div>
            <div className="bg-black p-6 flex items-center justify-center min-h-96">
              <video 
                width="100%" 
                height="auto" 
                controls
                autoPlay
                className="max-h-96 lg:max-h-96"
              >
                <source src={playingVideoUrl} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
