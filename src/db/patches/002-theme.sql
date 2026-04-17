-- 002-theme.sql
-- Fuegt tenants.theme_json hinzu fuer Tenant-spezifisches Branding (Primary, Accent, Logo-URL).
-- Ausfuehren: im SQL-Client gegen die CareAI-DB. Nicht Teil von drizzle-kit.
-- Idempotent: Zweites Ausfuehren ist no-op.

ALTER TABLE IF EXISTS tenants
  ADD COLUMN IF NOT EXISTS theme_json JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Index fuer gezielte Abfrage einzelner Theme-Keys
CREATE INDEX IF NOT EXISTS idx_tenants_theme_json ON tenants USING GIN (theme_json);

-- Default-Werte fuer bestehende Zeilen setzen, falls leer
UPDATE tenants
SET theme_json = jsonb_build_object(
  'primary', '#0F766E',
  'accent', '#F97316',
  'logoUrl', NULL
)
WHERE theme_json = '{}'::jsonb OR theme_json IS NULL;
