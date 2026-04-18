/**
 * Seed-Endpoint fuer Training-Module (idempotent).
 * Wird beim Setup oder manuell via /api/training/seed?token=... aufgerufen,
 * und laedt die 4 Pflichtmodule (DNQP, Hygiene, BtM, Brandschutz) pro Tenant.
 */
import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import { SEED_MODULES } from "@/lib/training/modules";

export const runtime = "nodejs";
export const maxDuration = 60;

const SETUP_TOKEN = process.env.SETUP_TOKEN ?? "careai-setup-2026";

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token");
  if (token !== SETUP_TOKEN) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "db_unavailable" }, { status: 503 });

  const sql = postgres(dbUrl, { max: 1, prepare: false, idle_timeout: 5 });
  const log: string[] = [];
  try {
    const tenants = await sql<{ id: string }[]>`SELECT id FROM tenants`;
    log.push(`Seeding training modules fuer ${tenants.length} Tenant(s)…`);

    for (const tenant of tenants) {
      for (const m of SEED_MODULES) {
        // Idempotent: ueberspringen falls Modul mit gleichem Titel bereits existiert
        const existing = await sql<{ id: string }[]>`
          SELECT id FROM training_modules
          WHERE tenant_id = ${tenant.id}::uuid AND title = ${m.title}
          LIMIT 1
        `;
        if (existing.length > 0) {
          log.push(`  [skip] ${m.title} (bereits vorhanden fuer ${tenant.id})`);
          continue;
        }
        const [mod] = await sql<{ id: string }[]>`
          INSERT INTO training_modules
            (tenant_id, title, category, description, passing_score,
             duration_minutes, is_mandatory, validity_months)
          VALUES
            (${tenant.id}::uuid, ${m.title}, ${m.category}::training_category, ${m.description},
             ${m.passingScore}, ${m.durationMinutes}, ${m.isMandatory}, ${m.validityMonths})
          RETURNING id
        `;
        for (let i = 0; i < m.questions.length; i++) {
          const q = m.questions[i];
          await sql`
            INSERT INTO training_questions
              (module_id, question, type, options_json, correct_indices_json, explanation, order_index)
            VALUES
              (${mod.id}::uuid, ${q.question}, ${q.type}::training_question_type,
               ${JSON.stringify(q.options)}::jsonb, ${JSON.stringify(q.correct)}::jsonb,
               ${q.explanation}, ${i})
          `;
        }
        log.push(`  [ok] ${m.title} (${m.questions.length} Fragen)`);
      }
    }
    return NextResponse.json({ ok: true, log });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err), log },
      { status: 500 },
    );
  } finally {
    await sql.end();
  }
}
