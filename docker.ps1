# ====================================================
# docker.ps1 - Pocket Therapist Docker Helper
# ====================================================
# Utilisation (PowerShell):
#   .\docker.ps1 up
#   .\docker.ps1 down
#   .\docker.ps1 logs
#
# OU s'il y a problèmes de permissions:
#   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# ====================================================

param (
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "🏥 Pocket Therapist - Docker Helper (Windows)" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📦 Installation & Démarrage:" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 up              - Démarrer l'application (dev)" -ForegroundColor White
    Write-Host "  .\docker.ps1 up-bg           - Démarrer en arrière-plan" -ForegroundColor White
    Write-Host "  .\docker.ps1 down            - Arrêter l'application" -ForegroundColor White
    Write-Host "  .\docker.ps1 restart         - Redémarrer l'application" -ForegroundColor White
    Write-Host "  .\docker.ps1 build           - Builder les images" -ForegroundColor White
    Write-Host ""
    Write-Host "🐛 Debug & Monitoring:" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 logs            - Afficher les logs" -ForegroundColor White
    Write-Host "  .\docker.ps1 logs-backend    - Logs backend uniquement" -ForegroundColor White
    Write-Host "  .\docker.ps1 logs-frontend   - Logs frontend uniquement" -ForegroundColor White
    Write-Host "  .\docker.ps1 status          - Statut des containers" -ForegroundColor White
    Write-Host "  .\docker.ps1 shell-backend   - Shell interactif backend" -ForegroundColor White
    Write-Host "  .\docker.ps1 shell-frontend  - Shell interactif frontend" -ForegroundColor White
    Write-Host ""
    Write-Host "🧹 Maintenance:" -ForegroundColor Yellow
    Write-Host "  .\docker.ps1 clean           - Supprimer les containers" -ForegroundColor White
    Write-Host "  .\docker.ps1 clean-all       - Purger TOUT" -ForegroundColor White
    Write-Host ""
}

function Invoke-Docker {
    param([string]$Cmd)
    
    try {
        Invoke-Expression $Cmd
    }
    catch {
        Write-Host "❌ Erreur: $_" -ForegroundColor Red
        exit 1
    }
}

# ====================================================
# Commandes
# ====================================================

switch ($Command) {
    "up" {
        Write-Host "🚀 Démarrage de Pocket Therapist (Dev)..." -ForegroundColor Green
        Invoke-Docker "docker-compose up"
    }
    
    "up-bg" {
        Write-Host "🚀 Démarrage en arrière-plan..." -ForegroundColor Green
        Invoke-Docker "docker-compose up -d"
        Write-Host "✅ Services lancés!" -ForegroundColor Green
        Write-Host "Frontend:  http://localhost:3000" -ForegroundColor Cyan
        Write-Host "Backend:   http://localhost:8000" -ForegroundColor Cyan
    }
    
    "down" {
        Write-Host "⏹️  Arrêt des services..." -ForegroundColor Yellow
        Invoke-Docker "docker-compose down"
        Write-Host "✅ Services arrêtés" -ForegroundColor Green
    }
    
    "restart" {
        Write-Host "🔄 Redémarrage..." -ForegroundColor Yellow
        Invoke-Docker "docker-compose down"
        Invoke-Docker "docker-compose up -d"
        Write-Host "✅ Services redémarrés" -ForegroundColor Green
    }
    
    "build" {
        Write-Host "🔨 Build des images Docker..." -ForegroundColor Yellow
        Invoke-Docker "docker-compose build"
        Write-Host "✅ Build terminé" -ForegroundColor Green
    }
    
    "build-fresh" {
        Write-Host "🔨 Build fresh (sans cache)..." -ForegroundColor Yellow
        Invoke-Docker "docker-compose build --no-cache"
        Write-Host "✅ Build terminé" -ForegroundColor Green
    }
    
    "logs" {
        Write-Host "📋 Logs (fermez avec Ctrl+C)..." -ForegroundColor Cyan
        Invoke-Docker "docker-compose logs -f"
    }
    
    "logs-backend" {
        Write-Host "📋 Logs Backend..." -ForegroundColor Cyan
        Invoke-Docker "docker-compose logs -f backend"
    }
    
    "logs-frontend" {
        Write-Host "📋 Logs Frontend..." -ForegroundColor Cyan
        Invoke-Docker "docker-compose logs -f frontend"
    }
    
    "status" {
        Write-Host "📊 Statut des containers:" -ForegroundColor Cyan
        Invoke-Docker "docker-compose ps"
    }
    
    "shell-backend" {
        Write-Host "🐚 Shell backend (tapez 'exit' pour quitter)..." -ForegroundColor Cyan
        Invoke-Docker "docker-compose exec backend sh"
    }
    
    "shell-frontend" {
        Write-Host "🐚 Shell frontend (tapez 'exit' pour quitter)..." -ForegroundColor Cyan
        Invoke-Docker "docker-compose exec frontend sh"
    }
    
    "clean" {
        Write-Host "🧹 Suppression des containers..." -ForegroundColor Yellow
        Invoke-Docker "docker-compose down"
        Write-Host "✅ Containers supprimés" -ForegroundColor Green
    }
    
    "clean-all" {
        Write-Host "🔥 Purge complète (containers, images, volumes)..." -ForegroundColor Red
        Write-Host "⚠️  Êtes-vous sûr? (Tapez 'oui' pour confirmer)" -ForegroundColor Red
        $confirm = Read-Host
        
        if ($confirm -eq "oui") {
            Invoke-Docker "docker-compose down -v --rmi all"
            Write-Host "✅ TOUT a été supprimé!" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Annulé" -ForegroundColor Yellow
        }
    }
    
    "quick-start" {
        Write-Host "✨ Quick start..." -ForegroundColor Cyan
        Invoke-Docker "docker-compose build"
        Invoke-Docker "docker-compose up -d"
        Write-Host "✨ Setup terminé!" -ForegroundColor Green
        Write-Host "Frontend:  http://localhost:3000" -ForegroundColor Cyan
        Write-Host "Backend:   http://localhost:8000" -ForegroundColor Cyan
        Write-Host "Docs API:  http://localhost:8000/docs" -ForegroundColor Cyan
    }
    
    default {
        Show-Help
    }
}
