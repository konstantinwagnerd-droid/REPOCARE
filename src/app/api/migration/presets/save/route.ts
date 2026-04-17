import { NextResponse } from "next/server";
import { savePreset } from "@/lib/migration/preset-store";
import type { MappingRule, MigrationSource } from "@/lib/migration/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as
      | { id?: string; name?: string; source?: MigrationSource; rules?: MappingRule[] }
      | null;
    if (!body?.name || !body.source || !Array.isArray(body.rules)) {
      return NextResponse.json(
        { ok: false, error: "Felder 'name', 'source', 'rules' sind erforderlich." },
        { status: 400 },
      );
    }
    const preset = savePreset({
      id: body.id,
      name: body.name,
      source: body.source,
      rules: body.rules,
    });
    return NextResponse.json({ ok: true, preset });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
