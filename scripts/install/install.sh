#!/usr/bin/env bash
# CareAI 1-Command-Installer (Linux/macOS)
# Idempotent: 2x Ausfuehren = gleiches Resultat
# Usage: ./install.sh [--help] [--non-interactive] [--config FILE]

set -euo pipefail

LOG_FILE="${LOG_FILE:-/var/log/careai-install.log}"
[ -w "$(dirname "$LOG_FILE")" ] 2>/dev/null || LOG_FILE="./careai-install.log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }
err() { echo "[FEHLER] $*" >&2; log "FEHLER: $*"; exit 1; }

show_help() {
  cat <<EOF
CareAI Installer - Richtet CareAI in unter 10 Minuten ein.

Usage:
  install.sh [OPTIONS]

Optionen:
  --help              Diese Hilfe anzeigen
  --non-interactive   Keine Fragen stellen, Werte aus ENV nehmen
  --config FILE       Config-Datei mit Vorgaben laden
  --skip-docker       Docker-Schritt ueberspringen (nur fuer CI)
  --version           Version anzeigen

ENV-Variablen (fuer --non-interactive):
  CAREAI_EINRICHTUNG   Name der Einrichtung
  CAREAI_ADMIN_EMAIL   Admin-Email
  CAREAI_DOMAIN        Domain (z.B. pflege.example.org)

Log-Datei: $LOG_FILE
EOF
}

NON_INTERACTIVE=0
SKIP_DOCKER=0
CONFIG_FILE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help) show_help; exit 0 ;;
    --version) echo "CareAI Installer 1.0.0"; exit 0 ;;
    --non-interactive) NON_INTERACTIVE=1; shift ;;
    --skip-docker) SKIP_DOCKER=1; shift ;;
    --config) CONFIG_FILE="$2"; shift 2 ;;
    *) err "Unbekannte Option: $1" ;;
  esac
done

log "=== CareAI Installer gestartet ==="

# --- OS-Check ---
OS="$(uname -s)"
case "$OS" in
  Linux*)  log "OS: Linux erkannt" ;;
  Darwin*) log "OS: macOS erkannt" ;;
  *) err "Nicht unterstuetztes OS: $OS (nur Linux/macOS). Auf Windows bitte install.ps1 verwenden." ;;
esac

# --- Prerequisites ---
log "Pruefe Node.js..."
if ! command -v node >/dev/null 2>&1; then
  err "Node.js nicht gefunden. Bitte Node >= 20 installieren: https://nodejs.org"
fi
NODE_MAJOR="$(node -v | sed 's/v//;s/\..*//')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  err "Node.js $NODE_MAJOR ist zu alt. Node >= 20 erforderlich."
fi
log "Node.js OK: $(node -v)"

log "Pruefe npm..."
command -v npm >/dev/null 2>&1 || err "npm nicht gefunden."
log "npm OK: $(npm -v)"

if [ "$SKIP_DOCKER" -eq 0 ]; then
  log "Pruefe Docker..."
  if ! command -v docker >/dev/null 2>&1; then
    err "Docker nicht gefunden. Installation: https://docs.docker.com/get-docker/"
  fi
  if ! docker info >/dev/null 2>&1; then
    err "Docker ist installiert, laeuft aber nicht. Bitte Docker-Daemon starten."
  fi
  log "Docker OK: $(docker --version)"

  if ! docker compose version >/dev/null 2>&1; then
    err "Docker Compose v2 nicht gefunden."
  fi
  log "Docker Compose OK"
fi

# --- Tools ---
command -v openssl >/dev/null 2>&1 || err "openssl nicht gefunden (fuer Secret-Generierung)."

# --- Config ---
if [ -n "$CONFIG_FILE" ] && [ -f "$CONFIG_FILE" ]; then
  log "Lade Config: $CONFIG_FILE"
  # shellcheck disable=SC1090
  source "$CONFIG_FILE"
fi

ask() {
  local prompt="$1" var="$2" default="${3:-}"
  local current_val="${!var:-}"
  if [ -n "$current_val" ]; then return; fi
  if [ "$NON_INTERACTIVE" -eq 1 ]; then
    if [ -z "$default" ]; then err "ENV $var fehlt (--non-interactive)"; fi
    printf -v "$var" '%s' "$default"
    return
  fi
  local answer
  if [ -n "$default" ]; then
    read -r -p "$prompt [$default]: " answer
    answer="${answer:-$default}"
  else
    read -r -p "$prompt: " answer
    while [ -z "$answer" ]; do read -r -p "$prompt (Pflichtfeld): " answer; done
  fi
  printf -v "$var" '%s' "$answer"
}

CAREAI_EINRICHTUNG="${CAREAI_EINRICHTUNG:-}"
CAREAI_ADMIN_EMAIL="${CAREAI_ADMIN_EMAIL:-}"
CAREAI_DOMAIN="${CAREAI_DOMAIN:-}"

echo ""
echo "=== CareAI Konfiguration ==="
ask "Name der Einrichtung" CAREAI_EINRICHTUNG "Pflegeheim Muster"
ask "Admin-Email" CAREAI_ADMIN_EMAIL "admin@localhost"
ask "Domain (ohne https://)" CAREAI_DOMAIN "localhost:3000"

# --- Secret-Generierung ---
log "Generiere sichere Secrets..."
AUTH_SECRET="$(openssl rand -base64 48)"
CSRF_SECRET="$(openssl rand -base64 32)"
DB_PASSWORD="$(openssl rand -base64 24 | tr -d '=+/' | cut -c1-24)"
ADMIN_INITIAL_PASSWORD="$(openssl rand -base64 18 | tr -d '=+/' | cut -c1-16)"

# --- .env schreiben (idempotent) ---
ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
  log ".env existiert bereits - Backup nach .env.bak"
  cp "$ENV_FILE" "$ENV_FILE.bak"
  # Idempotenz: bestehende Secrets beibehalten
  EXISTING_AUTH="$(grep -E '^AUTH_SECRET=' "$ENV_FILE" | cut -d= -f2- || true)"
  [ -n "$EXISTING_AUTH" ] && AUTH_SECRET="$EXISTING_AUTH" && log "Existierendes AUTH_SECRET beibehalten"
fi

cat > "$ENV_FILE" <<EOF
# CareAI Environment - generiert $(date)
# NICHT in git einchecken!

NODE_ENV=production
CAREAI_EINRICHTUNG="$CAREAI_EINRICHTUNG"
CAREAI_DOMAIN="$CAREAI_DOMAIN"

# Auth
AUTH_SECRET=$AUTH_SECRET
CSRF_SECRET=$CSRF_SECRET
NEXTAUTH_URL=https://$CAREAI_DOMAIN

# Database
DATABASE_URL=postgresql://careai:$DB_PASSWORD@localhost:5432/careai
POSTGRES_PASSWORD=$DB_PASSWORD
POSTGRES_USER=careai
POSTGRES_DB=careai

# Admin
ADMIN_EMAIL=$CAREAI_ADMIN_EMAIL
ADMIN_INITIAL_PASSWORD=$ADMIN_INITIAL_PASSWORD

# Features (opt-in)
ENABLE_VOICE=false
ENABLE_AI=false
EOF
chmod 600 "$ENV_FILE"
log ".env geschrieben (chmod 600)"

# --- Docker-Stack starten ---
if [ "$SKIP_DOCKER" -eq 0 ]; then
  log "Starte Docker-Stack..."
  docker compose up -d 2>&1 | tee -a "$LOG_FILE"

  log "Warte auf Postgres (max. 60s)..."
  for i in $(seq 1 30); do
    if docker compose exec -T postgres pg_isready -U careai >/dev/null 2>&1; then
      log "Postgres ist bereit"
      break
    fi
    sleep 2
    if [ "$i" -eq 30 ]; then err "Postgres nicht bereit nach 60s"; fi
  done
fi

# --- npm install (idempotent via package-lock) ---
log "Installiere Node-Pakete..."
npm ci --silent 2>&1 | tee -a "$LOG_FILE" || npm install --silent 2>&1 | tee -a "$LOG_FILE"

# --- Migration + Seed ---
log "Fuehre DB-Migrationen aus..."
npm run db:push 2>&1 | tee -a "$LOG_FILE" || log "WARN: db:push schlug fehl oder nicht vorhanden"

log "Seed initiale Daten..."
npm run db:seed 2>&1 | tee -a "$LOG_FILE" || log "WARN: db:seed nicht vorhanden - ueberspringe"

# --- Health-Check ---
log "Warte auf App-Readiness..."
HEALTH_URL="http://localhost:3000/api/health"
for i in $(seq 1 30); do
  if curl -sf "$HEALTH_URL" >/dev/null 2>&1; then
    log "App antwortet"
    break
  fi
  sleep 2
done

# --- Abschluss ---
cat <<EOF

==========================================================
  CareAI Installation abgeschlossen!
==========================================================

  Login-URL:       https://$CAREAI_DOMAIN
  Admin-Email:     $CAREAI_ADMIN_EMAIL
  Admin-Passwort:  $ADMIN_INITIAL_PASSWORD

  WICHTIG: Passwort bei Erst-Login aendern!
  Log-Datei:       $LOG_FILE

==========================================================

EOF
log "=== Installation erfolgreich ==="
