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
DO $$ BEGIN CREATE TYPE role AS ENUM ('owner','admin','pdl','pflegekraft','angehoeriger'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TYPE role ADD VALUE IF NOT EXISTS 'owner' BEFORE 'admin'; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE plan AS ENUM ('starter','professional','enterprise'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE shift AS ENUM ('frueh','spaet','nacht'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE care_plan_status AS ENUM ('offen','laufend','erledigt','pausiert'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE mar_status AS ENUM ('geplant','verabreicht','verweigert','ausgefallen'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE incident_severity AS ENUM ('niedrig','mittel','hoch','kritisch'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE wound_stage AS ENUM ('grad_1','grad_2','grad_3','grad_4','verheilt'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

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

CREATE TABLE IF NOT EXISTS residents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  full_name text NOT NULL, birthdate timestamp NOT NULL,
  pflegegrad integer NOT NULL, room text NOT NULL,
  station text NOT NULL DEFAULT 'Station A',
  admission_date timestamp NOT NULL,
  diagnoses_json jsonb DEFAULT '[]'::jsonb, allergies_json jsonb DEFAULT '[]'::jsonb,
  emergency_contact_json jsonb,
  primary_family_user_id uuid,
  wellbeing_score integer DEFAULT 7,
  deleted_at timestamp, deletion_reason text,
  created_at timestamp NOT NULL DEFAULT now()
);
-- Bei existierenden Tabellen: fehlende Spalten nachziehen.
ALTER TABLE residents ADD COLUMN IF NOT EXISTS primary_family_user_id uuid;
ALTER TABLE residents ADD COLUMN IF NOT EXISTS wellbeing_score integer DEFAULT 7;
ALTER TABLE residents ADD COLUMN IF NOT EXISTS deletion_reason text;

CREATE TABLE IF NOT EXISTS sis_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  themenfeld_1_json jsonb, themenfeld_2_json jsonb, themenfeld_3_json jsonb,
  themenfeld_4_json jsonb, themenfeld_5_json jsonb, themenfeld_6_json jsonb,
  risiko_matrix_json jsonb, created_by uuid REFERENCES users(id),
  created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS care_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  title text NOT NULL, description text, frequency text,
  responsible_role role, status care_plan_status NOT NULL DEFAULT 'offen',
  due_date timestamp, created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS care_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES users(id),
  shift shift, content text NOT NULL,
  ai_structured_json jsonb, sis_tags_json jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vital_signs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  type text NOT NULL, value_numeric real, value_text text,
  recorded_at timestamp NOT NULL DEFAULT now(),
  recorded_by uuid REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  name text NOT NULL, dosage text, frequency_json jsonb,
  start_date date, end_date date, prescribed_by text,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS medication_administrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  scheduled_at timestamp NOT NULL, administered_at timestamp,
  administered_by uuid REFERENCES users(id),
  status mar_status NOT NULL DEFAULT 'geplant', notes text
);

CREATE TABLE IF NOT EXISTS wounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  location text, type text, stage wound_stage,
  opened_at date, closed_at date,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wound_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wound_id uuid NOT NULL REFERENCES wounds(id) ON DELETE CASCADE,
  observation text, photo_url text,
  recorded_at timestamp NOT NULL DEFAULT now(),
  recorded_by uuid REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  type text NOT NULL, severity incident_severity NOT NULL DEFAULT 'mittel',
  description text, occurred_at timestamp NOT NULL DEFAULT now(),
  reported_by uuid REFERENCES users(id),
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS risk_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  type text NOT NULL, score real NOT NULL,
  computed_at timestamp NOT NULL DEFAULT now(),
  model_version text
);

CREATE TABLE IF NOT EXISTS family_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  from_user_id uuid REFERENCES users(id),
  to_user_id uuid REFERENCES users(id),
  body text NOT NULL, read_at timestamp,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id),
  starts_at timestamp NOT NULL, ends_at timestamp NOT NULL,
  station text
);

CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  entity_type text NOT NULL, entity_id uuid,
  action text NOT NULL, before_json jsonb, after_json jsonb,
  ip text, user_agent text,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS export_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  kind text NOT NULL, resident_id uuid,
  hash text NOT NULL, filename text NOT NULL,
  recipient text, created_at timestamp NOT NULL DEFAULT now()
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
    log.push("Schema OK.");

    // Safety-Net: explizite ALTER TABLE fuer bekannte-fehlende Spalten,
    // auch wenn die haupt-DDL sie schon enthaelt. ADD COLUMN IF NOT EXISTS ist idempotent.
    log.push("Migriere bekannte Schema-Drift (primary_family_user_id, wellbeing_score, …)…");
    const migrations = [
      `ALTER TABLE residents ADD COLUMN IF NOT EXISTS primary_family_user_id uuid`,
      `ALTER TABLE residents ADD COLUMN IF NOT EXISTS wellbeing_score integer DEFAULT 7`,
      `ALTER TABLE residents ADD COLUMN IF NOT EXISTS deletion_reason text`,
      `ALTER TABLE residents ADD COLUMN IF NOT EXISTS deleted_at timestamp`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified timestamp`,
      `ALTER TABLE care_reports ADD COLUMN IF NOT EXISTS ai_structured_json jsonb`,
      `ALTER TABLE care_reports ADD COLUMN IF NOT EXISTS sis_tags_json jsonb`,
      `ALTER TABLE care_plans ADD COLUMN IF NOT EXISTS due_date timestamp`,
      `ALTER TABLE incidents ADD COLUMN IF NOT EXISTS severity incident_severity DEFAULT 'mittel'`,
    ];
    for (const m of migrations) {
      try { await sql.unsafe(m); }
      catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        // nur echte Fehler loggen, nicht "already exists"/"duplicate"
        if (!/already exists|duplicate/i.test(msg)) {
          log.push(`  ⚠ Migration failed: ${m.slice(0, 60)}… — ${msg.slice(0, 100)}`);
        }
      }
    }
    log.push("Migrations OK.");

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
