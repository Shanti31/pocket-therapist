'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye } from 'lucide-react'

interface ProgramExercise {
  id: string
  exercise_id: string
  videos_metadata?: {
    id: string
    title: string
  }
}

interface Program {
  id: string
  title: string
  description: string | null
  created_at: string
  program_exercises?: ProgramExercise[]
}

export default function ProgrammesPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/api/programs')
        if (!response.ok) throw new Error('Failed to fetch programs')
        const { data } = await response.json()
        setPrograms(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching programs:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getExercisePreview = (exercises?: ProgramExercise[]) => {
    if (!exercises) return { items: [], remaining: 0, total: 0 }

    const displayCount = 3
    const items = exercises.slice(0, displayCount).map((item, index) => ({
      index: index + 1,
      title: item.videos_metadata?.title || `Exercice ${index + 1}`,
    }))
    const remaining = Math.max(0, exercises.length - displayCount)

    return { items, remaining, total: exercises.length }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes Programmes</h1>
        <p className="text-gray-600 mt-2">Gérez et créez vos programmes de rééducation</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">Chargement des programmes...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erreur: {error}</p>
        </div>
      )}

      {/* Programs Grid */}
      {!loading && programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => {
            const exercisePreview = getExercisePreview(program.program_exercises)

            return (
              <Link
                key={program.id}
                href={`/therapeute/programmes/${program.id}`}
                className="group"
              >
                <div className="h-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  {/* Content Container */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Therapy Type Badge */}
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div></div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Physiothérapie
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                      {program.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {program.description || 'Programme de rééducation'}
                    </p>

                    {/* Info Grid */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Exercices</p>
                        <p className="text-lg font-bold text-gray-900">
                          {exercisePreview.total}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-medium">Créé le</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(program.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Exercises Preview */}
                    <div className="mb-4 flex-grow">
                      <p className="text-xs font-medium text-gray-500 mb-2 uppercase">
                        Exercices inclus
                      </p>
                      <div className="space-y-1">
                        {exercisePreview.items.map((exercise, idx) => (
                          <p key={idx} className="text-sm text-gray-700">
                            {exercise.index}. {exercise.title}
                          </p>
                        ))}
                        {exercisePreview.remaining > 0 && (
                          <p className="text-xs text-gray-500 italic mt-2">
                            +{exercisePreview.remaining} autres...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-[#00BAA8] hover:bg-[#008C7E] text-white font-medium py-2 px-4 flex items-center justify-center gap-2 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>Voir plus</span>
                  </button>
                </div>
              </Link>
            )
          })}
        </div>
      ) : !loading && programs.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-lg text-gray-500 mb-4">Aucun programme trouvé.</p>
        </div>
      ) : null}
    </div>
  )
}
