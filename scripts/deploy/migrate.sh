#!/usr/bin/env bash
# Production-DB-Migration für CareAI.
# Strategie: expand → deploy → contract (Zero-Downtime).
# Nutzt drizzle-kit migrate gegen DATABASE_URL aus Umgebungsvariablen.
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL required}"

echo "[migrate] Creating snapshot tag..."
TAG="pre-migrate-$(date -u +%Y%m%dT%H%M%SZ)"
echo "$TAG" > /tmp/careai-last-migrate-tag

# Pre-flight — connect check
node -e "
  const { Client } = require('pg');
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  c.connect().then(() => { console.log('[migrate] DB reachable'); c.end(); })
    .catch(e => { console.error(e); process.exit(1); });
"

echo "[migrate] Running drizzle migrate..."
npx drizzle-kit migrate

echo "[migrate] Verify schema version..."
node -e "
  const { Client } = require('pg');
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  c.connect().then(async () => {
    const r = await c.query(\"SELECT hash, created_at FROM drizzle.__drizzle_migrations ORDER BY id DESC LIMIT 1\");
    console.log('[migrate] Latest:', r.rows[0]);
    await c.end();
  });
"

echo "[migrate] OK — tag=$TAG"
