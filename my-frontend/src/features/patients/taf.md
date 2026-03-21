Titre : feat(patient-experience): Intégration des 7 nouvelles fonctionnalités UX/UI (Dashboard & Tunnel de Séance)

Rôle : Tu es un développeur Front-end Senior expert en Next.js (App Router), React, Tailwind CSS et shadcn/ui.

Contexte : Nous développons la "Feature D : Expérience Patient et Séances" pour l'application "Pocket Therapy" (architecture Feature-Sliced Design). L'interface doit être strictement Mobile-First, fluide et accessible.
Important : Nous avons déjà un backend et une base de données. Ne mocke pas les exercices ou les vidéos. Les objets Exercise passés en props contiennent déjà les vraies URLs des vidéos (videoUrl) et les vraies données.

Mission : Intégrer 7 nouvelles fonctionnalités issues des retours utilisateurs. Voici la liste exacte :

Avoir un chrono qui s'écoule après avoir vu la vidéo de l'exercice (temps de repos).

Mettre une échelle de douleur avant l'exercice.

Possibilité d'appuyer sur le programme, voir les exercices, puis démarrer l'exercice (Aperçu).

Avoir une progressbar lors des exercices pour se repérer dans la séance.

Rajouter des indices visuels (emojis) sur les échelles de douleur et fatigue.

Permettre au patient de savoir sa progression sur les séances, et les détails de celle-ci s'il clique dessus (historique détaillé des exercices faits).

Rubrique "Note" pour le patient où il peut écrire ses commentaires/pensées, visibles par le thérapeute.

Plan d'Implémentation Requis :

Je veux que tu génères ou mettes à jour les composants suivants en respectant ces directives :

1. Le Tunnel de Séance interactif (src/features/sessions/components/SessionRunner.tsx)

Progressbar (Point 4) : Ajoute une barre de progression en haut de l'écran (ex: "Exercice 2 sur 5").

Douleur Pré-Exercice (Point 2) : Avant de lancer un exercice, affiche un écran ou un tiroir demandant : "Quelle est votre douleur avant de commencer ?" (échelle 0-10 avec emojis).

Vidéo & Chrono intelligent (Point 1) : Affiche le lecteur vidéo natif (via l'URL de l'exercice). Le composant du timer/chrono de l'exercice ne doit s'afficher et démarrer qu'une fois la vidéo terminée (utilise l'event onEnded de la balise <video>) ou si le patient clique sur un bouton "Passer l'instruction".

2. Le Feedback de Fin (src/features/sessions/components/PostSessionFeedback.tsx)

Emojis (Point 5) : Modifie les sélecteurs de douleur et de fatigue pour intégrer des emojis clairs au-dessus ou à côté des valeurs (ex: 🟢 🙂 pour facile/sans douleur, 🔴 😩 pour difficile/douloureux).

3. Le Dashboard & Historique (src/features/sessions/components/PatientDashboard.tsx & sous-composants)

Aperçu du Programme (Point 3) : Dans la liste "Séances à faire", un clic sur une séance ouvre un BottomSheet (ou Drawer shadcn) qui liste les exercices (titre, durée). Le bouton "Démarrer la séance" se trouve à l'intérieur de ce tiroir.

Historique Détaillé (Point 6) : Dans "Séances terminées", un clic ouvre un composant SessionDetails.tsx montrant le récapitulatif : exercices complétés, ignorés (skips) et les retours donnés.

Journal de Bord (Point 7) : Ajoute un composant PatientNotesCard.tsx sur le dashboard. Il contient un textarea et un bouton "Enregistrer" pour que le patient prenne des notes libres, envoyées via une Server Action ou un call API (prépare juste la fonction onSubmit vide avec un TODO pour l'appel backend).

Livrable attendu :
Commence par me fournir le code complet et robuste de SessionRunner.tsx qui gère l'enchaînement : Douleur pré-exo -> Vidéo -> Fin de vidéo -> Chrono/Exercice -> Exercice suivant.
Utilise les composants de shadcn/ui (Slider, Progress, Button, Card) et les icônes lucide-react. Assure-toi que la gestion d'état (useState, useRef) pour la vidéo et le chrono est propre.