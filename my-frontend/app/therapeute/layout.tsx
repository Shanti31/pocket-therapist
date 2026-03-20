'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TherapeuteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeMenu, setActiveMenu] = useState('programmes')
  const [showActionMenu, setShowActionMenu] = useState(false)
  const router = useRouter()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-indigo-600">PT Therapist</h2>
          <p className="text-sm text-gray-500 mt-1">Tableau de Bord</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <Link
            href="/therapeute"
            onClick={() => setActiveMenu('programmes')}
            className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
              activeMenu === 'programmes'
                ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Programmes
          </Link>
          <Link
            href="/therapeute/bibliotheque"
            onClick={() => setActiveMenu('bibliotheque')}
            className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
              activeMenu === 'bibliotheque'
                ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Bibliothèque
          </Link>
          <Link
            href="/therapeute/patients"
            onClick={() => setActiveMenu('patients')}
            className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
              activeMenu === 'patients'
                ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Patients
          </Link>
        </nav>

        {/* Action Buttons - Bottom */}
        <div className="p-4 border-t border-gray-200 relative">
          <button
            onClick={() => setShowActionMenu(!showActionMenu)}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-2xl"
          >
            +
          </button>

          {/* Action Menu Dropdown */}
          {showActionMenu && (
            <div className="absolute bottom-20 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-40">
              <button
                onClick={() => {
                  router.push('/therapeute?createProgram=true')
                  setShowActionMenu(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-left text-gray-900 hover:bg-indigo-50 font-medium border-b border-gray-200 transition-colors"
              >
                Créer Programme +
              </button>
              <button
                onClick={() => {
                  setShowActionMenu(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-left text-gray-900 hover:bg-green-50 font-medium transition-colors"
              >
                Ajouter Patient +
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
