# 🐳 Quick Start Docker - Pocket Therapist

**La façon la plus simple de démarrer!**

---

## 📋 Prérequis (5 minutes)

1. **Docker Desktop** - [Télécharger](https://www.docker.com/products/docker-desktop)
   - Windows: WSL2 activé automatiquement
   - Mac: ARM64 ou Intel
   - Linux: Installer Docker & Docker Compose

2. **Git** - [Télécharger](https://git-scm.com/)

3. **Variables d'environnement Supabase** - [Créer compte](https://app.supabase.com)

---

## ⚡ Démarrage rapide (3 étapes)

### 1️⃣ Clone et config

```bash
# Clone le projet
git clone https://github.com/yourrepo/pocket-therapist.git
cd pocket-therapist

# Crée ton .env (copie depuis .env.example)
cp .env.example .env

# Édite .env avec tes clés Supabase
# nano .env (ou ouvre avec ton éditeur)
```

### 2️⃣ Lance Docker

**Linux/Mac:**
```bash
./docker.sh up-bg
```

**Windows PowerShell:**
```powershell
.\docker.ps1 up-bg
```

**Ou sans script:**
```bash
docker-compose up -d
```

### 3️⃣ Accède l'app

```
🎨 Frontend:  http://localhost:3000
⚙️  Backend:   http://localhost:8000
📚 API Docs:  http://localhost:8000/docs
```

---

## 🎮 Commandes courantes

### Démarrage & Arrêt

```bash
# Démarrer (avec logs visibles)
./docker.sh up

# Démarrer en arrière-plan
./docker.sh up-bg

# Arrêter
./docker.sh down

# Redémarrer
./docker.sh restart
```

### Logs & Debug

```bash
# Tous les logs
./docker.sh logs

# Logs backend uniquement
./docker.sh logs-backend

# Logs frontend uniquement
./docker.sh logs-frontend

# Statut des containers
./docker.sh status

# Stats en temps réel
./docker.sh stats
```

### Shell interactif

```bash
# Commandes dans le backend
./docker.sh shell-backend

# Commandes dans le frontend
./docker.sh shell-frontend

# Exemple: test une requête API
./docker.sh shell-backend
curl http://localhost:8000/db-test
exit
```

### Maintenance

```bash
# Supprimer les containers (garde les images)
./docker.sh clean

# Purger TOUT (containers, images, volumes)
./docker.sh clean-all

# Builder les images
./docker.sh build
```

---

## 🔎 Vérifier que ça marche

### Test Frontend

```bash
curl http://localhost:3000
# Doit retourner du HTML ou "404" (pas de contenu clair)
```

### Test Backend

```bash
curl http://localhost:8000/
# Doit retourner:
# {"status":"FastAPI is running!"}

curl http://localhost:8000/db-test
# Doit retourner les données de Supabase
```

### Test Database

```bash
# Shell backend
./docker.sh shell-backend

# Une fois dans le shell:
python -c "from database import supabase; print(supabase.table('patients').select('*').execute())"
exit
```

---

## 🔧 Configuration avancée

### Modifier les ports

**docker-compose.yml:**
```yaml
services:
  backend:
    ports:
      - "8001:8000"  # Port externe: 8001
  
  frontend:
    ports:
      - "3001:3000"  # Port externe: 3001
```

Puis accède:
- Frontend: http://localhost:3001
- Backend: http://localhost:8001

### Modifier les variables d'env

Édite `.env` et redémarre:

```bash
# Éditer
nano .env

# Redémarrer pour appliquer les changements
./docker.sh restart
```

### Volumes persistants

Les données **Supabase persistent** automatiquement (cloud).

Les données **locales** (logs, cache) sont supprimées avec `clean-all`.

---

## ❌ Troubleshooting

### Port déjà utilisé

```bash
# Trouver quel processus utilise le port
lsof -i :3000      # Frontend
lsof -i :8000      # Backend

# Tuer le processus (Linux/Mac)
kill -9 <PID>

# Ou utiliser des ports différents (voir "Configuration avancée")
```

### Backend ne démarre pas

```bash
# Voir les logs
./docker.sh logs-backend

# Vérifier les variables d'env
docker-compose exec backend env | grep SUPABASE

# Reconstruire
./docker.sh build-fresh
./docker.sh restart
```

### Frontend ne charge pas

```bash
# Voir les logs
./docker.sh logs-frontend

# Vérifier la variable API_URL
docker-compose exec frontend env | grep API_URL

# La valeur doit être: http://backend:8000
# (pas http://localhost:8000)
```

### Connectivité entre services

```bash
# Test depuis frontend → backend
./docker.sh shell-frontend
curl http://backend:8000/
exit

# Test depuis backend → frontend
./docker.sh shell-backend
curl http://frontend:3000/
exit
```

### Supprimer des logs énormes

```bash
# Trouver les gros logs
docker system df

# Nettoyer (attention ⚠️)
docker system prune -a
```

---

## 📊 Statut actuel

```bash
./docker.sh status

# Exemple output:
NAME                          COMMAND                  STATUS
pocket-therapist-backend      uvicorn main:app...      Up 2 minutes
pocket-therapist-frontend     npm start               Up 2 minutes
```

---

## 📚 Ressources

- **Dockerfile Backend:** `backend/Dockerfile`
- **Dockerfile Frontend:** `my-frontend/Dockerfile`
- **Docker Compose:** `docker-compose.yml`
- **Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Tech Doc:** [Documentation.md](Documentation.md)

---

## 🆘 Besoin d'aide?

1. Vérifier `.env` - Est-ce que les clés Supabase sont correctes?
2. Voir les logs - `./docker.sh logs`
3. Redémarrer - `./docker.sh restart`
4. Nettoyer - `./docker.sh clean` puis `./docker.sh up-bg`

---

**Crée par:** Pocket Therapist Team  
**Dernière mise à jour:** 21 Mars 2026  
**Status:** ✅ Prêt pour développement + production
