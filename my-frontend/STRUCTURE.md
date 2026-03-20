# Structure du Projet Pocket Therapist

## 📁 Architecture Complète

```
src/
├── app/                          # Routes Next.js (App Router)
│   ├── auth/                    # Routes d'authentification
│   │   ├── login/               # Page de connexion
│   │   └── register/            # Page d'inscription
│   ├── therapeute/              # Interface thérapeutes
│   │   ├── layout.tsx          # Layout avec sidebar
│   │   ├── page.tsx            # Dashboard thérapeute
│   │   └── programmes/         # Éditeur de programmes
│   │       └── page.tsx        # Page des programmes
│   └── patient/                 # Interface patients (mobile-first)
│       ├── layout.tsx          # Layout mobile-optimisé
│       ├── page.tsx            # Dashboard patient
│       └── seances/            # Gestion des séances
│           └── page.tsx        # Page des séances
│
├── components/                   # Composants réutilisables
│   └── ui/                      # Composants bêtes (buttons, inputs, etc.)
│       └── index.ts            # Export centralisé
│
├── features/                    # Logique métier (core de l'app)
│   ├── auth/                   # Feature A: Authentification
│   │   └── index.ts           # Server actions, types
│   ├── programs/               # Feature B: Éditeur de programmes
│   │   └── index.ts           # Logique programmes
│   ├── patients/               # Feature C: Gestion patients
│   │   └── index.ts           # Gestion patients & suivi
│   └── sessions/               # Feature D: Séances patient
│       └── index.ts           # Logique séances
│
└── lib/                        # Utilitaires globaux
    └── index.ts               # DB config, formatters, helpers
```

## 🎯 Modules par Responsabilité

### Feature A: Authentification (`src/features/auth/`)
- Routes: `/auth/login`, `/auth/register`
- Connexion thérapeutes et patients
- Validation formulaires

### Feature B: Éditeur de Programmes (`src/features/programs/`)
- Route: `/therapeute/programmes`
- Construction de parcours d'exercices
- Sélection exercices & durées
- Bibliothèques personnalisées

### Feature C: Gestion Patients (`src/features/patients/`)
- Route: `/therapeute` (dashboard)
- Distribution de programmes
- Génération de liens temporaires
- Historique & feedbacks

### Feature D: Séances Patient (`src/features/sessions/`)
- Routes: `/patient`, `/patient/seances`
- Accès au programme
- Démarrage séances
- Feedback douleur/difficulté/fatigue

## 👷 Règles de Travail en Équipe

1. **Isolement par Feature**: Chaque dev ne modifie que son dossier feature
2. **Composants UI Centralisés**: Tous les boutons/inputs dans `src/components/ui/`
3. **Naming Branches**: `feature/auth-therapist-login`, `feature/patient-session-feedback`
4. **Protected Routes**: Middleware dans `src/features/auth/middleware.ts`
