import { PGlite } from "@electric-sql/pglite";
import path from "node:path";

const DDL = `
-- Enums (idempotent)
DO $$ BEGIN CREATE TYPE role AS ENUM ('admin','pdl','pflegekraft','angehoeriger'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE plan AS ENUM ('starter','professional','enterprise'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE shift AS ENUM ('frueh','spaet','nacht'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE care_plan_status AS ENUM ('offen','laufend','erledigt','pausiert'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE mar_status AS ENUM ('geplant','verabreicht','verweigert','ausgefallen'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE incident_severity AS ENUM ('niedrig','mittel','hoch','kritisch'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE wound_stage AS ENUM ('grad_1','grad_2','grad_3','grad_4','verheilt'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  plan plan NOT NULL DEFAULT 'professional',
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role role NOT NULL DEFAULT 'pflegekraft',
  full_name text NOT NULL,
  email_verified timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS residents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  birthdate timestamp NOT NULL,
  pflegegrad integer NOT NULL,
  room text NOT NULL,
  station text NOT NULL DEFAULT 'Station A',
  admission_date timestamp NOT NULL,
  diagnoses_json jsonb DEFAULT '[]'::jsonb,
  allergies_json jsonb DEFAULT '[]'::jsonb,
  emergency_contact_json jsonb,
  primary_family_user_id uuid,
  wellbeing_score integer DEFAULT 7,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sis_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  themenfeld_1 jsonb,
  themenfeld_2 jsonb,
  themenfeld_3 jsonb,
  themenfeld_4 jsonb,
  themenfeld_5 jsonb,
  themenfeld_6 jsonb,
  risiko_matrix jsonb,
  created_by uuid REFERENCES users(id),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS care_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  frequency text NOT NULL,
  responsible_role role NOT NULL DEFAULT 'pflegekraft',
  status care_plan_status NOT NULL DEFAULT 'offen',
  due_date timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS care_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES users(id),
  shift shift NOT NULL,
  content text NOT NULL,
  ai_structured_json jsonb,
  sis_tags_json jsonb DEFAULT '[]'::jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vital_signs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  type text NOT NULL,
  value_numeric real,
  value_text text,
  recorded_at timestamp NOT NULL,
  recorded_by uuid REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text NOT NULL,
  frequency_json jsonb,
  start_date timestamp NOT NULL,
  end_date timestamp,
  prescribed_by text
);

CREATE TABLE IF NOT EXISTS medication_administrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  scheduled_at timestamp NOT NULL,
  administered_at timestamp,
  administered_by uuid REFERENCES users(id),
  status mar_status NOT NULL DEFAULT 'geplant',
  notes text
);

CREATE TABLE IF NOT EXISTS wounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  location text NOT NULL,
  type text NOT NULL,
  stage wound_stage NOT NULL,
  opened_at timestamp NOT NULL,
  closed_at timestamp
);

CREATE TABLE IF NOT EXISTS wound_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wound_id uuid NOT NULL REFERENCES wounds(id) ON DELETE CASCADE,
  observation text NOT NULL,
  photo_url text,
  recorded_at timestamp NOT NULL DEFAULT now(),
  recorded_by uuid REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  type text NOT NULL,
  severity incident_severity NOT NULL,
  description text NOT NULL,
  occurred_at timestamp NOT NULL,
  reported_by uuid REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS risk_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  type text NOT NULL,
  score real NOT NULL,
  computed_at timestamp NOT NULL DEFAULT now(),
  model_version text DEFAULT 'v1.0'
);

CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  action text NOT NULL,
  before_json jsonb,
  after_json jsonb,
  ip text,
  user_agent text,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id),
  starts_at timestamp NOT NULL,
  ends_at timestamp NOT NULL,
  station text NOT NULL
);

CREATE TABLE IF NOT EXISTS family_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  from_user_id uuid NOT NULL REFERENCES users(id),
  to_role role NOT NULL DEFAULT 'pflegekraft',
  subject text NOT NULL,
  body text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now()
);

-- Versioning + Signatur Erweiterungen (idempotent)
ALTER TABLE care_reports ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
ALTER TABLE care_reports ADD COLUMN IF NOT EXISTS previous_version_hash text;
ALTER TABLE care_reports ADD COLUMN IF NOT EXISTS signature_hash text;
ALTER TABLE care_reports ADD COLUMN IF NOT EXISTS signed_at timestamp;
ALTER TABLE care_reports ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT true;

ALTER TABLE sis_assessments ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
ALTER TABLE sis_assessments ADD COLUMN IF NOT EXISTS previous_version_hash text;
ALTER TABLE sis_assessments ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT true;

ALTER TABLE residents ADD COLUMN IF NOT EXISTS deleted_at timestamp;
ALTER TABLE residents ADD COLUMN IF NOT EXISTS deletion_reason text;

-- DSGVO
DO $$ BEGIN CREATE TYPE dsgvo_request_status AS ENUM ('offen','in_pruefung','abgelehnt_aufbewahrungspflicht','erledigt'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE dsgvo_request_type AS ENUM ('auskunft','loeschung','einschraenkung','uebertragung'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS dsgvo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  type dsgvo_request_type NOT NULL,
  status dsgvo_request_status NOT NULL DEFAULT 'offen',
  requested_by text NOT NULL,
  reason text,
  decision_note text,
  created_at timestamp NOT NULL DEFAULT now(),
  resolved_at timestamp
);

CREATE TABLE IF NOT EXISTS export_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  kind text NOT NULL,
  resident_id uuid,
  hash text NOT NULL,
  filename text NOT NULL,
  recipient text,
  created_at timestamp NOT NULL DEFAULT now()
);
`;

async function main() {
  const dbPath = process.env.PGLITE_PATH || path.resolve(process.cwd(), "local.db");
  console.info(`Bootstrapping PGlite schema at ${dbPath}`);
  const pg = new PGlite(dbPath);
  await pg.exec(DDL);
  await pg.close();
  console.info("Schema ready.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
