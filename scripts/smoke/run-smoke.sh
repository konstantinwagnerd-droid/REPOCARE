#!/usr/bin/env bash
# CareAI Smoke-Test Runner
# Idempotent. Usage: ./run-smoke.sh --base-url https://prod.careai.health

set -euo pipefail

BASE_URL="${SMOKE_BASE_URL:-http://localhost:3000}"
HEADLESS=1

show_help() {
  cat <<EOF
CareAI Smoke-Test Runner

Usage: run-smoke.sh [OPTIONS]

Optionen:
  --base-url URL      Ziel-URL (default: http://localhost:3000)
  --user EMAIL        Test-Account Email
  --password PW       Test-Account Passwort
  --headed            Browser sichtbar (Debug)
  --help              Hilfe

Beispiele:
  run-smoke.sh --base-url https://prod.careai.health
  SMOKE_USER=a@b.de SMOKE_PW=x run-smoke.sh

Exit-Code: 0 = alles gruen, 1 = Fails, 2 = Setup-Fehler
Report: smoke-report/index.html
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help) show_help; exit 0 ;;
    --base-url) BASE_URL="$2"; shift 2 ;;
    --user) export SMOKE_USER="$2"; shift 2 ;;
    --password) export SMOKE_PW="$2"; shift 2 ;;
    --headed) HEADLESS=0; shift ;;
    *) echo "Unbekannte Option: $1"; exit 2 ;;
  esac
done

export SMOKE_BASE_URL="$BASE_URL"

echo "[smoke] Base-URL: $BASE_URL"

# Playwright Browser installieren wenn noetig
if ! npx playwright --version >/dev/null 2>&1; then
  echo "[smoke] Playwright nicht installiert - npm install..."
  npm install --no-save @playwright/test
fi

if [ ! -d "$HOME/.cache/ms-playwright" ] && [ ! -d "$HOME/Library/Caches/ms-playwright" ] && [ ! -d "$LOCALAPPDATA/ms-playwright" ]; then
  echo "[smoke] Installiere Playwright-Browser (chromium only)..."
  npx playwright install chromium
fi

# Pre-Check: URL erreichbar?
if ! curl -sf -o /dev/null "$BASE_URL" 2>/dev/null; then
  echo "[smoke] WARN: $BASE_URL antwortet nicht auf Root - Tests laufen trotzdem"
fi

# Run
mkdir -p smoke-report
set +e
npx playwright test tests/smoke \
  --reporter=html \
  --output=smoke-report/artifacts \
  ${HEADLESS:+--headed=false}
RC=$?
set -e

# Reporter schreibt nach playwright-report/ by default - verschieben
if [ -d playwright-report ]; then
  rm -rf smoke-report/html
  mv playwright-report smoke-report/html
fi

if [ $RC -eq 0 ]; then
  echo "[smoke] ALLE TESTS GRUEN"
else
  echo "[smoke] FAILS erkannt (exit=$RC). Report: smoke-report/html/index.html"
fi
exit $RC
