# ====================================================
# STAGE 1: Builder - Préparer les dépendances
# ====================================================
FROM python:3.10-slim AS builder

WORKDIR /app

# Installer curl (pour healthcheck) et dépendances de compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copier requirements.txt
COPY requirements.txt .

# Installer les dépendances Python dans un virtualenv
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# ====================================================
# STAGE 2: Runtime - Image finale (optimisée)
# ====================================================
FROM python:3.10-slim

# Définir le workdir
WORKDIR /app

# Installer curl pour healthcheck uniquement
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copier le virtualenv depuis le builder
COPY --from=builder /opt/venv /opt/venv

# Copier le code de l'application
COPY . .

# Définir les variables d'environnement
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# ====================================================
# Healthcheck - Vérifier que le serveur est accessible
# ====================================================
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT} || exit 1

# ====================================================
# Exposer le port
# ====================================================
EXPOSE ${PORT}

# ====================================================
# Démarrer l'application avec Uvicorn
# ====================================================
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
