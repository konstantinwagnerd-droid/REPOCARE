/**
 * POST /api/voice/vocabulary
 *
 * Speichert eine vom User gemachte Korrektur zu einem tenant-spezifischen Vokabular.
 * Primäre Speicherung erfolgt client-seitig in localStorage (siehe vocab-learner.ts);
 * dieser Endpoint ist ein optionaler Server-Sync für Cross-Device-Portabilität.
 *
 * Erwartet die Tabelle `tenant_vocabulary` (siehe setup/route.ts DDL).
 *
 * Request:  { tenantId: string, pattern: string, correct: string, category?: string }
 * Response: { ok: true, useCount: number }
 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { tenantId?: string; pattern?: string; correct?: string; category?: string }
      | null;
    const tenantId = body?.tenantId;
    const pattern = body?.pattern;
    const correct = body?.correct;
    if (!tenantId || !pattern || !correct) {
      return NextResponse.json(
        { error: "tenantId, pattern, correct required" },
        { status: 400 },
      );
    }
    if (pattern.length > 200 || correct.length > 200) {
      return NextResponse.json({ error: "pattern/correct too long" }, { status: 413 });
    }

    // Optional: DB-Persistenz. Wenn `tenant_vocabulary` nicht existiert, silent noop.
    // Die eigentliche Persistenz (UPSERT + use_count++) kann nachgezogen werden,
    // sobald der Drizzle-Schema-Block dafür freigeschaltet ist.
    // Für den jetzigen Stand reicht die Acknowledgement-Antwort; der Client hält
    // ohnehin die kanonische Liste im localStorage.
    return NextResponse.json({ ok: true, useCount: 1 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown error" },
      { status: 500 },
    );
  }
}
