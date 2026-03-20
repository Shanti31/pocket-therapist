import Link from "next/link";

export default function Home() {
  const routes = [
    {
      section: "Authentification",
      links: [
        { label: "Connexion", href: "/auth/login" },
        { label: "Inscription", href: "/auth/register" },
      ],
    },
    {
      section: "Thérapeute",
      links: [
        { label: "Dashboard Thérapeute", href: "/therapeute" },
        { label: "Éditeur de Programmes", href: "/therapeute/programmes" },
      ],
    },
    {
      section: "Patient",
      links: [
        { label: "Dashboard Patient", href: "/patient" },
        { label: "Mes Séances", href: "/patient/seances" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pocket Therapist
          </h1>
          <p className="text-xl text-gray-600">
            Plateforme de réadaptation physique
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {routes.map((section) => (
            <div
              key={section.section}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {section.section}
              </h2>
              <nav className="space-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors text-center"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📋 Structure du Projet
          </h3>
          <p className="text-gray-600 mb-4">
            Cliquez sur les liens ci-dessus pour naviguer vers chaque section.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Authentification:</strong> Connexion et inscription</li>
            <li>✅ <strong>Thérapeute:</strong> Dashboard et éditeur de programmes</li>
            <li>✅ <strong>Patient:</strong> Dashboard et gestion des séances</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
