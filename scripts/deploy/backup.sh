#!/usr/bin/env bash
# CareAI — verschlüsseltes tägliches Postgres-Backup → Hetzner Storage Box.
# Cron: 0 3 * * *  /srv/careai/scripts/deploy/backup.sh
#
# Required env (in /etc/careai/backup.env):
#   POSTGRES_CONTAINER   — z.B. "careai-postgres-1"
#   POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD
#   BACKUP_GPG_RECIPIENT — GPG Key ID für Verschlüsselung
#   SSH_USER, SSH_HOST   — z.B. u123456@u123456.your-storagebox.de
#   SSH_PORT             — typ. 23
#   SSH_KEY              — Pfad zum Private Key
#   ALERT_EMAIL          — Fehler-Benachrichtigung
set -euo pipefail

: "${POSTGRES_CONTAINER:?}" "${POSTGRES_DB:?}" "${POSTGRES_USER:?}" "${BACKUP_GPG_RECIPIENT:?}"
: "${SSH_USER:?}" "${SSH_HOST:?}" "${SSH_KEY:?}"

SSH_PORT="${SSH_PORT:-23}"
ALERT_EMAIL="${ALERT_EMAIL:-}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

err() {
  local msg="$1"
  echo "[$(date -Iseconds)] ERROR: $msg" >&2
  if [ -n "$ALERT_EMAIL" ] && command -v mail >/dev/null; then
    echo "$msg" | mail -s "[CareAI] Backup FAILED $STAMP" "$ALERT_EMAIL" || true
  fi
  exit 1
}

echo "[$(date -Iseconds)] Starting backup $STAMP"

FILE="$TMP/careai_${STAMP}.sql.gz.gpg"
docker exec -i "$POSTGRES_CONTAINER" pg_dump \
  --username="$POSTGRES_USER" \
  --dbname="$POSTGRES_DB" \
  --format=custom --no-owner --no-acl --compress=9 \
  | gzip -9 \
  | gpg --batch --yes --trust-model always \
        --recipient "$BACKUP_GPG_RECIPIENT" \
        --encrypt --output "$FILE" \
  || err "pg_dump pipeline failed"

SIZE=$(stat -c%s "$FILE")
[ "$SIZE" -lt 1024 ] && err "backup file suspiciously small ($SIZE bytes)"

# Upload
SSH_OPTS=(-i "$SSH_KEY" -p "$SSH_PORT" -o StrictHostKeyChecking=accept-new)
scp "${SSH_OPTS[@]}" "$FILE" "${SSH_USER}@${SSH_HOST}:daily/" \
  || err "scp upload failed"

# Retention: 7 daily / 4 weekly / 12 monthly
DAY_OF_WEEK=$(date -u +%u)
DAY_OF_MONTH=$(date -u +%d)
if [ "$DAY_OF_WEEK" = "7" ]; then
  ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SSH_HOST}" "cp daily/$(basename "$FILE") weekly/" || true
fi
if [ "$DAY_OF_MONTH" = "01" ]; then
  ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SSH_HOST}" "cp daily/$(basename "$FILE") monthly/" || true
fi

# Prune old (remote)
ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SSH_HOST}" bash -s <<'REMOTE'
set -e
ls -1t daily/careai_*.sql.gz.gpg 2>/dev/null  | tail -n +8   | xargs -r rm -f
ls -1t weekly/careai_*.sql.gz.gpg 2>/dev/null | tail -n +5   | xargs -r rm -f
ls -1t monthly/careai_*.sql.gz.gpg 2>/dev/null| tail -n +13  | xargs -r rm -f
REMOTE

echo "[$(date -Iseconds)] Backup OK — ${SIZE} bytes → ${SSH_HOST}:daily/"
