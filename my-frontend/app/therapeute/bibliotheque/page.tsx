'use client'

import { useState, useEffect } from 'react'

interface Exercise {
  id: string
  name: string
  description: string
  videoUrl: string
  category: string
  difficulty: string
}

export default function BibliothequePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  const handleEdit = (exercise: Exercise) => {
    setEditingId(exercise.id)
    setEditData({ ...exercise })
  }

  const handleSave = (id: string) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...editData } as Exercise : ex))
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
          <h1 className="text-3xl font-bold text-gray-900">Bibliothèque d'Exercices</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Bibliothèque d'Exercices</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">Bibliothèque d'Exercices</h1>
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

      {/* Exercises Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Exercices ({filteredExercises.length})</h2>
        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* Video Thumbnail */}
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative cursor-pointer group">
                  <button
                    onClick={() => setPlayingVideoUrl(exercise.videoUrl)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors"
                  >
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  {/* Therapy Type Badge */}
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Physio
                  </span>
                </div>

                {/* Content Container */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {exercise.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {exercise.description}
                  </p>

                  {/* Info Grid */}
                  <div className="space-y-2 mb-4 flex-grow">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Catégorie</span>
                      <span className="font-medium text-gray-900">{exercise.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Difficulté</span>
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
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(exercise)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    ✏️ Modifier
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-lg text-gray-500">Aucun exercice trouvé.</p>
          </div>
        )}
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
