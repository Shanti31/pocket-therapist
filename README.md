# Documentation Technique - Pocket Therapist

**Version:** 1.0  
**Date:** Mars 2026  
**Statut:** En développement

---

## Table des Matières

1. [Vue d'ensemble du projet](#vue-densemble)
2. [Architecture globale](#architecture-globale)
3. [Spécifications techniques](#spécifications-techniques)
4. [Stack technologique](#stack-technologique)
5. [Matériel requis](#matériel-requis)
6. [Installation et configuration](#installation-et-configuration)
7. [Structure du projet](#structure-du-projet)
8. [Base de données](#base-de-données)
9. [API REST](#api-rest)
10. [Flux de données](#flux-de-données)

---

## Vue d'ensemble

**Pocket Therapist** est une application de gestion complète pour les patients en physiothérapie. Elle permet aux patients de suivre leurs séances d'exercices avec vidéos, d'évaluer leur douleur et leur fatigue, et aux thérapeutes de consulter le progès et les feedbacks de leurs patients.

### Objectifs
- ✅ Fournir une interface conviviale pour que les patients effectuent leurs exercices à domicile
- ✅ Permettre aux thérapeutes de suivre l'adhésion et la progression de leurs patients
- ✅ Stocker les retours (feedbacks) des patients pour analyse et suivi
- ✅ Intégrer des vidéos d'instruction pour chaque exercice
- ✅ Générer automatiquement les UUID des sessions pour la traçabilité

---

##  Architecture globale

### Modèle trois-tiers

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Client)                    │
│        Next.js 14 + React + TypeScript + Tailwind       │
│                (http://localhost:3000)                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                    HTTP/REST
                       │
┌──────────────────────▼──────────────────────────────────┐
│                 BACKEND (API Server)                    │
│            FastAPI + Python + Pydantic                  │
│              (http://localhost:8000)                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                  SQL REST API
                       │
┌──────────────────────▼──────────────────────────────────┐
│              DATABASE (Supabase)                        │
│         PostgreSQL + Storage (Supabase Cloud)          │
│         Authentification + Row Level Security           │
└─────────────────────────────────────────────────────────┘
```

### Rôles des utilisateurs

| Rôle | Accès | Fonctionnalités |
|------|-------|-----------------|
| **Patient** | Frontend seul | Voir sessions, faire exercices, soumettre feedbacks |
| **Thérapeute** | Frontend admin | Gérer patients, voir feedbacks, assigner programmes |
| **Admin** | Backend + Console Supabase | Configuration DB, gestion complète |

---

## Spécifications techniques

### Langages de programmation

| Composant | Langage | Version | Raison |
|-----------|---------|---------|--------|
| **Frontend** | TypeScript | 5.x | Type-safety, meilleure DX, réduction bugs |
| **Backend** | Python | 3.8+ | Rapidité développement, écosystème DS/ML riche |
| **Base de données** | SQL (PostgreSQL) | 14+ | Relationnelle, ACID, JSON support, scalabilité |

### Frameworks et bibliothèques clés

#### Frontend

```json
{
  "next": "^14.0",              // Framework React/SSR/SSG
  "react": "^18.0",              // Librairie UI
  "typescript": "^5.0",           // Typage statique
  "tailwindcss": "^3.x",          // CSS utility-first
  "uuid": "^9.x",                 // Génération UUID pour sessions
  "lucide-react": "latest"        // Icônes SVG
}
```

**Modules frontend critiques:**
- `next.js` - Routing, SSR, optimization
- `tailwindcss` - Design système turquoise (#00BAA8)
- `react hooks` - State management (useState, useEffect)
- `fetch API` - Requêtes HTTP (pas d'axios, natif)

#### Backend

```python
fastapi==0.104.0              # Framework web async
python-multipart==0.0.6       # Parsing multipart/form-data
pydantic==2.0+                # Validation données (Pydantic v2)
supabase==2.0+                # Client Supabase PostgreSQL & Storage
python-dotenv==1.0+           # Gestion variables d'environnement
uvicorn==0.24.0+              # Serveur ASGI
```

**Détails Pydantic:**
- Modèles stricts pour validation `SessionFeedbackRequest`
- Support populating by name (camelCase ↔ snake_case)
- Field aliases pour contrats React/Python
- Validation custom: `ge=1, le=10` pour pain_rating

#### Base de données

**Supabase = PostgreSQL + Extras:**
- **PostgreSQL** (SGBDR)
- **PostgREST** (Auto-API REST)
- **pg_graphql** (GraphQL optionnel)
- **Auth** (Authentification JWT)
- **Storage** (Fichiers - vidéos d'exercices)
- **RLS** (Row Level Security - contrôle d'accès)

---

## Stack technologique

### Développement

| Outil | Version | Usage |
|-------|---------|-------|
| **Node.js** | 18+ LTS | Runtime npm (frontend) |
| **npm** | 9+ | Package manager |
| **Python** | 3.10+ | Interpréteur backend |
| **pip** | 22+ | Package manager Python |
| **Git** | 2.40+ | Contrôle de version |
| **VS Code** | Latest | IDE |

### Runtime - Développement

**Frontend (HTTP Port 3000):**
```bash
npm run dev              # Next.js dev server avec HMR
```

**Backend (HTTP Port 8000):**
```bash
fastapi dev main.py
# FastAPI CLI avec auto-reload intégré
```

### Production (prévue)

- **Frontend:** Vercel (Node.js) ou Netlify
- **Backend:** Heroku, Railway, ou Docker
- **Database:** Supabase hosted (PostgreSQL)
- **Storage:** Supabase Storage ou S3

---

## Matériel requis

### Développement local

**Minimum:**
- CPU: Dual-core 2.0 GHz
- RAM: 8 GB
- Disque: 10 GB SSD disponible
- Internet: 10 Mbps stable

**Recommandé:**
- CPU: Quad-core 3.0+ GHz (AMD Ryzen 5, Intel i5+)
- RAM: 16 GB+
- Disque: 20 GB SSD NVMe
- Internet: 30+ Mbps

**Pour les vidéos:**
- Stockage pour ~20 vidéos d'exercices (~500 MB)
- Stockage Supabase: 1 GB gratuit inclus

### Production

**Backend:**
- Container Docker (512 MB RAM min, 1 GB recommandé)
- 1 vCPU

**Database:**
- Supabase free tier: 500 MB storage, 2 GB bandwidth/mois
- Plan Pro: $25/mois pour +50 GB

---

## Installation et configuration

### Prérequis

**Windows/Mac/Linux:**
```bash
# Vérifier les installations
node --version          # v18+
npm --version          #  9+
python --version       # 3.10+
git --version          # 2.40+
```

### Clone et setup - Frontend

```bash
cd my-frontend
npm install                                    # Installer dépendances
npm run dev                                    # Démarrer (port 3000)
```

**Structure création Next.js:**
```
my-frontend/
├── app/                  # App Router (Next.js 13+)
│   ├── page.tsx         # Landing page
│   ├── auth/            # Auth pages
│   ├── patient/         # Patient dashboard
│   └── therapeute/      # Thérapeute dashboard
├── src/
│   ├── components/      # Composants réutilisables
│   ├── features/        # Feature modules (sessions, patients, programs)
│   └── lib/             # Utilitaires
└── package.json         # Dépendances & scripts
```

### Clone et setup - Backend

```bash
cd backend
python -m venv venv                    # Créer virtualenv
source venv/bin/activate               # Linux/Mac
venv\Scripts\activate                  # Windows
pip install -r requirements.txt        # Installer dépendances
fastapi dev main.py                    # Démarrer (port 8000)
```

**Fichier `.env` (Backend):**
```bash
# .env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbG... (anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (service role)
```

### Configuration Supabase

**Créer projet:**
1. Aller sur https://app.supabase.com
2. Nouveau projet (PostgreSQL)
3. Copier `URL` et `anonKey`
4. Pâte dans `.env` backend

**Tables essentielles:**
```sql
-- patients (thérapeute crée les patients)
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  age INT,
  exercise_difficulty INT DEFAULT 5,
  adhesion INT DEFAULT 0,
  pain_level INT DEFAULT 0,
  number_of_programs INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- sessions (UUID, créée quand patient démarre)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id INT NOT NULL REFERENCES patients(id),
  therapist_id UUID,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- session_feedback (pain, fatigue, commentaires)
CREATE TABLE session_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id),
  patient_id INT NOT NULL REFERENCES patients(id),
  pain_level INT CHECK (pain_level >= 0 AND pain_level <= 10),
  effort_level INT CHECK (effort_level >= 1 AND effort_level <= 10),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- videos_metadata (Supabase Storage metadata)
CREATE TABLE videos_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  duration INT,
  url VARCHAR(1024),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Structure du projet

```
pocket-therapist/
│
├── Documentation.md          # Ce fichier
├── README.md
├── .gitignore
│
├── backend/                  # API FastAPI
│   ├── main.py              # Point d'entrée, endpoints principaux
│   ├── database.py          # Client Supabase
│   ├── requirements.txt      # Dépendances Python
│   ├── routers/
│   │   ├── patients.py       # Endpoints GET/POST patients
│   │   ├── programs.py       # Endpoints programmes de rééducation
│   │   ├── exercises.py      # Endpoints exercices
│   │   └── __pycache__/
│   └── __pycache__/
│
├── my-frontend/             # Application Next.js
│   ├── package.json          # Dépendances npm
│   ├── tsconfig.json         # Configuration TypeScript
│   ├── tailwind.config.js    # Thème turquoise
│   ├── next.config.ts        # Config Next.js
│   │
│   ├── app/                  # App Router (fichier-basé)
│   │   ├── layout.tsx        # Wrapper principal
│   │   ├── page.tsx          # Landing
│   │   ├── globals.css       # Styles globaux
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── patient/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx      # Dashboard patient
│   │   │   └── seances/page.tsx
│   │   └── therapeute/
│   │       ├── layout.tsx
│   │       ├── page.tsx      # Dashboard thérapeute
│   │       ├── patients/page.tsx
│   │       │   └── [id]/page.tsx  # Détails patient + feedbacks
│   │       ├── programmes/page.tsx
│   │       └── bibliotheque/page.tsx
│   │
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   │   └── ui/
│   │   │       └── index.ts
│   │   │
│   │   ├── features/         # Feature modules (par domaine)
│   │   │   ├── sessions/
│   │   │   │   ├── types.ts           # Interfaces Session, Exercise
│   │   │   │   ├── mock-data.ts       # Données demo
│   │   │   │   ├── utils.ts           # UUID generation
│   │   │   │   ├── api/
│   │   │   │   │   ├── sessions.ts    # POST /api/sessions
│   │   │   │   │   ├── feedback.ts    # POST /api/session-feedback
│   │   │   │   │   └── videos.ts      # GET /api/videos
│   │   │   │   └── components/
│   │   │   │       ├── SessionRunner.tsx         # Exercice flow
│   │   │   │       ├── PostSessionFeedback.tsx   # Formulaire feedback
│   │   │   │       ├── SkipFeedbackSheet.tsx
│   │   │   │       └── PatientDashboard.tsx
│   │   │   ├── patients/
│   │   │   ├── programs/
│   │   │   └── auth/
│   │   │
│   │   ├── lib/              # Utilitaires
│   │   │   └── index.ts
│   │   │
│   │   └── styles/           # Thèmes Tailwind
│   │
│   ├── public/               # Assets statiques
│   └── .env.local            # Variables d'env (git ignored)
│
└── test_*.py                 # Scripts test Python
```

---

## Base de données

### Schéma conceptuel

```
PATIENTS (1:Many) SESSIONS (1:Many) SESSION_FEEDBACK
   │                │                      │
   ├─ id            ├─ id (UUID)          ├─ id (UUID)
   ├─ first_name    ├─ patient_id ──────> ├─ session_id ──────> SESSIONS
   ├─ email         ├─ status             ├─ patient_id ──────> PATIENTS
   ├─ pain_level    └─ created_at         ├─ pain_level (0-10)
   └─ adhesion                             ├─ effort_level (1-10)
                                           └─ notes

      VIDEOS_METADATA
            │
      ├─ id (UUID)
      ├─ title
      ├─ description
      ├─ url (Supabase Storage)
      └─ category
```

### Types de données

| Colonne | Type | Règles | Exemple |
|---------|------|--------|---------|
| `session_id` | UUID | PK, NOT NULL | `6c554362-d74e-4ac2-9638-6896fdf98680` |
| `patient_id` | INTEGER | FK vers patients, NOT NULL | `1` |
| `pain_level` | INTEGER | CHECK 0-10 | `5` |
| `effort_level` | INTEGER | CHECK 1-10 | `6` |
| `notes` | TEXT | Nullable | `"Fatigué mais content"` |
| `created_at` | TIMESTAMP | DEFAULT NOW() | `2026-03-21 09:45:00` |

---

## 🔌 API REST

### Endpoints - Sessions

```http
POST /api/sessions
Content-Type: application/json

{
  "patient_id": 1
}

Response (201):
{
  "status": "success",
  "session_id": "6c554362-d74e-4ac2-9638-6896fdf98680"
}
```

```http
PATCH /api/sessions/{session_id}

Response (200):
{
  "status": "success",
  "data": [...]
}
```

### Endpoints - Feedbacks

```http
POST /api/session-feedback
Content-Type: application/json

{
  "session_id": "6c554362-d74e-4ac2-9638-6896fdf98680",
  "patient_id": 1,
  "pain_rating": 5,
  "fatigue": "moderate",
  "difficulty": "medium",
  "comment": "Très fatigué"
}

Response (200):
{
  "status": "success",
  "data": [{ "id": "...", "pain_level": 4, "effort_level": 6 }]
}
```

```http
GET /api/patient-feedback/{patient_id}

Response (200):
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "session_id": "uuid",
      "pain_level": 4,
      "effort_level": 6,
      "notes": "Très fatigué",
      "created_at": "2026-03-21T09:45:00"
    }
  ]
}
```

### Endpoints - Patients

```http
GET /api/patients

Response (200):
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "first_name": "Jean",
      "last_name": "Dupont",
      "email": "jean@example.com",
      "exercise_difficulty": 5,
      "adhesion": 75,
      "pain_level": 3
    }
  ]
}
```

```http
GET /api/patients/{patient_id}

Response (200):
{
  "status": "success",
  "data": { /* patient details */ }
}
```

### Endpoints - Fichiers

```http
GET /api/videos

Response (200):
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Flexion du genou",
      "url": "https://xxx.supabase.co/storage/v1/object/...",
      "duration": 45
    }
  ]
}
```

---

## Flux de données

### 1. Patient complète une séance

```
┌─────────────────────────────────────────────────────────┐
│ Patient clique "Commencer séance"                       │
│  SessionRunner.tsx monte                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ useEffect() → createSession({ patient_id: 1 })         │
│  (génère sessionId UUID au backend)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ HTTP POST /api/sessions
┌─────────────────────────────────────────────────────────┐
│ Backend: main.py create_session()                       │
│ ├─ Insère dans db.sessions                             │
│ └─ Retourne session_id (UUID)                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ setSessionId(newId)
┌─────────────────────────────────────────────────────────┐
│ Patient fait N exercices                                │
│ ├─ Affiche vidéo (depuis Supabase Storage)            │
│ ├─ Évalue douleur initial (0-10)                       │
│ └─ Exécute exercice (timer ou reps)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Patient complète → PostSessionFeedback modal            │
│ ├─ Pain rating (1-10)                                  │
│ ├─ Fatigue (low/moderate/high)                         │
│ ├─ Difficulty (easy/medium/hard)                       │
│ └─ Optional comment                                    │
└────────────────────┬────────────────────────────────────┘
                     │
              ▼ Click "Terminer"
┌─────────────────────────────────────────────────────────┐
│ handleSubmit() → saveSessionFeedback(feedback)          │
│ Payload:                                                │
│ {                                                       │
│   session_id: "6c554362...",                           │
│   patient_id: 1,                                       │
│   pain_rating: 5,                                      │
│   fatigue: "moderate",                                 │
│   difficulty: "medium",                                │
│   comment: "Très fatigué"                              │
│ }                                                       │
└────────────────────┬────────────────────────────────────┘
                     │
            ▼ HTTP POST /api/session-feedback
┌─────────────────────────────────────────────────────────┐
│ Backend: main.py create_session_feedback()              │
│ ├─ Pain rating (1-10) → pain_level (0-9)              │
│ ├─ Fatigue (low/mod/high) → effort_level (3/6/9)      │
│ └─ Insère dans db.session_feedback                    │
└────────────────────┬────────────────────────────────────┘
                     │
            ▼ completeSession(sessionId)
┌─────────────────────────────────────────────────────────┐
│ PATCH /api/sessions/{sessionId}                        │
│ ├─ Marque status = "completed"                         │
│ ├─ Ajoute completed_at = NOW()                         │
│ └─ Retour au dashboard                                 │
└─────────────────────────────────────────────────────────┘
```

### 2. Thérapeute consulte feedbacks d'un patient

```
┌──────────────────────────────────────────────────────────┐
│ Thérapeute: http://localhost:3000/therapeute/patients/1 │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼ useEffect
┌──────────────────────────────────────────────────────────┐
│ GET /api/patients/1        (détails patient)            │
│ GET /api/patient-feedback/1 (tous ses feedbacks)        │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼ Promise.all([req1, req2])
┌──────────────────────────────────────────────────────────┐
│ Backend retourne:                                        │
│ ├─ Patient: { id, name, email, pain_level, ... }       │
│ └─ Feedbacks: [                                         │
│      { session_id, pain_level, effort_level, notes }   │
│      { session_id, pain_level, effort_level, notes }   │
│    ]                                                    │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼ Render page
┌──────────────────────────────────────────────────────────┐
│ Page affiche:                                            │
│ ├─ Header patient (adhésion, douleur moyen, etc)       │
│ ├─ Section "Feedbacks des Séances"                     │
│ │  ├─ 📅 Date/heure                                    │
│ │  ├─ 😕 Douleur: 4/10                                │
│ │  ├─ 😮‍💨 Effort: 6/10                               │
│ │  └─ 💬 Commentaire: "Très fatigué"                   │
│ └─ Section "Programmes Assignés"                       │
└──────────────────────────────────────────────────────────┘
```

---

## Sécurité

### CORS (Cross-Origin Resource Sharing)

```python
# Backend: main.py
CORSMiddleware(
    allow_origins=["*"],        # En dev uniquement!
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["*"]
)

# Production: restrict à domaine spécifique
allow_origins=["https://monapp.vercel.app"]
```

### Validation des données (Pydantic)

```python
class SessionFeedbackRequest(BaseModel):
    session_id: str                          # Required
    patient_id: int                          # Required
    pain_rating: int                         # 1-10 obligatoire
    fatigue: str                             # low/moderate/high
    difficulty: str                          # easy/medium/hard
    comment: Optional[str] = None            # Optionnel
    
    # Pydantic valide automatiquement les types
    # pain_rating: "cinq" → TypeError
    # ain_rating: 15 → ValidationError (hors range)
    # pain_rating: 5 → OK
```

### Authentification (Future)

```python
# À implémenter: Supabase Auth
from supabase.client import create_client

# Pour patient: auth email + password
# Pour thérapeute: auth credentials + role

# RLS (Row Level Security) - Supabase SQL
ALTER TABLE session_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "patients_view_own_feedback"
  ON session_feedback
  FOR SELECT
  USING (patient_id = auth.uid());
```

---

## Testing

### Tests Backend

```bash
# Test une requête spécifique
python test_patients_api.py

# Test insertion feedback
python test_flow_v2.py

# Test UUID generation
python test_uuid_feedback.py
```

### Tests Frontend (Non implémenté)

```bash
# À ajouter:
npm install --save-dev jest @testing-library/react
npm run test
```

---

## Monitoring et Logs

### Backend Logs

```python
# Console logs
print("[API] Fetching patients...")
print(f"[FEEDBACK] Saving session={session_id}")
print(f"[ERROR] Failed to fetch: {str(e)}")

# Logs Supabase
# Disponible dans Supabase dashboard → Logs
```

### Frontend Logs

```javascript
// Console browser (F12)
console.log('✓ Session created:', data.session_id)
console.error('✗ Failed to save feedback:', error)

// DevTools React
// https://react-devtools-tutorial.vercel.app/
```

---

## Design System

### Couleurs

```css
/* Paletter turquoise */
--primary: #00BAA8        /* Turquoise principal */
--primary-hover: #008C7E  /* Turquoise foncé (hover) */
--secondary: #f3f3f5      /* Gris clair (arrière-plan) */
--text-dark: #030213      /* Noir */
--text-light: #666        /* Gris moyen */
--error: #d32f2f          /* Rouge */
--success: #388e3c        /* Vert */
```

### Typographie

```css
/* Tailwind defaults */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
h1: text-4xl font-bold
h2: text-xl font-bold
body: text-sm
```

---

## Status du projet

| Feature | Status | Notes |
|---------|--------|-------|
| Landing page | ✅ Complète | Sélection patient/thérapeute |
| Patient dashboard | ✅ Complète | Sessions pending/completed |
| Exercice runner (3-phase) | ✅ Complète | Pain initial → vidéo → exercice |
| Feedback form | ✅ Complète | Pain, fatigue, difficulty, comments |
| Session creation | ✅ Complète | UUID auto-generated |
| Feedback storage | ✅ Complète | Base de données |
| Thérapeute dashboard | ✅ Complète | Voir patients |
| Feedback viewing | ✅ Complète | Affichage dans détails patient |
| Authentification | ❌ À faire | Supabase Auth |
| Patient notes | ❌ À faire | Journal séances |
| Video CORS | ✅ Résolu | Supabase Storage |
| API errors | ✅ Fixed | Retry + detailed logs |

---

## Ressources

### Documentation externe

- [Next.js 14 Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Pydantic Docs](https://docs.pydantic.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Commandes utiles

```bash
# Frontend
npm run dev              # Démarrer dev server
npm run build            # Build production
npm run lint             # Linter ESLint
npm install uuid         # Installer packages

# Backend
fastapi dev main.py                 # Dev server
python -m pytest                   # Tests (si ajoutés)
pip freeze > requirements.txt      # Exporter dépendances

# Git
git init
git add .
git commit -m "Initial commit"
git push origin main
```

---

## Support & Contact

Pour des questions techniques:
1. Vérifier les logs (terminal backend/frontend)
2. Consulter Supabase dashboard
3. Vérifier la connexion API (`http://localhost:8000/`)

---

**Dernière mise à jour:** 21 Mars 2026  
**Mainteneur:** Équipe Pocket Therapist  
**Licence:** MIT (À confirmer)
