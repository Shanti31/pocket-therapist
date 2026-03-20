'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock exercises from library
const AVAILABLE_EXERCISES = [
  { id: 1, name: 'Rotation épaule', description: 'Rotation externe de l\'épaule pour améliorer la mobilité', videoUrl: 'video1.mp4', category: 'Épaule', difficulty: 'Facile' },
  { id: 2, name: 'Flexion avant', description: 'Flexion antérieure du bras pour renforcer les muscles avant', videoUrl: 'video2.mp4', category: 'Épaule', difficulty: 'Moyen' },
  { id: 3, name: 'Squats légers', description: 'Exercice au poids du corps pour les jambes', videoUrl: 'video3.mp4', category: 'Jambes', difficulty: 'Facile' },
  { id: 4, name: 'Montées escalier', description: 'Renforcement des quadriceps et mollets', videoUrl: 'video4.mp4', category: 'Jambes', difficulty: 'Moyen' },
  { id: 5, name: 'Abduction hanche', description: 'Exercice pour renforcer les abducteurs de la hanche', videoUrl: 'video5.mp4', category: 'Hanche', difficulty: 'Facile' },
]

export default function ProgramDetailsPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [editingExercise, setEditingExercise] = useState(null)
  const [editFormData, setEditFormData] = useState({ duration: '', sets: '', reps: '' })
  const [exercises, setExercises] = useState([])
  const [showProgramInfoModal, setShowProgramInfoModal] = useState(false)
  const [program, setProgram] = useState({
    id: params.id,
    name: 'Réhabilitation Épaule',
    description: 'Programme de 4 semaines pour récupération d\'épaule suite à une tendinite.',
    duration: '4 semaines',
    difficulty: 'Moyen',
    status: 'Actif',
    createdDate: '15/03/2026',
    lastModified: '20/03/2026',
    exercises: exercises,
  })
  const [programEditData, setProgramEditData] = useState({ duration: program.duration, difficulty: program.difficulty })

  return (
    <div className="space-y-8">
      {/* Header avec titre et actions */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {isEditing ? '✓ Terminer' : '✏️ Modifier'}
            </button>
          </div>
        </div>
      </div>

      {/* Information générale du programme - Tableau */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">📋 Informations du Programme</h2>
          <button 
            onClick={() => {
              setProgramEditData({ duration: program.duration, difficulty: program.difficulty })
              setShowProgramInfoModal(true)
            }}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            ✏️ Modifier les infos
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700 w-1/3">Durée</td>
                <td className="px-6 py-4 text-gray-900">{program.duration}</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700 w-1/3">Difficulté</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full font-medium text-sm ${
                    program.difficulty === 'Facile' ? 'bg-green-100 text-green-800' :
                    program.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {program.difficulty}
                  </span>
                </td>
              </tr>
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
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
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
                    <a href={`#${exercise.videoUrl}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                      🎥 Voir
                    </a>
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
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
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
              {AVAILABLE_EXERCISES.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => {
                    // Check if exercise is already in the list
                    if (!exercises.find(ex => ex.id === exercise.id)) {
                      setExercises([...exercises, {
                        ...exercise,
                        duration: '3 min',
                        sets: 3,
                        reps: 12,
                      }])
                    }
                    setShowExerciseModal(false)
                  }}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
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
                      </div>
                    </div>
                    <span className="text-2xl">➕</span>
                  </div>
                </button>
              ))}
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

      {/* Modal - Éditer les informations du programme */}
      {showProgramInfoModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Modifier les informations du programme</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
              <input
                type="text"
                value={programEditData.duration}
                onChange={(e) => setProgramEditData({ ...programEditData, duration: e.target.value })}
                placeholder="Ex: 4 semaines"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulté</label>
              <select
                value={programEditData.difficulty}
                onChange={(e) => setProgramEditData({ ...programEditData, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowProgramInfoModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setProgram({
                    ...program,
                    duration: programEditData.duration,
                    difficulty: programEditData.difficulty,
                    lastModified: new Date().toLocaleDateString('fr-FR')
                  })
                  setShowProgramInfoModal(false)
                }}
                className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
