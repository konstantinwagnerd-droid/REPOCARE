/**
 * Voice-Transkript → SIS-strukturierte JSON.
 *
 * Provider (via ENV LLM_PROVIDER + ENABLE_REAL_LLM=true):
 *   - mock (default) → deterministisches Demo-Schema
 *   - anthropic       → Claude Sonnet (via ANTHROPIC_API_KEY)
 *   - openai          → GPT-4o / GPT-4o-mini (via OPENAI_API_KEY)
 *
 * PII-Schutz: Transkript wird via LLM-Client automatisch PII-gescrubbed bei echten Providern.
 * Auditiert: entity_type="voice_structuring", action="create".
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { llmComplete } from "@/lib/llm/client";
import { buildCareReportPrompt } from "@/lib/llm/prompts/care-report-generation";
import { parseJSONSafely } from "@/lib/llm/safety";
import { logger } from "@/lib/monitoring/logger";

export const runtime = "nodejs";
export const maxDuration = 60;

type StructuredResult = {
  summary: string;
  sisTags?: string[];
  vitals?: Array<{ type?: string; label?: string; value: string | number; unit?: string }>;
  actions?: Array<{ text: string; urgency?: string } | string>;
  concerns?: string[];
  recommendations?: string[];
  confidence?: number;
};

function mockResult(transcript: string): StructuredResult {
  const t = transcript.toLowerCase();
  const hasWound = t.includes("wund");
  const hasMobil = t.includes("mobil");
  const hasVitals = t.includes("blutdruck") || t.includes("puls");
  return {
    summary:
      "Ruhige Schicht, Vitalwerte im Normbereich. Wundverlauf positiv (Granulation). Mobilisation durchgeführt. Nahrungsaufnahme vollständig.",
    vitals: [
      { type: "blutdruck_systolisch", value: 138, unit: "mmHg" },
      { type: "blutdruck_diastolisch", value: 82, unit: "mmHg" },
      { type: "puls", value: 74, unit: "/min" },
      { type: "temperatur", value: 36.7, unit: "°C" },
    ],
    sisTags: [
      hasMobil ? "Mobilität & Beweglichkeit" : null,
      hasWound ? "Krankheitsbezogene Anforderungen" : null,
      hasVitals ? "Selbstversorgung" : null,
    ].filter(Boolean) as string[],
    actions: [
      hasMobil && { text: "Mobilisation 2x täglich mit Rollator fortführen", urgency: "routine" },
      hasWound && {
        text: "Wundkontrolle morgen früh, Verbandswechsel nach Standard",
        urgency: "routine",
      },
      { text: "Angehörigen Herrn Berger über Wundverlauf informieren (PDL)", urgency: "info" },
    ].filter(Boolean) as Array<{ text: string; urgency: string }>,
    concerns: [],
    recommendations: ["Schmerz-Screening in der nächsten Schicht dokumentieren"],
    confidence: 0.82,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const transcript: string = body?.transcript ?? "";
  const residentId: string | undefined = body?.residentId;
  const residentName: string = body?.residentName ?? "Bewohner:in";
  const pflegegrad: number = body?.pflegegrad ?? 3;
  const shift: string | undefined = body?.shift;

  if (!transcript || transcript.length < 5) {
    return NextResponse.json({ error: "transcript_missing" }, { status: 400 });
  }

  const providerName = process.env.LLM_PROVIDER ?? "mock";
  const realEnabled = process.env.ENABLE_REAL_LLM === "true";

  // ── Auth ─────────────────────────────────────────────────────────
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessUser = session?.user as any;
  const userId = sessUser?.id as string | undefined;
  const tenantId = sessUser?.tenantId as string | undefined;

  // Real providers require auth (mock is public demo).
  const usingReal = providerName !== "mock" && realEnabled;
  if (usingReal && (!userId || !tenantId)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // ── Mock path ────────────────────────────────────────────────────
  if (!usingReal) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ ...mockResult(transcript), provider: "mock" });
  }

  // ── Real LLM path ────────────────────────────────────────────────
  try {
    const prompt = buildCareReportPrompt({
      transcript,
      residentName,
      pflegegrad,
    });
    const resp = await llmComplete({
      ...prompt,
      tenantId: tenantId!,
      userId: userId!,
    });

    const parsed = parseJSONSafely<StructuredResult>(resp.content) ?? mockResult(transcript);

    // ── Audit ──────────────────────────────────────────────────────
    if (userId && tenantId) {
      try {
        await logAudit({
          tenantId,
          userId,
          entityType: "voice_structuring",
          entityId: residentId ?? crypto.randomUUID(),
          action: "create",
          after: {
            provider: resp.provider,
            model: resp.model,
            text_length: transcript.length,
            shift,
            sisTags_count: parsed.sisTags?.length ?? 0,
            actions_count: parsed.actions?.length ?? 0,
            confidence: parsed.confidence,
          },
        });
      } catch (auditErr) {
        logger.warn("voice.structure.audit_failed", { err: String(auditErr) });
      }
    }

    return NextResponse.json({
      ...parsed,
      provider: resp.provider,
      model: resp.model,
    });
  } catch (e) {
    logger.error("voice.structure.error", { err: String(e) });
    // Graceful fallback to mock — never a blackout for the user.
    return NextResponse.json({ ...mockResult(transcript), provider: "mock-fallback" });
  }
}
