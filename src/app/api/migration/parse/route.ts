import { NextResponse } from "next/server";
import { parseBySource, defaultMappingFor, SOURCES } from "@/lib/migration";
import type { MigrationSource } from "@/lib/migration/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as
      | { source?: MigrationSource; content?: string }
      | null;
    if (!body?.source || !body.content) {
      return NextResponse.json(
        { ok: false, error: "Felder 'source' und 'content' sind erforderlich." },
        { status: 400 },
      );
    }
    if (!(body.source in SOURCES)) {
      return NextResponse.json(
        { ok: false, error: `Unbekannte Quelle: ${body.source}` },
        { status: 400 },
      );
    }

    // Größen-Limit: 50 MB (raw text)
    if (body.content.length > 50 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: "Datei zu groß (max. 50 MB)." },
        { status: 413 },
      );
    }

    const parse = parseBySource(body.source, body.content);
    const suggested = defaultMappingFor(body.source);
    return NextResponse.json({
      ok: true,
      parse: {
        source: parse.source,
        totalRecords: parse.totalRecords,
        detectedFields: parse.detectedFields,
        previewRecords: parse.records.slice(0, 10),
        parseErrors: parse.parseErrors,
      },
      suggestedMapping: suggested,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
