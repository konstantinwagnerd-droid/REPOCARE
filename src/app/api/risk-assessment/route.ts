/**
 * Risikobewertung via LLM (Sturz, Dekubitus, Delir).
 * Default: Mock. Real provider opt-in via env.
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { llmComplete } from "@/lib/llm/client";
import { buildRiskPrompt } from "@/lib/llm/prompts/risk-assessment";
import { parseJSONSafely } from "@/lib/llm/safety";
import { logger } from "@/lib/monitoring/logger";
import { z } from "zod";

const Body = z.object({
  kind: z.enum(["sturz", "dekubitus", "delir"]),
  residentId: z.string().uuid().optional(),
  residentName: z.string().min(1),
  age: z.number().int().min(0).max(130),
  pflegegrad: z.number().int().min(0).max(5),
  diagnoses: z.array(z.string()).default([]),
  recentNotes: z.array(z.string()).default([]),
  medications: z.array(z.string()).optional(),
});

function mockRisk(kind: string) {
  const map: Record<string, { risikoStufe: string; score: number; reassessmentInTagen: number }> = {
    sturz: { risikoStufe: "mittel", score: 6, reassessmentInTagen: 14 },
    dekubitus: { risikoStufe: "niedrig", score: 19, reassessmentInTagen: 30 },
    delir: { risikoStufe: "niedrig", score: 2, reassessmentInTagen: 7 },
  };
  const base = map[kind] ?? map.sturz;
  return {
    ...base,
    begruendung: `[Mock] ${kind.toUpperCase()}-Risiko laut Basis-Screening — dies ist eine Demo-Antwort.`,
    massnahmen: [
      "Bewegungsfördernde Angebote 2x täglich",
      "Regelmäßige Reassessment-Dokumentation",
      "Angehörige und Team informieren",
    ],
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", details: parsed.error.flatten() }, { status: 400 });
  }

  const realEnabled = process.env.ENABLE_REAL_LLM === "true" && (process.env.LLM_PROVIDER ?? "mock") !== "mock";
  if (!realEnabled) {
    return NextResponse.json({ ...mockRisk(parsed.data.kind), provider: "mock" });
  }

  try {
    const prompt = buildRiskPrompt(parsed.data);
    const resp = await llmComplete({
      ...prompt,
      tenantId: session.user.tenantId,
      userId: session.user.id,
    });
    const result = parseJSONSafely<Record<string, unknown>>(resp.content);
    return NextResponse.json({ ...result, provider: resp.provider, model: resp.model });
  } catch (e) {
    logger.error("risk.assessment.error", { err: String(e) });
    return NextResponse.json({ ...mockRisk(parsed.data.kind), provider: "mock-fallback" });
  }
}
