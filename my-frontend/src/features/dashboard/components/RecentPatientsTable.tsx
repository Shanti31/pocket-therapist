'use client'

import type { PatientRecent } from '../types'
import Link from 'next/link'

interface RecentPatientsTableProps {
  patients: PatientRecent[]
}

export function RecentPatientsTable({ patients }: RecentPatientsTableProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Patients Récents
      </h3>
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Pathologie
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Adhésion
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Douleur
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Difficulté
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Dernière séance
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr
                key={patient.id}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-[#f3f3f5] transition`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#00BAA8] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {patient.initials}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {patient.pathology}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-gray-900">
                    {patient.adherence.current}/{patient.adherence.total}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      patient.painLevel === 0
                        ? 'bg-green-100 text-green-800'
                        : patient.painLevel <= 3
                          ? 'bg-green-100 text-green-800'
                          : patient.painLevel <= 6
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {patient.painLevel}/10
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-gray-900">
                    {patient.difficulty}/10
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(patient.lastSessionDate).toLocaleDateString(
                    'fr-FR'
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/therapeute/patients/${patient.id}`}
                    className="text-[#00BAA8] hover:text-[#008C7E] font-medium transition"
                  >
                    Voir détails
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
