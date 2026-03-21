# 🚀 Guide de Déploiement - Pocket Therapist

**Version:** 1.0  
**Date:** Mars 2026  
**Statut:** Production-ready

---

## Table des Matières

1. [Installation Docker](#installation-docker)
2. [Déploiement Local (Development)](#déploiement-local)
3. [Build et Production](#build-et-production)
4. [Déploiement sur Heroku](#déploiement-heroku)
5. [Déploiement sur Azure](#déploiement-azure)
6. [Déploiement sur AWS](#déploiement-aws)
7. [Monitoring et Logs](#monitoring-et-logs)
8. [Troubleshooting](#troubleshooting)

---

## 🐳 Installation Docker

### Prérequis

- **Docker Desktop** (v20.10+) - [Download](https://www.docker.com/products/docker-desktop)
- **Docker Compose** (v2.0+) - Inclus avec Docker Desktop
- **Git** (v2.40+)

### Vérifier l'installation

```bash
# Vérifier les versions
docker --version
docker-compose --version

# Vérifier que Docker fonctionne
docker run hello-world
```

---

## 🏘️ Déploiement Local (Development)

### Étape 1: Clone et Configuration

```bash
# Clone le projet
git clone https://github.com/yourrepo/pocket-therapist.git
cd pocket-therapist

# Crée ton fichier .env
cp .env.example .env

# Édite .env avec tes clés Supabase
nano .env
# ou avec VS Code
code .env
```

### Étape 2: Configuration .env

```bash
# Complète ces informations:
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

**Où trouver tes clés Supabase?**

1. Aller sur https://app.supabase.com
2. Sélectionner ton projet
3. Settings → API → Copier les clés
4. Seule `SUPABASE_KEY` est exposée au frontend
5. `SUPABASE_SERVICE_ROLE_KEY` reste server-side uniquement

### Étape 3: Démarrer l'application

```bash
# Build et démarrer tous les services
docker-compose up

# Ou en mode détaché (background)
docker-compose up -d

# Vérifier l'état des containers
docker-compose ps

# Voir les logs
docker-compose logs -f
# Logs uniquement du backend
docker-compose logs -f backend
# Logs uniquement du frontend
docker-compose logs -f frontend
```

### Étape 4: Accéder l'application

```
Frontend:  http://localhost:3000
Backend:   http://localhost:8000
API Docs:  http://localhost:8000/docs (Swagger)
```

### Arrêter l'application

```bash
# Arrêter les containers (les données persistent)
docker-compose stop

# Arrêter et supprimer les containers
docker-compose down

# Supprimer les données (images, volumes)
docker-compose down -v
```

---

## 🔨 Build et Production

### Build les images

```bash
# Build toutes les images
docker-compose build

# Build image spécifique
docker-compose build backend
docker-compose build frontend

# Build avec no-cache (force rebuild)
docker-compose build --no-cache
```

### Configuration Production

Crée `docker-compose.prod.yml`:

```yaml
version: '3.9'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    
    image: pocket-therapist-backend:latest
    
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - PORT=8000
    
    ports:
      - "8000:8000"
    
    # NO HOT RELOAD EN PRODUCTION
    command: uvicorn main:app --host 0.0.0.0 --port 8000
    
    restart: always
    
    # Logs des containers
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  frontend:
    build:
      context: ./my-frontend
      dockerfile: Dockerfile
    
    image: pocket-therapist-frontend:latest
    
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
      - NODE_ENV=production
      - PORT=3000
    
    ports:
      - "3000:3000"
    
    restart: always
    
    depends_on:
      - backend
    
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

Démarrer en production:

```bash
# Utiliser la config production
docker-compose -f docker-compose.prod.yml up -d

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## ☁️ Déploiement Heroku

### Prérequis

- Compte Heroku (free or paid)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### Étape 1: Créer les apps

```bash
# Login Heroku
heroku login

# Créer app backend
heroku create pocket-therapist-api

# Créer app frontend
heroku create pocket-therapist-web

# Vérifier les apps
heroku apps
```

### Étape 2: Configurer les variables d'env

```bash
# Backend
heroku config:set \
  SUPABASE_URL=https://xxxxx.supabase.co \
  SUPABASE_KEY=eyJhbGciOi... \
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... \
  -a pocket-therapist-api

# Frontend
heroku config:set \
  NEXT_PUBLIC_API_URL=https://pocket-therapist-api.herokuapp.com \
  NODE_ENV=production \
  -a pocket-therapist-web
```

### Étape 3: Créer Procfile

**backend/Procfile:**
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**my-frontend/Procfile:**
```
web: npm start
```

### Étape 4: Déployer

```bash
# Backend
cd backend
heroku git:remote -a pocket-therapist-api
git push heroku main

# Frontend
cd ../my-frontend
heroku git:remote -a pocket-therapist-web
git push heroku main

# Vérifier les logs
heroku logs --tail -a pocket-therapist-api
heroku logs --tail -a pocket-therapist-web
```

---

## ☁️ Déploiement Azure

### Prérequis

- Compte Azure
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

### Étape 1: Créer des ressources

```bash
# Login Azure
az login

# Créer un groupe de ressources
az group create --name pocket-therapist --location eastus

# Créer un Container Registry
az acr create --resource-group pocket-therapist \
  --name pockettherapistacr --sku Basic

# Récupérer login server
az acr show --name pockettherapistacr --query loginServer

# Login au registry
az acr login --name pockettherapistacr
```

### Étape 2: Build et Push images

```bash
# Build et push backend
az acr build --registry pockettherapistacr \
  --image pocket-therapist-backend:latest ./backend

# Build et push frontend
az acr build --registry pockettherapistacr \
  --image pocket-therapist-frontend:latest ./my-frontend
```

### Étape 3: Créer App Service Plan

```bash
# Plan (gratuit ou payant)
az appservice plan create \
  --name pocket-therapist-plan \
  --resource-group pocket-therapist \
  --sku FREE

# Web app backend
az webapp create \
  --resource-group pocket-therapist \
  --plan pocket-therapist-plan \
  --name pocket-therapist-api \
  --deployment-container-image-name pockettherapistacr.azurecr.io/pocket-therapist-backend:latest

# Web app frontend
az webapp create \
  --resource-group pocket-therapist \
  --plan pocket-therapist-plan \
  --name pocket-therapist-web \
  --deployment-container-image-name pockettherapistacr.azurecr.io/pocket-therapist-frontend:latest
```

### Étape 4: Configurer variables d'env

```bash
# Backend
az webapp config appsettings set \
  --name pocket-therapist-api \
  --resource-group pocket-therapist \
  --settings SUPABASE_URL=... SUPABASE_KEY=...

# Frontend
az webapp config appsettings set \
  --name pocket-therapist-web \
  --resource-group pocket-therapist \
  --settings NEXT_PUBLIC_API_URL=https://pocket-therapist-api.azurewebsites.net
```

---

## ☁️ Déploiement AWS

### Prérequis

- Compte AWS
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS CDK](https://aws.amazon.com/cdk/) (optionnel)

### Option 1: ECS (Elastic Container Service)

```bash
# Configure AWS CLI
aws configure

# Créer ECR repository (Elastic Container Registry)
aws ecr create-repository --repository-name pocket-therapist-backend
aws ecr create-repository --repository-name pocket-therapist-frontend

# Build et push (remplacer ACCOUNT_ID et REGION)
docker build -t pocket-therapist-backend:latest ./backend
docker tag pocket-therapist-backend:latest \
  ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/pocket-therapist-backend:latest
docker push ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/pocket-therapist-backend:latest

# Idem pour frontend...
```

### Option 2: Lightsail (Plus simple)

```bash
# Create container service
aws lightsail create-container-service \
  --service-name pocket-therapist \
  --capacity SMALL

# Push image
# (utiliser AWS Management Console ou CLI)
```

---

## 📊 Monitoring et Logs

### Docker Logs

```bash
# Logs temps réel (tous les services)
docker-compose logs -f

# Logs spécifiques
docker-compose logs -f backend
docker-compose logs -f frontend

# Logs avec timestamps
docker-compose logs -f --timestamps

# Dernières 100 lignes
docker-compose logs --tail=100
```

### Stats des containers

```bash
# CPU, RAM, Disk
docker stats

# Spécifique
docker stats pocket-therapist-backend pocket-therapist-frontend
```

### Healthcheck

```bash
# Vérifier l'état
docker-compose ps

# Détails healthcheck
docker inspect pocket-therapist-backend | grep -A 5 "Health"
```

### Logs Supabase

```
Dashboard Supabase → Logs
```

---

## 🔧 Troubleshooting

### Backend ne démarre pas

```bash
# 1. Vérifier les logs
docker-compose logs backend

# 2. Vérifier les variables d'env
docker-compose config | grep SUPABASE

# 3. Vérifier la connexion Supabase
docker-compose exec backend python -c \
  "from database import supabase; print(supabase.table('patients').select('*').execute())"

# 4. Rebuilder sans cache
docker-compose build --no-cache backend
docker-compose up backend
```

### Frontend ne charge pas

```bash
# 1. Vérifier les logs
docker-compose logs frontend

# 2. Vérifier NEXT_PUBLIC_API_URL
docker-compose exec frontend env | grep API_URL

# 3. Vérifier la connectivité au backend
docker-compose exec frontend curl http://backend:8000/

# 4. Rebuilder
docker-compose build --no-cache frontend
docker-compose up frontend
```

### Port déjà utilisé

```bash
# Vérifier quel processus utilise le port
lsof -i :3000     # Frontend
lsof -i :8000     # Backend

# Tuer le processus (Linux/Mac)
kill -9 <PID>

# Ou utiliser différents ports dans docker-compose.yml:
# ports:
#   - "3001:3000"  # Frontend
#   - "8001:8000"  # Backend
```

### Pas de connexion entre services

```bash
# Vérifier le network
docker network ls
docker network inspect pocket-therapist-network

# Vérifier la DNS
docker-compose exec frontend ping backend

# Vérifier l'URL API
# Backend doit utiliser: http://backend:8000
# Pas: http://localhost:8000 (pas de localhost en Docker)
```

### Volumes non persistés

```bash
# Sauvegarder les données avant
docker-compose down  # ⚠️  Supprime les containers

# Redémarrer
docker-compose up -d

# Vérifier les volumes
docker volume ls
docker volume inspect <volume_name>
```

---

## 🔒 Production Checklist

- [ ] Toutes les variables d'env définies
- [ ] Node.js/Python en version stable
- [ ] CORS configuré correctement
- [ ] SSL/TLS activé (HTTPS)
- [ ] Log rotation configurée
- [ ] Healthchecks actifs
- [ ] Backups Supabase configurés
- [ ] Monitoring en place
- [ ] Rate limiting configuré
- [ ] Secrets gérés (pas hardcodés)
- [ ] Database backups automatiques
- [ ] CDN/Cache configuré (optionnel)
- [ ] Documentation mise à jour

---

## 📞 Support

**Problème?**

1. Vérifier les logs: `docker-compose logs -f`
2. Consulter Documentation.md
3. Vérifier la connectivité: `docker network inspect pocket-therapist-network`
4. Rebuilder: `docker-compose build --no-cache`

---

**Dernière mise à jour:** 21 Mars 2026  
**Status:** Production-ready  
**License:** MIT
