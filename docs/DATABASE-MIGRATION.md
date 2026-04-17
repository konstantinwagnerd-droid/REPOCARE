# CareAI — Datenbank-Migrationen

Drizzle-ORM + drizzle-kit. Schema-Quelle: `src/db/schema.ts`. Migrationen liegen in `drizzle/`.

## Dev-Workflow

```bash
# Schema editieren → neue Migration generieren
npm run db:generate

# Gegen lokales Postgres (docker-compose.dev.yml) anwenden
DATABASE_URL=postgres://careai:careai@localhost:5432/careai npx drizzle-kit migrate
```

PGlite-Dev-DB nutzt `src/db/bootstrap.ts` (kein drizzle-kit, direkt via `drizzle/patches`).

## Production-Workflow

### Zero-Downtime-Strategie: Expand → Deploy → Contract

Jede schema-brechende Änderung wird in **drei Deployments** aufgeteilt:

1. **Expand:** Neue Spalte/Tabelle additiv anlegen, nullable. App-Code liest noch die alte Form.
2. **Deploy:** Neue App-Version, die sowohl alte als auch neue Form lesen kann, neue Form schreibt.
3. **Contract:** Backfill → alte Spalte als deprecated markieren → in späterer Migration droppen.

**Beispiel:** Spalte `residents.legal_name` → `residents.full_name` umbenennen:

```sql
-- Expand
ALTER TABLE residents ADD COLUMN full_name text;

-- (App deployed: schreibt beide, liest full_name || legal_name)

-- Backfill
UPDATE residents SET full_name = legal_name WHERE full_name IS NULL;

-- Contract
ALTER TABLE residents ALTER COLUMN full_name SET NOT NULL;
ALTER TABLE residents DROP COLUMN legal_name;
```

### Production-Migrate

```bash
./scripts/deploy/migrate.sh
```

Wird vom GitHub-Actions-Deploy automatisch vor `docker compose up` aufgerufen.

### Rollback

Drizzle unterstützt keine automatischen Down-Migrations. Strategie:

1. **Schema-Rollback**: Manueller SQL-Revert — vor jeder Migration Rollback-SQL in `drizzle/rollback/<migration>.sql` ablegen.
2. **Daten-Rollback**: Backup einspielen (siehe `docs/DEPLOYMENT.md` §4).

Wichtig: Migrationen sind **idempotent** zu schreiben (`IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`).

## Migration-Review-Checkliste

Vor jedem Merge einer Migration:

- [ ] Idempotent? (Zweites Anwenden schadet nicht)
- [ ] Zero-Downtime-kompatibel? (App v_n & v_n+1 beide lauffähig)
- [ ] Indexe für neue Tabellen vorhanden?
- [ ] FKs mit `ON DELETE CASCADE/SET NULL` explizit?
- [ ] `NOT NULL`-Spalten haben `DEFAULT` oder werden gebackfillt?
- [ ] Für große Tabellen: `CREATE INDEX CONCURRENTLY` (nicht blockierend)?
- [ ] Rollback-Plan dokumentiert?

## Migration-Naming

```
drizzle/
├── 0000_init.sql                — Initial schema
├── 0001_add_vital_signs.sql
├── 0002_expand_resident_name.sql    ← Expand-Phase
├── 0003_contract_legacy_name.sql    ← Contract-Phase
```

## Troubleshooting

**`error: relation "drizzle.__drizzle_migrations" does not exist`**
→ Erster Migrate-Run auf neuer DB. Normal.

**`error: column "X" already exists`**
→ Migration nicht idempotent. Refactor zu `ADD COLUMN IF NOT EXISTS`.

**Migration hängt minutenlang**
→ Lock-Konflikt. `SELECT * FROM pg_stat_activity WHERE state = 'active'` → lange laufende Queries killen.

**Rollback nach fehlerhafter Migration**
1. Deployment pausieren (`docker compose stop app`)
2. Backup aus `/srv/careai-backups/` restoren
3. Schema-Änderung im Code rückgängig machen + neue Migration
4. Re-deploy
