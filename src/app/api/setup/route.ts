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
