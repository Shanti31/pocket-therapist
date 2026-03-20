

### 1. Architecture des dossiers (Next.js App Router)

Nous allons séparer les vues (dans `src/app`) de la logique métier (dans `src/features`). 

**Structure principale du projet :**

* `src/app/(auth)/` : Routes de connexion et d'inscription.
* `src/app/therapeute/` : Interface dédiée aux soignants avec son propre layout (navigation, sidebar).
* `src/app/patient/` : Interface dédiée aux patients avec son layout (adapté mobile).
* `src/components/ui/` : Composants partagés "bêtes" (boutons, inputs, modales) via shadcn/ui par exemple.
* `src/features/` : **Le cœur de l'application.** Chaque dossier ici contient ses propres composants, server actions et requêtes.
* `src/lib/` : Utilitaires globaux (configuration de la base de données, fonctions de formatage).

---

### 2. Répartition du travail par "Features" (Modules indépendants)

Voici comment diviser vos User Stories en modules isolés pour répartir les tâches dans l'équipe.

#### Feature A : Authentification et Onboarding (`src/features/auth/`)
*Ce module gère tous les accès à la plateforme.*
* [cite_start]**Thérapeute** : Création de compte et connexion via email thérapeute[cite: 1].
* [cite_start]**Patient** : Création de compte (nom, prénom, âge) et définition du mot de passe à partir du lien d'invitation[cite: 5].
* **Tâches isolées** : Server actions pour le login, composants de formulaire, middleware Next.js pour protéger les routes.

#### Feature B : Éditeur de Programmes (`src/features/programs/`)
*Ce module est le plus complexe côté thérapeute. Un développeur peut s'y consacrer exclusivement.*
* [cite_start]Construction d'un parcours d'exercices clair[cite: 1].
* [cite_start]Sélection des exercices, définition des durées, création et structuration de l'ordre du programme[cite: 2].
* [cite_start]Création de bibliothèques personnalisées (détermination des instructions et des exercices)[cite: 4].
* [cite_start]Adaptation d'un parcours patient existant (reparamétrage et envoi d'un nouveau programme)[cite: 4].

#### Feature C : Gestion des Patients et Suivi (`src/features/patients/`)
*Ce module se concentre sur le dashboard du thérapeute et la distribution.*
* [cite_start]Génération de liens temporaires pour partager les programmes[cite: 1].
* [cite_start]Dashboard général avec personnalisation et filtres[cite: 4].
* [cite_start]Distribution des programmes, sélection et filtrage des patients[cite: 3, 4].
* [cite_start]Consultation de l'historique et des retours (feedbacks)[cite: 4].

#### Feature D : Expérience Patient et Séances (`src/features/sessions/`)
*Ce module gère ce que le patient voit au quotidien, idéal pour un développeur axé UI/UX mobile.*
* [cite_start]Accès clair au dashboard patient et au programme[cite: 5].
* [cite_start]Démarrage de la séance journalière et possibilité de passer (skip) un exercice avec feedback[cite: 5].
* [cite_start]Soumission du ressenti de fin de séance[cite: 5].
* [cite_start]Sélection du degré de douleur, de difficulté, de fatigue et ajout d'un commentaire[cite: 6].

---

### 3. Stratégie Git Recommandée

Pour tirer parti de cette structure, voici les règles à mettre en place dans votre équipe :

* **Règle d'isolement** : Un développeur travaillant sur le "Module B" ne doit modifier que les fichiers dans `src/features/programs/` et `src/app/therapeute/programmes/`. 
* **Composants UI stricts** : Si un développeur a besoin d'un nouveau bouton, il l'ajoute dans `src/components/ui/`. Les autres doivent réutiliser l'existant pour éviter les doublons.
* **Branches par feature** : Nommez vos branches selon la structure (ex: `feature/auth-therapist-login`, `feature/patient-session-feedback`).

---


