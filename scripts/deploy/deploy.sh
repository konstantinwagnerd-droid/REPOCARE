#!/usr/bin/env bash
# Pull latest image and rolling-restart the app service.
# Called by GitHub Actions over SSH.
set -euo pipefail

cd /srv/careai

echo "[deploy] Pulling latest image..."
docker compose pull app

echo "[deploy] Running migrations..."
docker compose run --rm app ./scripts/deploy/migrate.sh

echo "[deploy] Restarting app..."
docker compose up -d --no-deps --remove-orphans app

echo "[deploy] Waiting for health..."
for i in {1..30}; do
  if curl -sf http://127.0.0.1:3000/api/health >/dev/null 2>&1; then
    echo "[deploy] OK after ${i}s"
    exit 0
  fi
  sleep 1
done
echo "[deploy] Healthcheck failed"
docker compose logs --tail=100 app
exit 1
