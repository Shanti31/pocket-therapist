export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile optimized layout */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Pocket Therapist</h1>
        </div>
      </header>
      <main className="max-w-md mx-auto">
        {children}
      </main>
    </div>
  )
}
