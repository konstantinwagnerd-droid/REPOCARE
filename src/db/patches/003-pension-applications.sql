-- 003-pension-applications.sql
-- Erstellt Tabelle pension_applications fuer DE (SGB XI) und AT (BPGG) Pflegegeld-Antraege.
-- Ausfuehren: im SQL-Client gegen die CareAI-DB. Nicht Teil von drizzle-kit.
-- Idempotent: DROP IF EXISTS + CREATE.

-- Rollback-freundliches DROP (wie vom Schema-Owner angefragt)
DROP TABLE IF EXISTS pension_applications CASCADE;
DROP TYPE IF EXISTS pension_application_status CASCADE;
DROP TYPE IF EXISTS pension_application_type CASCADE;

-- Enums
CREATE TYPE pension_application_type AS ENUM ('de-sgb-xi', 'at-bpgg');
CREATE TYPE pension_application_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');

-- Tabelle
CREATE TABLE pension_applications (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id      UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  application_type pension_application_type NOT NULL,
  status           pension_application_status NOT NULL DEFAULT 'draft',
  form_data_json   JSONB NOT NULL DEFAULT '{}'::jsonb,
  assigned_grade   INTEGER,
  notes            TEXT,
  pdf_hash         TEXT,
  created_by       UUID REFERENCES users(id),
  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  submitted_at     TIMESTAMP WITH TIME ZONE,
  status_updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexe fuer typische Abfragen
CREATE INDEX idx_pension_apps_resident ON pension_applications(resident_id);
CREATE INDEX idx_pension_apps_tenant ON pension_applications(tenant_id);
CREATE INDEX idx_pension_apps_status ON pension_applications(status);
CREATE INDEX idx_pension_apps_created ON pension_applications(created_at DESC);
