#!/usr/bin/env bash
# CareAI Load-Test-Runner (k6)
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
SCENARIO="${SCENARIO:-all}"
OUT_PROM=""

show_help() {
  cat <<EOF
CareAI Load-Test Runner (k6)

Usage: run-load.sh [OPTIONS]

Optionen:
  --base-url URL      Ziel-URL
  --scenario NAME     baseline | normal | peak | api | voice | all (default)
  --prometheus URL    Metriken an Prometheus-Remote-Write senden
  --help              Hilfe

Beispiele:
  run-load.sh --scenario normal
  run-load.sh --scenario all --base-url https://stage.careai.health
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help) show_help; exit 0 ;;
    --base-url) BASE_URL="$2"; shift 2 ;;
    --scenario) SCENARIO="$2"; shift 2 ;;
    --prometheus) OUT_PROM="--out experimental-prometheus-rw=$2"; shift 2 ;;
    *) echo "Unbekannt: $1"; exit 2 ;;
  esac
done

if ! command -v k6 >/dev/null 2>&1; then
  echo "[load] k6 nicht gefunden."
  echo "Installation:"
  echo "  macOS:    brew install k6"
  echo "  Linux:    sudo apt install k6 (nach Grafana-Repo-Add)"
  echo "  Windows:  winget install k6 --source winget"
  echo "  oder:     https://k6.io/docs/getting-started/installation/"
  exit 2
fi

mkdir -p load-report
export BASE_URL

run() {
  local name="$1"
  local script="$2"
  echo ""
  echo "=== Load: $name ==="
  k6 run $OUT_PROM \
    --summary-export="load-report/${name}-summary.json" \
    "$script" || return $?
}

RC=0
case "$SCENARIO" in
  baseline) run baseline scripts/load/load-baseline.js || RC=$? ;;
  normal)   run normal   scripts/load/load-normal.js   || RC=$? ;;
  peak)     run peak     scripts/load/load-peak.js     || RC=$? ;;
  api)      run api      scripts/load/load-api-stress.js || RC=$? ;;
  voice)    run voice    scripts/load/load-voice.js    || RC=$? ;;
  all)
    run baseline scripts/load/load-baseline.js || RC=$?
    run normal   scripts/load/load-normal.js   || RC=$?
    run peak     scripts/load/load-peak.js     || RC=$?
    run api      scripts/load/load-api-stress.js || RC=$?
    ;;
  *) echo "Unbekanntes Szenario: $SCENARIO"; exit 2 ;;
esac

echo ""
echo "[load] Exit: $RC"
echo "[load] Reports: load-report/"
exit $RC
