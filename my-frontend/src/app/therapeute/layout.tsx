export default function TherapeuteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar / Navigation */}
      <aside className="w-64 bg-white shadow">
        <nav className="mt-5 px-2 space-y-1">
          {/* Navigation items */}
        </nav>
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
