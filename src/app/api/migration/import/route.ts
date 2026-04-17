import { NextResponse } from "next/server";
import { runFullImport, SOURCES } from "@/lib/migration";
import type { ConflictStrategy, MappingRule, MigrationSource } from "@/lib/migration/types";

export const runtime = "nodejs";

/**
 * POST /api/migration/import
 *
 * Führt den Import aus. Da der DB-Layer (src/db/) TABU ist,
 * läuft dieser Endpoint aktuell im Dry-Run-Modus — er validiert,
 * mappt und liefert einen vollständigen Report zurück, schreibt aber nichts.
 * Für echten Produktions-Einsatz müssen `findExisting` / `insertResident` /
 * `updateResident`-Deps aus einem DB-Modul durchgereicht werden.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as
      | {
          source?: MigrationSource;
          content?: string;
          rules?: MappingRule[];
          conflictStrategy?: ConflictStrategy;
          dryRun?: boolean;
        }
      | null;
    if (!body?.source || !body.content || !Array.isArray(body.rules)) {
      return NextResponse.json(
        { ok: false, error: "Felder 'source', 'content', 'rules' sind erforderlich." },
        { status: 400 },
      );
    }
    if (!(body.source in SOURCES)) {
      return NextResponse.json(
        { ok: false, error: `Unbekannte Quelle: ${body.source}` },
        { status: 400 },
      );
    }

    const report = await runFullImport(body.source, body.content, body.rules, {
      conflictStrategy: body.conflictStrategy ?? "skip",
      dryRun: body.dryRun ?? true,
    });
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
