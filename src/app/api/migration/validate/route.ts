import { NextResponse } from "next/server";
import { parseAndValidate, SOURCES } from "@/lib/migration";
import type { MappingRule, MigrationSource } from "@/lib/migration/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as
      | { source?: MigrationSource; content?: string; rules?: MappingRule[] }
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
    const { parse, validation, mapped } = parseAndValidate(body.source, body.content, body.rules);
    return NextResponse.json({
      ok: true,
      summary: {
        totalRecords: parse.totalRecords,
        validRecords: validation.validRecords,
        errorCount: validation.errors.length,
        warningCount: validation.warnings.length,
        duplicateCount: validation.duplicates.length,
      },
      validation,
      preview: mapped.slice(0, 50),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
