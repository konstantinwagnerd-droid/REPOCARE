/**
 * One-Shot Setup-Endpoint: Schema bootstrappen + Demo-Daten seeden.
 *
 * Aufruf: GET /api/setup?token=<SETUP_TOKEN>
 * Default-Token (ohne env): "careai-setup-2026"
 *
 * Ist idempotent: Tabellen werden via CREATE TABLE IF NOT EXISTS angelegt,
 * Seed truncated vorher und schreibt frische Demo-Daten.
 */
import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { runSeed } from "@/db/seed";

export const runtime = "nodejs";
export const maxDuration = 60;

const DDL = `
-- NUCLEAR OPTION: DROP + CREATE fresh. Supabase hat nur Demo-Daten.
-- Saubere Recreation verhindert Schema-Drift-Issues zwischen manueller DDL und drizzle-schema.
DROP TABLE IF EXISTS training_certificates CASCADE;
DROP TABLE IF EXISTS training_attempts CASCADE;
DROP TABLE IF EXISTS training_questions CASCADE;
DROP TABLE IF EXISTS training_modules CASCADE;
DROP TYPE IF EXISTS training_category CASCADE;
DROP TYPE IF EXISTS training_question_type CASCADE;
DROP TABLE IF EXISTS email_routing_rules CASCADE;
DROP TABLE IF EXISTS email_inbound CASCADE;
DROP TYPE IF EXISTS email_classification CASCADE;
DROP TYPE IF EXISTS email_rule_match_type CASCADE;
DROP TABLE IF EXISTS whatsapp_messages CASCADE;
DROP TABLE IF EXISTS whatsapp_contacts CASCADE;
DROP TABLE IF EXISTS case_conferences CASCADE;
DROP TABLE IF EXISTS amts_flags CASCADE;
DROP TABLE IF EXISTS billing_llm_usage CASCADE;
DROP TABLE IF EXISTS heimaufg_meldungen CASCADE;
DROP TABLE IF EXISTS biographies CASCADE;
DROP TABLE IF EXISTS care_visits CASCADE;
DROP TABLE IF EXISTS service_records CASCADE;
DROP TABLE IF EXISTS admission_checklists CASCADE;
DROP TABLE IF EXISTS wound_measurements CASCADE;
DROP TABLE IF EXISTS medication_interactions CASCADE;
DROP TABLE IF EXISTS shift_requirements CASCADE;
DROP TABLE IF EXISTS staff_qualifications CASCADE;
DROP TABLE IF EXISTS nic_interventions CASCADE;
DROP TABLE IF EXISTS nanda_diagnoses CASCADE;
DROP TABLE IF EXISTS dnqp_assessments CASCADE;
DROP TYPE IF EXISTS dnqp_standard CASCADE;
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS export_records CASCADE;
DROP TABLE IF EXISTS shifts CASCADE;
DROP TABLE IF EXISTS family_messages CASCADE;
DROP TABLE IF EXISTS risk_scores CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS wound_observations CASCADE;
DROP TABLE IF EXISTS wounds CASCADE;
DROP TABLE IF EXISTS medication_administrations CASCADE;
DROP TABLE IF EXISTS medications CASCADE;
DROP TABLE IF EXISTS vital_signs CASCADE;
DROP TABLE IF EXISTS care_reports CASCADE;
DROP TABLE IF EXISTS care_plans CASCADE;
DROP TABLE IF EXISTS sis_assessments CASCADE;
DROP TABLE IF EXISTS residents CASCADE;
DROP TABLE IF EXISTS user_tenants CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TYPE IF EXISTS role CASCADE;
DROP TYPE IF EXISTS plan CASCADE;
DROP TYPE IF EXISTS shift CASCADE;
DROP TYPE IF EXISTS care_plan_status CASCADE;
DROP TYPE IF EXISTS mar_status CASCADE;
DROP TYPE IF EXISTS incident_severity CASCADE;
DROP TYPE IF EXISTS wound_stage CASCADE;

CREATE TYPE role AS ENUM ('owner','admin','pdl','pflegekraft','angehoeriger');
CREATE TYPE plan AS ENUM ('starter','professional','enterprise');
CREATE TYPE shift AS ENUM ('frueh','spaet','nacht');
CREATE TYPE care_plan_status AS ENUM ('offen','laufend','erledigt','pausiert');
CREATE TYPE mar_status AS ENUM ('geplant','verabreicht','verweigert','ausgefallen');
CREATE TYPE incident_severity AS ENUM ('niedrig','mittel','hoch','kritisch');
CREATE TYPE wound_stage AS ENUM ('grad_1','grad_2','grad_3','grad_4','verheilt');

CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, address text,
  plan plan NOT NULL DEFAULT 'professional',
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE, password_hash text NOT NULL,
  role role NOT NULL DEFAULT 'pflegekraft',
  full_name text NOT NULL, email_verified timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

-- residents: Spalten exakt wie in src/db/schema.ts
CREATE TABLE residents (
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
  deleted_at timestamp,
  deletion_reason text,
  created_at timestamp NOT NULL DEFAULT now()
);

-- sis_assessments: themenfeld_1 (OHNE _json suffix), risiko_matrix, versioning
CREATE TABLE sis_assessments (
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
  version integer NOT NULL DEFAULT 1,
  previous_version_hash text,
  is_current boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE care_plans (
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

CREATE TABLE care_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES users(id),
  shift shift NOT NULL,
  content text NOT NULL,
  ai_structured_json jsonb,
  sis_tags_json jsonb DEFAULT '[]'::jsonb,
  version integer NOT NULL DEFAULT 1,
  previous_version_hash text,
  signature_hash text,
  signed_at timestamp,
  is_current boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE vital_signs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  type text NOT NULL,
  value_numeric real,
  value_text text,
  recorded_at timestamp NOT NULL,
  recorded_by uuid REFERENCES users(id)
);

CREATE TABLE medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text NOT NULL,
  frequency_json jsonb,
  start_date timestamp NOT NULL,
  end_date timestamp,
  prescribed_by text
);

CREATE TABLE medication_administrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  scheduled_at timestamp NOT NULL,
  administered_at timestamp,
  administered_by uuid REFERENCES users(id),
  status mar_status NOT NULL DEFAULT 'geplant',
  notes text
);

CREATE TABLE wounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  location text NOT NULL,
  type text NOT NULL,
  stage wound_stage NOT NULL,
  opened_at timestamp NOT NULL,
  closed_at timestamp
);

CREATE TABLE wound_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wound_id uuid NOT NULL REFERENCES wounds(id) ON DELETE CASCADE,
  observation text NOT NULL,
  photo_url text,
  recorded_at timestamp NOT NULL DEFAULT now(),
  recorded_by uuid REFERENCES users(id)
);

CREATE TABLE incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  type text NOT NULL,
  severity incident_severity NOT NULL,
  description text NOT NULL,
  occurred_at timestamp NOT NULL,
  reported_by uuid REFERENCES users(id)
);

CREATE TABLE risk_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  type text NOT NULL,
  score real NOT NULL,
  computed_at timestamp NOT NULL DEFAULT now(),
  model_version text
);

CREATE TABLE family_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  from_user_id uuid REFERENCES users(id),
  to_user_id uuid REFERENCES users(id),
  body text NOT NULL,
  read_at timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id),
  starts_at timestamp NOT NULL,
  ends_at timestamp NOT NULL,
  station text
);

CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  entity_type text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  before_json jsonb,
  after_json jsonb,
  ip text,
  user_agent text,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE export_records (
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

-- Multi-Einrichtung pro User: Junction-Table fuer User <-> Tenant N:M Beziehung.
-- Default-Einrichtung bleibt users.tenant_id; zusaetzliche Einrichtungen via user_tenants.
CREATE TABLE IF NOT EXISTS user_tenants (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role role NOT NULL DEFAULT 'pflegekraft',
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, tenant_id)
);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant ON user_tenants(tenant_id);

-- ============================================================================
-- DACH COMPETITIVE GAP-CLOSE Tabellen (2026-04-18)
-- ============================================================================

CREATE TYPE dnqp_standard AS ENUM (
  'sturzprophylaxe','dekubitusprophylaxe','schmerzmanagement_akut','schmerzmanagement_chronisch',
  'ernaehrungsmanagement','kontinenzfoerderung','entlassungsmanagement','wundversorgung_chronisch',
  'demenz','mundgesundheit','beziehungsgestaltung'
);

CREATE TABLE IF NOT EXISTS dnqp_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  standard dnqp_standard NOT NULL,
  sections_json jsonb,
  score_name text,
  score_value real,
  risk_level text,
  recommended_measures_json jsonb DEFAULT '[]'::jsonb,
  assessed_by uuid REFERENCES users(id),
  assessed_at timestamp NOT NULL DEFAULT now(),
  next_review_due timestamp
);
CREATE INDEX IF NOT EXISTS idx_dnqp_resident ON dnqp_assessments(resident_id);

CREATE TABLE IF NOT EXISTS nanda_diagnoses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  code text NOT NULL,
  label text NOT NULL,
  problem text NOT NULL,
  etiology text NOT NULL,
  symptoms_json jsonb DEFAULT '[]'::jsonb,
  priority integer NOT NULL DEFAULT 3,
  status text NOT NULL DEFAULT 'aktiv',
  resolved_at timestamp,
  created_by uuid REFERENCES users(id),
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_nanda_resident ON nanda_diagnoses(resident_id);

CREATE TABLE IF NOT EXISTS nic_interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnosis_id uuid NOT NULL REFERENCES nanda_diagnoses(id) ON DELETE CASCADE,
  nic_code text NOT NULL,
  nic_label text NOT NULL,
  activities_json jsonb DEFAULT '[]'::jsonb,
  frequency text,
  noc_code text,
  noc_label text,
  target_score integer,
  current_score integer,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS staff_qualifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  qualification text NOT NULL,
  valid_from timestamp,
  valid_until timestamp,
  certificate_url text
);

CREATE TABLE IF NOT EXISTS shift_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  station text NOT NULL,
  shift shift NOT NULL,
  min_fachkraefte integer NOT NULL DEFAULT 1,
  min_hilfskraefte integer NOT NULL DEFAULT 0,
  min_azubis integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS medication_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  med_a_id uuid NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  med_b_id uuid REFERENCES medications(id) ON DELETE CASCADE,
  severity text NOT NULL,
  mechanism text,
  recommendation text NOT NULL,
  kind text NOT NULL DEFAULT 'interaktion',
  detected_at timestamp NOT NULL DEFAULT now(),
  acknowledged_by uuid REFERENCES users(id),
  acknowledged_at timestamp
);

CREATE TABLE IF NOT EXISTS wound_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wound_id uuid NOT NULL REFERENCES wounds(id) ON DELETE CASCADE,
  length_mm real NOT NULL,
  width_mm real NOT NULL,
  depth_mm real,
  area_mm2 real,
  exudate text,
  wound_bed text,
  edges text,
  surrounding text,
  odor boolean DEFAULT false,
  pain_score integer,
  photo_url text,
  measured_at timestamp NOT NULL DEFAULT now(),
  measured_by uuid REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS admission_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  tasks_json jsonb DEFAULT '[]'::jsonb,
  started_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp
);

CREATE TABLE IF NOT EXISTS service_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  service_code text NOT NULL,
  service_label text NOT NULL,
  quantity real NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'Einsatz',
  performed_at timestamp NOT NULL,
  performed_by uuid NOT NULL REFERENCES users(id),
  signature_hash text,
  billing_status text NOT NULL DEFAULT 'offen',
  jurisdiction text NOT NULL DEFAULT 'DE'
);
CREATE INDEX IF NOT EXISTS idx_svc_resident_date ON service_records(resident_id, performed_at);

CREATE TABLE IF NOT EXISTS care_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  visited_by uuid NOT NULL REFERENCES users(id),
  visit_date timestamp NOT NULL DEFAULT now(),
  structure_findings text,
  process_findings text,
  outcome_findings text,
  resident_feedback text,
  actions_agreed_json jsonb DEFAULT '[]'::jsonb,
  overall_rating integer,
  next_visit_due timestamp
);

CREATE TABLE IF NOT EXISTS biographies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL UNIQUE REFERENCES residents(id) ON DELETE CASCADE,
  chapters_json jsonb,
  daily_rituals_json jsonb DEFAULT '[]'::jsonb,
  preferences_json jsonb,
  memory_anchors_json jsonb DEFAULT '[]'::jsonb,
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS heimaufg_meldungen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  kind text NOT NULL,
  reason text NOT NULL,
  gelinderes_mittel_geprueft text NOT NULL,
  anordnung_durch text NOT NULL,
  start_at timestamp NOT NULL,
  end_at timestamp,
  bewohnervertretung_notified boolean DEFAULT false,
  notified_at timestamp,
  created_by uuid REFERENCES users(id),
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS billing_llm_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  request_type text NOT NULL,
  model text NOT NULL,
  prompt_tokens integer NOT NULL,
  completion_tokens integer NOT NULL,
  cost_eur_cents integer NOT NULL,
  duration_ms integer NOT NULL,
  status text NOT NULL,
  error_message text,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_billing_llm_tenant_month ON billing_llm_usage(tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_billing_llm_request_type ON billing_llm_usage(request_type);

CREATE TABLE IF NOT EXISTS amts_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  medication_id uuid REFERENCES medications(id),
  flag_type text NOT NULL,
  severity text NOT NULL,
  details_json jsonb NOT NULL,
  acknowledged_by uuid REFERENCES users(id),
  acknowledged_at timestamp,
  acknowledgement_reason text,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_amts_resident ON amts_flags(resident_id);
CREATE INDEX IF NOT EXISTS idx_amts_severity ON amts_flags(severity);

-- WhatsApp (Evolution API) 2026-04-18
CREATE TABLE IF NOT EXISTS whatsapp_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  resident_id uuid REFERENCES residents(id) ON DELETE CASCADE,
  family_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  phone text NOT NULL,
  verified boolean DEFAULT false,
  consent_given_at timestamp,
  consent_scope text DEFAULT 'critical',
  quiet_hours_start text DEFAULT '22:00',
  quiet_hours_end text DEFAULT '07:00',
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_wa_contacts_tenant ON whatsapp_contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wa_contacts_resident ON whatsapp_contacts(resident_id);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES whatsapp_contacts(id) ON DELETE CASCADE,
  direction text NOT NULL,
  event_type text,
  body text NOT NULL,
  sent_at timestamp,
  delivered_at timestamp,
  read_at timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_wa_msg_contact ON whatsapp_messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_wa_msg_tenant_date ON whatsapp_messages(tenant_id, created_at);

CREATE TABLE IF NOT EXISTS case_conferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  date timestamp NOT NULL,
  duration_minutes integer,
  participants_json jsonb DEFAULT '[]'::jsonb,
  resident_ids_json jsonb DEFAULT '[]'::jsonb,
  agenda_items_json jsonb DEFAULT '[]'::jsonb,
  notes text,
  action_items_json jsonb DEFAULT '[]'::jsonb,
  summary text,
  pdf_hash text,
  created_by uuid REFERENCES users(id),
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_conf_tenant_date ON case_conferences(tenant_id, date);

-- ============================================================================
-- PDL ADMIN FEATURES (2026-04-18)
-- Feature 1: Kosten-Controlling | Feature 2: Zertifizierungen | Feature 3: Saved Reports
-- ============================================================================

DROP TABLE IF EXISTS saved_reports CASCADE;
DROP TABLE IF EXISTS certification_requirements CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS fixed_costs CASCADE;
DROP TABLE IF EXISTS pflegegrad_revenue CASCADE;
DROP TABLE IF EXISTS staff_hourly_rates CASCADE;

CREATE TABLE staff_hourly_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role text NOT NULL,
  qualification text,
  hourly_rate_cents integer NOT NULL,
  valid_from date NOT NULL,
  valid_until date,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX idx_staff_hourly_rates_tenant ON staff_hourly_rates(tenant_id);

CREATE TABLE pflegegrad_revenue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  pflegegrad integer NOT NULL,
  monthly_revenue_cents integer NOT NULL,
  valid_from date NOT NULL,
  valid_until date,
  country text NOT NULL DEFAULT 'DE',
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX idx_pflegegrad_revenue_tenant ON pflegegrad_revenue(tenant_id);

CREATE TABLE fixed_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category text NOT NULL,
  label text NOT NULL,
  monthly_cost_cents integer NOT NULL,
  valid_from date NOT NULL,
  valid_until date,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX idx_fixed_costs_tenant ON fixed_costs(tenant_id);

CREATE TABLE certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  certification_type text NOT NULL,
  status text NOT NULL,
  awarded_date date,
  expires_date date,
  auditor text,
  certificate_number text,
  scope text,
  documents_json jsonb DEFAULT '[]'::jsonb,
  next_audit_date date,
  notes text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX idx_certifications_tenant ON certifications(tenant_id);
CREATE INDEX idx_certifications_expires ON certifications(expires_date);

CREATE TABLE certification_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id uuid NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text,
  status text NOT NULL DEFAULT 'offen',
  due_date date,
  responsible_user_id uuid REFERENCES users(id),
  evidence_json jsonb DEFAULT '[]'::jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX idx_cert_requirements_cert ON certification_requirements(certification_id);

CREATE TABLE saved_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  entity text NOT NULL,
  filters_json jsonb NOT NULL,
  columns_json jsonb NOT NULL,
  sort_json jsonb,
  limit_rows integer DEFAULT 100,
  created_by uuid REFERENCES users(id),
  created_at timestamp NOT NULL DEFAULT now(),
  last_run_at timestamp
);
CREATE INDEX idx_saved_reports_tenant ON saved_reports(tenant_id);

CREATE TYPE training_category AS ENUM ('dnqp','hygiene','btm','brandschutz','dsgvo','custom');
CREATE TYPE training_question_type AS ENUM ('single','multi','truefalse');

CREATE TABLE training_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  category training_category NOT NULL DEFAULT 'custom',
  description text,
  content_json jsonb DEFAULT '{}'::jsonb,
  passing_score integer NOT NULL DEFAULT 80,
  duration_minutes integer NOT NULL DEFAULT 15,
  is_mandatory boolean NOT NULL DEFAULT true,
  validity_months integer NOT NULL DEFAULT 12,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX idx_training_modules_tenant ON training_modules(tenant_id);

CREATE TABLE training_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  question text NOT NULL,
  type training_question_type NOT NULL DEFAULT 'single',
  options_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_indices_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  explanation text,
  order_index integer NOT NULL DEFAULT 0
);
CREATE INDEX idx_training_questions_module ON training_questions(module_id);

CREATE TABLE training_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  started_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp,
  score integer,
  passed boolean,
  answers_json jsonb DEFAULT '{}'::jsonb
);
CREATE INDEX idx_training_attempts_user ON training_attempts(user_id);
CREATE INDEX idx_training_attempts_module ON training_attempts(module_id);

CREATE TABLE training_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  attempt_id uuid NOT NULL REFERENCES training_attempts(id) ON DELETE CASCADE,
  issued_at timestamp NOT NULL DEFAULT now(),
  expires_at timestamp,
  certificate_hash text NOT NULL
);
CREATE INDEX idx_training_certs_user ON training_certificates(user_id);

CREATE TYPE email_classification AS ENUM ('lead','application','complaint','support','other');
CREATE TYPE email_rule_match_type AS ENUM ('subject_contains','body_contains','from_domain');

CREATE TABLE email_inbound (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  from_email text NOT NULL,
  from_name text,
  subject text NOT NULL DEFAULT '',
  body_text text,
  body_html text,
  received_at timestamp NOT NULL DEFAULT now(),
  classification email_classification NOT NULL DEFAULT 'other',
  confidence real NOT NULL DEFAULT 0,
  routed_to text,
  notified_at timestamp,
  metadata_json jsonb DEFAULT '{}'::jsonb
);
CREATE INDEX idx_email_inbound_received ON email_inbound(received_at DESC);
CREATE INDEX idx_email_inbound_classification ON email_inbound(classification);

CREATE TABLE email_routing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  match_type email_rule_match_type NOT NULL,
  match_value text NOT NULL,
  classification email_classification NOT NULL,
  priority integer NOT NULL DEFAULT 100,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX idx_email_rules_tenant ON email_routing_rules(tenant_id);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  full_name text, organization text, role text,
  email text, phone text, beds integer,
  message text, locale text DEFAULT 'de',
  status text NOT NULL DEFAULT 'neu',
  notes text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

-- Mandanten-Vokabular fuer Voice-Transcript-Editor (Auto-Learn).
-- Siehe: src/lib/voice/vocab-learner.ts, docs/voice-transcript-editor.md
CREATE TABLE IF NOT EXISTS tenant_vocabulary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  pattern text NOT NULL,
  correct text NOT NULL,
  category text,
  use_count integer NOT NULL DEFAULT 1,
  last_used_at timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tenant_vocabulary_tenant ON tenant_vocabulary(tenant_id);
`;

const SETUP_TOKEN = process.env.SETUP_TOKEN ?? "careai-setup-2026";

/**
 * SQL-Splitter fuer Multi-Statement-DDL. Respektiert `DO $$ … $$` Bloecke als
 * atomare Einheit (enthalten intern Semikola).
 */
function splitSqlStatements(ddl: string): string[] {
  const out: string[] = [];
  let buf = "";
  let inDollarBlock = false;
  const lines = ddl.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!inDollarBlock && trimmed.startsWith("--")) continue; // comment
    if (!inDollarBlock && /\$\$/.test(line)) {
      // Line contains $$ — either entering or exiting a block
      const count = (line.match(/\$\$/g) ?? []).length;
      buf += line + "\n";
      if (count % 2 === 1) inDollarBlock = !inDollarBlock;
      continue;
    }
    if (inDollarBlock) {
      buf += line + "\n";
      if (/\$\$/.test(line)) inDollarBlock = false;
      continue;
    }
    buf += line + "\n";
    if (trimmed.endsWith(";")) {
      out.push(buf);
      buf = "";
    }
  }
  if (buf.trim()) out.push(buf);
  return out;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (token !== SETUP_TOKEN) {
    return NextResponse.json(
      { error: "Forbidden", hint: "Pass ?token=… mit dem in Vercel-Env hinterlegten SETUP_TOKEN." },
      { status: 403 },
    );
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "DATABASE_URL fehlt im Env." }, { status: 500 });
  }

  const log: string[] = [];
  const t0 = Date.now();

  try {
    log.push("Verbinde zu Supabase…");
    const sql = postgres(dbUrl, { max: 1, prepare: false, idle_timeout: 5 });

    log.push("Lege Schema an (idempotent, statement-by-statement)…");
    // Split DDL: Transaction-Pooler behandelt Multi-Statement-Strings nicht zuverlaessig.
    // Wir splitten an ';' + Zeilenumbruch und filtern DO-Bloecke als ganze Einheit.
    const statements = splitSqlStatements(DDL);
    log.push(`  ${statements.length} Statements zu verarbeiten…`);
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt) continue;
      try {
        await sql.unsafe(stmt);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        // "already exists" / "duplicate" sind bei IF NOT EXISTS harmlos
        if (/already exists|duplicate/i.test(msg)) continue;
        log.push(`  ⚠ Statement ${i + 1} fehlgeschlagen: ${msg.slice(0, 120)}`);
        throw err;
      }
    }
    log.push("Schema OK — alle Tabellen frisch gebaut aus schema.ts.");

    log.push("Seede Demo-Daten (Tenant, Users, Bewohner, Audit-Eintraege)…");
    const seedResult = await runSeed();
    log.push(`Seed OK: ${seedResult.users} Users, ${seedResult.residents} Bewohner.`);

    // Owner-Account anlegen (versteckt, nicht in Demo-Liste)
    const ownerEmail = process.env.OWNER_EMAIL ?? "konstantin.wagner.d@gmail.com";
    const ownerPassword = process.env.OWNER_PASSWORD ?? "CareAI??1";
    const ownerName = process.env.OWNER_NAME ?? "Konstantin Wagner";

    log.push("Lege/aktualisiere Owner-Account…");
    const passwordHash = await bcrypt.hash(ownerPassword, 12);

    // 1. Operations-Tenant fuer den Owner (separat von Demo-Heim)
    const opsTenant = await sql`
      INSERT INTO tenants (name, address, plan)
      VALUES ('CareAI Operations', 'Schwarzenbergplatz 7/30, 1030 Wien', 'enterprise')
      ON CONFLICT DO NOTHING
      RETURNING id
    `;
    let opsTenantId: string;
    if (opsTenant.length > 0) {
      opsTenantId = opsTenant[0].id as string;
    } else {
      const existing = await sql`SELECT id FROM tenants WHERE name = 'CareAI Operations' LIMIT 1`;
      opsTenantId = existing[0].id as string;
    }

    // 2. Owner-User upsert
    await sql`
      INSERT INTO users (tenant_id, email, password_hash, role, full_name, email_verified)
      VALUES (${opsTenantId}::uuid, ${ownerEmail}, ${passwordHash}, 'owner', ${ownerName}, NOW())
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = 'owner',
        full_name = EXCLUDED.full_name,
        email_verified = NOW()
    `;
    log.push(`Owner OK: ${ownerEmail}`);

    await sql.end();

    return NextResponse.json({
      ok: true,
      duration_ms: Date.now() - t0,
      log,
      next_steps: {
        demo_login: "https://repocare.vercel.app/login (pflege@careai.demo / Demo2026!)",
        owner_login: `https://repocare.vercel.app/login (${ownerEmail} / ***)`,
        owner_panel: "https://repocare.vercel.app/owner",
        hint: "Owner-Account ist NICHT auf der Login-Seite gelistet. Nur du kennst die Email.",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: message, log, duration_ms: Date.now() - t0 },
      { status: 500 },
    );
  }
}
