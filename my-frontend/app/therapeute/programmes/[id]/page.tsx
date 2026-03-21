'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import React from 'react'

interface Exercise {
  id: string
  exercise_id: string
  name: string
  description: string
  videoUrl: string
  category: string
  difficulty?: any
  duration: string
  sets: number
  reps: number
}

interface Program {
  id: string
  name: string
  description: string
  therapist_id: string
  createdDate: string
  lastModified: string
}

export default function ProgramDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [isEditing, setIsEditing] = useState(false)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [editingExercise, setEditingExercise] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState({ duration: '', sets: '', reps: '' })
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([])
  const [loadingExercises, setLoadingExercises] = useState(false)
  const [loadingProgram, setLoadingProgram] = useState(true)
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null)
  const [program, setProgram] = useState<Program | null>(null)

  // Fetch program from API on load
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoadingProgram(true)
        const response = await fetch(`http://localhost:8000/api/programs/${id}`)
        if (!response.ok) throw new Error('Failed to fetch program')
        const { data } = await response.json()
        
        setProgram({
          id: data.id,
          name: data.title,
          description: data.description,
          therapist_id: data.therapist_id,
          createdDate: new Date(data.created_at).toLocaleDateString('fr-FR'),
          lastModified: new Date(data.updated_at).toLocaleDateString('fr-FR'),
        })
        
        // Map exercises
        const mappedExercises = (data.program_exercises || []).map((pe: any) => ({
          id: pe.exercise_id,
          exercise_id: pe.exercise_id,
          name: pe.videos_metadata?.title || '',
          description: pe.videos_metadata?.description || '',
          videoUrl: pe.videos_metadata?.url || '',
          category: pe.videos_metadata?.category || '',
          duration: pe.duration || '3 min',
          sets: pe.sets || 3,
          reps: pe.reps || 12,
        }))
        setExercises(mappedExercises)
      } catch (err) {
        console.error('Error fetching program:', err)
      } finally {
        setLoadingProgram(false)
      }
    }

    fetchProgram()
  }, [id])

  // Fetch available exercises from API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoadingExercises(true)
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
        
        setAvailableExercises(mappedExercises)
      } catch (err) {
        console.error('Error fetching exercises:', err)
      } finally {
        setLoadingExercises(false)
      }
    }

    fetchExercises()
  }, [])

  // Save exercises to database
  const saveExercisesToDatabase = async () => {
    try {
      const exerciseIds = exercises.map(ex => ex.exercise_id || ex.id)
      
      const response = await fetch(`http://localhost:8000/api/programs/${id}/exercises`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise_ids: exerciseIds })
      })

      if (!response.ok) throw new Error('Failed to save exercises')
      
      // Update lastModified
      if (program) {
        setProgram({
          ...program,
          lastModified: new Date().toLocaleDateString('fr-FR')
        })
      }
      
      alert('Exercices sauvegardés!')
    } catch (err) {
      console.error('Error saving exercises:', err)
      alert('Erreur lors de la sauvegarde')
    }
  }

  // Delete exercise from program
  const handleDeleteExercise = async (exerciseId: string, exerciseName: string) => {
    if (!confirm(`Supprimer l'exercice "${exerciseName}" du programme ?`)) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/programs/${id}/exercises/${exerciseId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to delete exercise')
      }

      // Remove from local state
      setExercises(exercises.filter(ex => ex.id !== exerciseId && ex.exercise_id !== exerciseId))
      alert('Exercice supprimé!')
    } catch (err) {
      console.error('Error deleting exercise:', err)
      alert(`Erreur lors de la suppression: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Loading State */}
      {loadingProgram && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">Chargement du programme...</p>
        </div>
      )}

      {program && !loadingProgram && (
        <>
          {/* Header avec titre et actions */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#00BAA8]">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{program.name}</h1>
                <p className="text-gray-600 mt-2">{program.description}</p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/therapeute"
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  ← Retour
                </Link>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-[#00BAA8] text-white rounded-lg font-medium hover:bg-[#008C7E] transition-colors"
                >
                  {isEditing ? '✓ Terminer' : '✏️ Modifier'}
                </button>
              </div>
            </div>
          </div>

          {/* Information générale du programme - Tableau */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">📋 Informations du Programme</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700 w-1/3">Date de création</td>
                <td className="px-6 py-4 text-gray-900">{program.createdDate}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700 w-1/3">Dernière modification</td>
                <td className="px-6 py-4 text-gray-900">{program.lastModified}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Exercices - Tableau détaillé */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">🏋️ Exercices du Programme ({exercises.length})</h2>
          <button 
            onClick={() => setShowExerciseModal(true)}
            className="px-3 py-2 bg-[#00BAA8] text-white rounded-lg text-sm font-medium hover:bg-[#008C7E] transition-colors">
            + Ajouter exercice
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Durée</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Séries</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Répétitions</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Vidéo</th>
                {isEditing && <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {exercises.map((exercise, index) => (
                <tr key={exercise.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                  <td className="px-6 py-4 font-medium text-gray-900">{exercise.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{exercise.description}</td>
                  <td className="px-6 py-4 text-center text-gray-900">⏱️ {exercise.duration}</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-semibold">{exercise.sets}</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-semibold">{exercise.reps}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setPlayingVideoUrl(exercise.videoUrl)}
                      className="text-[#00BAA8] hover:text-[#008C7E] font-medium mr-3">
                      🎥 Voir
                    </button>
                    <button
                      onClick={() => handleDeleteExercise(exercise.exercise_id || exercise.id, exercise.name)}
                      className="text-red-600 hover:text-red-800 font-medium">
                      🗑️ Supprimer
                    </button>
                  </td>
                  {isEditing && (
                    <td className="px-6 py-4 text-center space-x-2">
                      <button 
                        onClick={() => {
                          setEditingExercise(exercise.id)
                          setEditFormData({ duration: exercise.duration, sets: String(exercise.sets), reps: String(exercise.reps) })
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium">✏️</button>
                      <button 
                        onClick={() => setExercises(exercises.filter(ex => ex.id !== exercise.id))}
                        className="text-red-600 hover:text-red-800 font-medium">🗑️</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bouton de sauvegarde si en mode édition */}
      {isEditing && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={() => {
              saveExercisesToDatabase()
              setIsEditing(false)
            }}
            className="px-6 py-3 bg-[#00BAA8] text-white rounded-lg font-medium hover:bg-[#008C7E] transition-colors">
            💾 Sauvegarder les modifications
          </button>
        </div>
      )}

      {/* Modal - Sélectionner exercice de la bibliothèque */}
      {showExerciseModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Sélectionner des exercices de la bibliothèque</h3>
              <button onClick={() => setShowExerciseModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            
            <div className="p-6 space-y-3">
              {loadingExercises ? (
                <p className="text-center text-gray-500">Chargement des exercices...</p>
              ) : availableExercises.length > 0 ? (
                availableExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    onClick={() => {
                      // Check if exercise is already in the list
                      if (!exercises.find(ex => ex.exercise_id === exercise.id)) {
                        setExercises([...exercises, {
                          id: exercise.id,
                          exercise_id: exercise.id,
                          name: exercise.name,
                          description: exercise.description,
                          videoUrl: exercise.videoUrl,
                          category: exercise.category,
                          difficulty: exercise.difficulty,
                          duration: '3 min',
                          sets: 3,
                          reps: 12,
                        }])
                      }
                      setShowExerciseModal(false)
                    }}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-[#e6faf8] hover:border-[#00BAA8] transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className="text-gray-500">📁 {exercise.category}</span>
                        <span className={`px-2 py-1 rounded ${
                          exercise.difficulty === 'Facile' ? 'bg-green-100 text-green-800' :
                          exercise.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {exercise.difficulty}
                        </span>
                        {exercise.videoUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setPlayingVideoUrl(exercise.videoUrl)
                            }}
                            className="text-[#00BAA8] hover:text-[#008C7E] font-medium"
                          >
                            🎥
                          </button>
                        )}
                      </div>
                    </div>
                    <span className="text-2xl">➕</span>
                  </div>
                </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Aucun exercice trouvé en bibliothèque</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal - Éditer les détails de l'exercice */}
      {editingExercise !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Modifier l'exercice</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
              <input
                type="text"
                value={editFormData.duration}
                onChange={(e) => setEditFormData({ ...editFormData, duration: e.target.value })}
                placeholder="Ex: 3 min"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Séries</label>
                <input
                  type="number"
                  value={editFormData.sets}
                  onChange={(e) => setEditFormData({ ...editFormData, sets: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Répétitions</label>
                <input
                  type="number"
                  value={editFormData.reps}
                  onChange={(e) => setEditFormData({ ...editFormData, reps: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setEditingExercise(null)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setExercises(exercises.map(ex => 
                    ex.id === editingExercise 
                      ? { ...ex, duration: editFormData.duration, sets: parseInt(editFormData.sets), reps: parseInt(editFormData.reps) }
                      : ex
                  ))
                  setEditingExercise(null)
                }}
                className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

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
        </>
      )}
    </div>
  )
}
