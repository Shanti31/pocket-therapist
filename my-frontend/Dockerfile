# ====================================================
# STAGE 1: Builder - Build Next.js
# ====================================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build Next.js (génère .next folder)
RUN npm run build

# ====================================================
# STAGE 2: Runtime - Image finale optimisée
# ====================================================
FROM node:18-alpine

WORKDIR /app

# Installer dumb-init pour gérer correctement les signaux
RUN apk add --no-cache dumb-init curl

# Copier package.json et npm modules depuis le builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Définir les variables d'environnement
ENV NODE_ENV=production \
    PORT=3000

# ====================================================
# Healthcheck - Vérifier que le serveur est accessible
# ====================================================
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT} || exit 1

# ====================================================
# Exposer le port
# ====================================================
EXPOSE ${PORT}

# Utiliser dumb-init pour démarrer Next.js
ENTRYPOINT ["dumb-init", "--"]

# ====================================================
# Démarrer l'application Next.js
# ====================================================
CMD ["npm", "start"]
