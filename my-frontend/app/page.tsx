import Link from 'next/link'
import { UserCog, User } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00BAA8] to-[#008C7E] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 md:mb-12 px-2">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight">
            Thérapeute de Poche
          </h1>
          <p className="text-base md:text-xl text-white/90">
            Plateforme de rééducation pour patients hospitalisés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-2">
          {/* Thérapeute Card */}
          <Link
            href="/therapeute"
            className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-[#00BAA8] rounded-full flex items-center justify-center">
                <UserCog className="w-8 md:w-10 h-8 md:h-10 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Thérapeute</h2>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                Créez des programmes, suivez vos patients et adaptez les exercices
              </p>
            </div>
          </Link>

          {/* Patient Card */}
          <Link
            href="/patient"
            className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-[#00BAA8] rounded-full flex items-center justify-center">
                <User className="w-8 md:w-10 h-8 md:h-10 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Patient</h2>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                Consultez vos séances, réalisez vos exercices et suivez votre progression
              </p>
            </div>
          </Link>
        </div>

        <p className="text-center text-white/80 mt-6 md:mt-8 text-xs md:text-sm">
          Prototype de démonstration - Mars 2026
        </p>
      </div>
    </div>
  )
}
