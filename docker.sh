#!/bin/bash
# ====================================================
# docker.sh - Pocket Therapist Docker Helper
# ====================================================
# Utilisation:
#   ./docker.sh up
#   ./docker.sh down
#   ./docker.sh logs
#
# Permissions:
#   chmod +x docker.sh
# ====================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Commande par défaut
COMMAND=${1:-help}

show_help() {
    echo -e "${CYAN}🏥 Pocket Therapist - Docker Helper${NC}"
    echo -e "${CYAN}====================================${NC}"
    echo ""
    echo -e "${YELLOW}📦 Installation & Démarrage:${NC}"
    echo "  ./docker.sh up              - Démarrer l'application (dev)"
    echo "  ./docker.sh up-bg           - Démarrer en arrière-plan"
    echo "  ./docker.sh down            - Arrêter l'application"
    echo "  ./docker.sh restart         - Redémarrer l'application"
    echo "  ./docker.sh build           - Builder les images"
    echo ""
    echo -e "${YELLOW}🐛 Debug & Monitoring:${NC}"
    echo "  ./docker.sh logs            - Afficher les logs"
    echo "  ./docker.sh logs-backend    - Logs backend uniquement"
    echo "  ./docker.sh logs-frontend   - Logs frontend uniquement"
    echo "  ./docker.sh status          - Statut des containers"
    echo "  ./docker.sh stats           - Stats (CPU, RAM)"
    echo "  ./docker.sh shell-backend   - Shell interactif backend"
    echo "  ./docker.sh shell-frontend  - Shell interactif frontend"
    echo ""
    echo -e "${YELLOW}🧹 Maintenance:${NC}"
    echo "  ./docker.sh clean           - Supprimer les containers"
    echo "  ./docker.sh clean-all       - Purger TOUT"
    echo ""
}

# ====================================================
# Commandes
# ====================================================

case $COMMAND in
    up)
        echo -e "${GREEN}🚀 Démarrage de Pocket Therapist (Dev)...${NC}"
        docker-compose up
        ;;
    
    up-bg)
        echo -e "${GREEN}🚀 Démarrage en arrière-plan...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✅ Services lancés!${NC}"
        echo -e "${CYAN}Frontend:  http://localhost:3000${NC}"
        echo -e "${CYAN}Backend:   http://localhost:8000${NC}"
        ;;
    
    down)
        echo -e "${YELLOW}⏹️  Arrêt des services...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Services arrêtés${NC}"
        ;;
    
    restart)
        echo -e "${YELLOW}🔄 Redémarrage...${NC}"
        docker-compose down
        docker-compose up -d
        echo -e "${GREEN}✅ Services redémarrés${NC}"
        ;;
    
    build)
        echo -e "${YELLOW}🔨 Build des images Docker...${NC}"
        docker-compose build
        echo -e "${GREEN}✅ Build terminé${NC}"
        ;;
    
    build-fresh)
        echo -e "${YELLOW}🔨 Build fresh (sans cache)...${NC}"
        docker-compose build --no-cache
        echo -e "${GREEN}✅ Build terminé${NC}"
        ;;
    
    logs)
        echo -e "${CYAN}📋 Logs (fermez avec Ctrl+C)...${NC}"
        docker-compose logs -f
        ;;
    
    logs-backend)
        echo -e "${CYAN}📋 Logs Backend...${NC}"
        docker-compose logs -f backend
        ;;
    
    logs-frontend)
        echo -e "${CYAN}📋 Logs Frontend...${NC}"
        docker-compose logs -f frontend
        ;;
    
    status)
        echo -e "${CYAN}📊 Statut des containers:${NC}"
        docker-compose ps
        ;;
    
    stats)
        echo -e "${CYAN}📊 Stats (CPU, RAM)...${NC}"
        docker stats pocket-therapist-backend pocket-therapist-frontend
        ;;
    
    shell-backend)
        echo -e "${CYAN}🐚 Shell backend (tapez 'exit' pour quitter)...${NC}"
        docker-compose exec backend sh
        ;;
    
    shell-frontend)
        echo -e "${CYAN}🐚 Shell frontend (tapez 'exit' pour quitter)...${NC}"
        docker-compose exec frontend sh
        ;;
    
    clean)
        echo -e "${YELLOW}🧹 Suppression des containers...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Containers supprimés${NC}"
        ;;
    
    clean-all)
        echo -e "${RED}🔥 Purge complète (containers, images, volumes)...${NC}"
        echo -e "${RED}⚠️  Êtes-vous sûr? (Tapez 'oui' pour confirmer)${NC}"
        read -r confirm
        
        if [ "$confirm" = "oui" ]; then
            docker-compose down -v --rmi all
            echo -e "${GREEN}✅ TOUT a été supprimé!${NC}"
        else
            echo -e "${YELLOW}❌ Annulé${NC}"
        fi
        ;;
    
    quick-start)
        echo -e "${CYAN}✨ Quick start...${NC}"
        docker-compose build
        docker-compose up -d
        echo -e "${GREEN}✨ Setup terminé!${NC}"
        echo -e "${CYAN}Frontend:  http://localhost:3000${NC}"
        echo -e "${CYAN}Backend:   http://localhost:8000${NC}"
        echo -e "${CYAN}Docs API:  http://localhost:8000/docs${NC}"
        ;;
    
    *)
        show_help
        ;;
esac
