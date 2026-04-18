/**
 * POST /api/voice/correct
 *
 * Wendet das Pflege-Fachvokabular-Dictionary serverseitig auf ein Transkript an.
 * Nützlich für Testbarkeit, Logging und künftiges Merging mit mandanten-spezifischem
 * Vokabular (aus `tenant_vocabulary`).
 *
 * Request:  { transcript: string }
 * Response: { corrected: string, corrections: Correction[] }
 */
import { NextRequest, NextResponse } from "next/server";
import { applyCorrections } from "@/lib/voice/correct-transcript";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as { transcript?: unknown } | null;
    const transcript = typeof body?.transcript === "string" ? body.transcript : "";
    if (!transcript) {
      return NextResponse.json({ error: "transcript is required" }, { status: 400 });
    }
    if (transcript.length > 50_000) {
      return NextResponse.json({ error: "transcript too large" }, { status: 413 });
    }
    const result = applyCorrections(transcript);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown error" },
      { status: 500 },
    );
  }
}
