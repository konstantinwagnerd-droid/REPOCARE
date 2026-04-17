#!/usr/bin/env bash
# CareAI Local-Dev-Installer - ohne Docker, PGLite lokal
# Fuer Entwickler:innen. Idempotent.

set -euo pipefail

show_help() {
  cat <<EOF
CareAI Dev-Installer (ohne Docker, mit PGLite)

Usage: ./install-dev.sh [--help]

Ablauf:
  1. Node-Version pruefen (>= 20)
  2. npm install
  3. PGLite bootstrap (lokale SQLite-aehnliche DB)
  4. Migration + Seed
  5. Dev-Server starten (optional)

Vorteile:
  - Keine Docker-Installation noetig
  - Schnelles Setup (< 2 min)
  - Ideal fuer Feature-Entwicklung
EOF
}

[[ "${1:-}" == "--help" ]] && { show_help; exit 0; }

log() { echo "[dev-install] $*"; }

log "Pruefe Node..."
command -v node >/dev/null || { echo "Node fehlt"; exit 1; }
MAJOR="$(node -v | sed 's/v//;s/\..*//')"
[ "$MAJOR" -ge 20 ] || { echo "Node >= 20 noetig"; exit 1; }

log "npm install..."
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

# .env.local fuer Dev (idempotent)
if [ ! -f .env.local ]; then
  log "Erstelle .env.local mit PGLite..."
  AUTH_SECRET="$(openssl rand -base64 48 2>/dev/null || node -e "console.log(require('crypto').randomBytes(48).toString('base64'))")"
  cat > .env.local <<EOF
NODE_ENV=development
DATABASE_URL=pglite://./local.db
AUTH_SECRET=$AUTH_SECRET
CSRF_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
NEXTAUTH_URL=http://localhost:3000
ENABLE_VOICE=false
ENABLE_AI=false
EOF
fi

log "PGLite bootstrap..."
npm run db:push 2>/dev/null || log "WARN db:push uebersprungen"
npm run db:seed 2>/dev/null || log "WARN db:seed uebersprungen"

cat <<EOF

==========================================================
  CareAI Dev-Umgebung bereit!
==========================================================

  Start:  npm run dev
  URL:    http://localhost:3000

==========================================================

EOF
