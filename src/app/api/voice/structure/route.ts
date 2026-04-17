/**
 * Voice → SIS-strukturierte JSON.
 * Default: Mock (demo). Echt wenn LLM_PROVIDER!=mock und ENABLE_REAL_LLM=true.
 */
import { NextRequest, NextResponse } from "next/server";
import { llmComplete } from "@/lib/llm/client";
import { buildCareReportPrompt } from "@/lib/llm/prompts/care-report-generation";
import { parseJSONSafely } from "@/lib/llm/safety";
import { logger } from "@/lib/monitoring/logger";

function mockResult(transcript: string) {
  const hasWound = transcript.toLowerCase().includes("wund");
  const hasMobil = transcript.toLowerCase().includes("mobil");
  const hasVitals =
    transcript.toLowerCase().includes("blutdruck") || transcript.toLowerCase().includes("puls");
  return {
    summary:
      "Ruhige Nacht, Blutdruck im Normbereich. Wundverlauf positiv (Granulation). Mobilisation durchgeführt. Nahrungsaufnahme vollständig.",
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
    ].filter(Boolean),
    actions: [
      hasMobil && { text: "Mobilisation 2x täglich mit Rollator fortführen", urgency: "routine" },
      hasWound && { text: "Wundkontrolle morgen früh, Verbandswechsel nach Standard", urgency: "routine" },
      { text: "Angehörigen Herrn Berger über Wundverlauf informieren (PDL)", urgency: "info" },
    ].filter(Boolean),
    concerns: [],
  };
}

export async function POST(req: NextRequest) {
  const { transcript, residentName, pflegegrad, tenantId, userId } = await req
    .json()
    .catch(() => ({ transcript: "" }));

  const providerName = process.env.LLM_PROVIDER ?? "mock";
  const realEnabled = process.env.ENABLE_REAL_LLM === "true";

  if (providerName === "mock" || !realEnabled) {
    await new Promise((r) => setTimeout(r, 1000));
    return NextResponse.json({ ...mockResult(transcript), provider: "mock" });
  }

  try {
    const prompt = buildCareReportPrompt({
      transcript,
      residentName: residentName ?? "Bewohner:in",
      pflegegrad: pflegegrad ?? 3,
    });
    const resp = await llmComplete({ ...prompt, tenantId, userId });
    const parsed = parseJSONSafely<ReturnType<typeof mockResult>>(resp.content);
    return NextResponse.json({ ...parsed, provider: resp.provider, model: resp.model });
  } catch (e) {
    logger.error("voice.structure.error", { err: String(e) });
    // Fallback auf Mock — kein Blackout für den User.
    return NextResponse.json({ ...mockResult(transcript), provider: "mock-fallback" });
  }
}
