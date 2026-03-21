# ====================================================
# Makefile - Pocket Therapist
# ====================================================
# Utilisation: make <target>
# Exemple: make up, make logs, make build
#
# Note: Nécessite GNU Make (preinstallé sur Linux/Mac)
#       Sur Windows: installer via WSL ou utiliser PowerShell
# ====================================================

.PHONY: help up down build logs shell clean restart status

# Default target
help:
	@echo "🏥 Pocket Therapist - Commandes Docker"
	@echo "========================================"
	@echo ""
	@echo "📦 Installation & Démarrage:"
	@echo "  make up              - Démarrer l'application (dev)"
	@echo "  make down            - Arrêter l'application"
	@echo "  make restart         - Redémarrer l'application"
	@echo "  make build           - Builder les images Docker"
	@echo ""
	@echo "🐛 Debug & Monitoring:"
	@echo "  make logs            - Afficher les logs (temps réel)"
	@echo "  make logs-backend    - Logs backend uniquement"
	@echo "  make logs-frontend   - Logs frontend uniquement"
	@echo "  make status          - Statut des containers"
	@echo "  make shell-backend   - Shell interactif backend"
	@echo "  make shell-frontend  - Shell interactif frontend"
	@echo ""
	@echo "🧹 Maintenance:"
	@echo "  make clean           - Supprimer les containers & volumes"
	@echo "  make clean-all       - Purger TOUT (images incluses)"
	@echo ""
	@echo "🚀 Production:"
	@echo "  make prod-up         - Démarrer en production"
	@echo "  make prod-down       - Arrêter la production"
	@echo ""

# ====================================================
# Commandes basiques
# ====================================================

# Démarrer tous les services en développement
up:
	@echo "🚀 Démarrage de Pocket Therapist (Dev)..."
	docker-compose up

# Démarrer en mode détaché (background)
up-d:
	@echo "🚀 Démarrage en arrière-plan..."
	docker-compose up -d
	@echo "✅ Services lancés!"
	@echo "Frontend:  http://localhost:3000"
	@echo "Backend:   http://localhost:8000"

# Arrêter les services
down:
	@echo "⏹️  Arrêt des services..."
	docker-compose down
	@echo "✅ Services arrêtés"

# Redémarrer
restart: down up-d
	@echo "✅ Services redémarrés"

# ====================================================
# Build
# ====================================================

# Builder les images
build:
	@echo "🔨 Build des images Docker..."
	docker-compose build
	@echo "✅ Build terminé"

# Builder sans cache (force rebuild)
build-fresh:
	@echo "🔨 Build fresh (sans cache)..."
	docker-compose build --no-cache
	@echo "✅ Build terminé"

# ====================================================
# Logs & Debug
# ====================================================

# Logs en temps réel (tous les services)
logs:
	@echo "📋 Logs (fermez avec Ctrl+C)..."
	docker-compose logs -f

# Logs backend
logs-backend:
	docker-compose logs -f backend

# Logs frontend
logs-frontend:
	docker-compose logs -f frontend

# Afficher le statut
status:
	@echo "📊 Statut des containers:"
	docker-compose ps

# Stats en temps réel
stats:
	docker stats pocket-therapist-backend pocket-therapist-frontend

# Shell interactif backend
shell-backend:
	@echo "🐚 Shell backend (tapez 'exit' pour quitter)..."
	docker-compose exec backend sh

# Shell interactif frontend
shell-frontend:
	@echo "🐚 Shell frontend (tapez 'exit' pour quitter)..."
	docker-compose exec frontend sh

# ====================================================
# Maintenance
# ====================================================

# Supprimer les containers (garde les images)
clean:
	@echo "🧹 Suppression des containers..."
	docker-compose down
	@echo "✅ Containers supprimés"

# Purger tout (containers, images, volumes)
clean-all:
	@echo "🔥 Purge complète (containers, images, volumes)..."
	docker-compose down -v --rmi all
	@echo "⚠️  TOUT a été supprimé!"

# ====================================================
# Production
# ====================================================

# Démarrer en production
prod-up:
	@echo "🚀 Démarrage en PRODUCTION..."
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✅ Services en production!"

# Arrêter la production
prod-down:
	@echo "⏹️  Arrêt de la production..."
	docker-compose -f docker-compose.prod.yml down
	@echo "✅ Production arrêtée"

# ====================================================
# Utils
# ====================================================

# Trier les logs par erreur
errors:
	docker-compose logs 2>&1 | grep -i error

# Vérifier la connectivité
ping:
	@echo "🔗 Test de connectivité..."
	docker-compose exec frontend curl -s http://backend:8000 > /dev/null && echo "✅ Backend accessible" || echo "❌ Backend non accessible"

# Informations des images
images:
	@echo "🐳 Images Docker:"
	docker images | grep pocket-therapist

# ====================================================
# Configuration
# ====================================================

# Afficher la config Docker Compose
config:
	docker-compose config

# Valider la config
validate:
	docker-compose config --quiet && echo "✅ Config valide" || echo "❌ Config invalide"

# ====================================================
# Quick start
# ====================================================

# Quick start = setup complet
quick-start: build up-d
	@echo "✨ Setup terminé!"
	@echo "Frontend:  http://localhost:3000"
	@echo "Backend:   http://localhost:8000"
	@echo "Docs API:	http://localhost:8000/docs"
