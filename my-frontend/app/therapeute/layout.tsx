'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, LayoutDashboard, BookOpen, Library, Users, Menu, X } from 'lucide-react'

export default function TherapeuteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeMenu, setActiveMenu] = useState('programmes')
  const [showActionMenu, setShowActionMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Hidden on mobile, visible on md+ */}
      <aside className={`${
        mobileMenuOpen ? 'fixed' : 'hidden'
      } md:static md:flex w-full md:w-64 bg-white shadow-lg flex-col z-40`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#00BAA8]">Thérapeute de Poche</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Interface Thérapeute</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 mt-6 px-4 space-y-1">
          <Link
            href="/therapeute/dashboard"
            onClick={() => {
              setActiveMenu('dashboard')
              setMobileMenuOpen(false)
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeMenu === 'dashboard'
                ? 'bg-[#00BAA8] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm md:text-base">Dashboard</span>
          </Link>
          <Link
            href="/therapeute"
            onClick={() => {
              setActiveMenu('programmes')
              setMobileMenuOpen(false)
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeMenu === 'programmes'
                ? 'bg-[#00BAA8] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-sm md:text-base">Programmes</span>
          </Link>
          <Link
            href="/therapeute/bibliotheque"
            onClick={() => {
              setActiveMenu('bibliotheque')
              setMobileMenuOpen(false)
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeMenu === 'bibliotheque'
                ? 'bg-[#00BAA8] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Library className="w-5 h-5" />
            <span className="text-sm md:text-base">Bibliothèque</span>
          </Link>
          <Link
            href="/therapeute/patients"
            onClick={() => {
              setActiveMenu('patients')
              setMobileMenuOpen(false)
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeMenu === 'patients'
                ? 'bg-[#00BAA8] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-sm md:text-base">Patients</span>
          </Link>
        </nav>

        {/* Action Buttons - Bottom */}
        <div className="p-4 border-t border-gray-200 relative">
          <button
            onClick={() => setShowActionMenu(!showActionMenu)}
            className="w-full flex items-center justify-center gap-2 bg-[#00BAA8] text-white py-3 rounded-lg font-medium hover:bg-[#008C7E] transition-colors text-2xl"
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
                  router.push('/therapeute/patients?createPatient=true')
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
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#00BAA8]">Thérapeute de Poche</h1>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="py-4 md:py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  )
}
