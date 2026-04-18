/**
 * POST /api/ai/risk-assess
 * Body: { residentId: string }
 * Returns: Risk-Scores für Sturz / Dekubitus / Delir / Dehydration mit Begründung.
 * Persistiert in risk_scores mit model_version='claude-4-7-20250929'.
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { residents, medications, vitalSigns, incidents, riskScores } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { llmComplete } from "@/lib/llm/client";
import { buildRiskAssessV1 } from "@/lib/llm/prompts/risk-assessment-v1";
import { parseJSONSafely } from "@/lib/llm/safety";
import { logger } from "@/lib/monitoring/logger";

export const runtime = "nodejs";
export const maxDuration = 60;

type RiskScore = { score: number; factors: string[]; recommendation: string; confidence: number };
type RiskResult = { risks: Record<"sturz" | "dekubitus" | "delir" | "dehydration", RiskScore> };

function mockResult(): RiskResult {
  return {
    risks: {
      sturz: { score: 0.55, factors: ["Benzodiazepin-Einnahme", "Pflegegrad 3", "Alter >80"], recommendation: "Tinetti-Test, Rollator, Nachtbeleuchtung.", confidence: 0.5 },
      dekubitus: { score: 0.3, factors: ["teilweise Immobilität"], recommendation: "Lagerung alle 2h, Braden-Score wöchentlich.", confidence: 0.5 },
      delir: { score: 0.25, factors: ["keine akuten Faktoren"], recommendation: "CAM-Screening bei Verschlechterung.", confidence: 0.5 },
      dehydration: { score: 0.2, factors: ["normwertige Vitalwerte"], recommendation: "Trinkmenge dokumentieren (>=1.5l/d).", confidence: 0.5 },
    },
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const residentId: string | undefined = body?.residentId;
  if (!residentId) return NextResponse.json({ error: "residentId_missing" }, { status: 400 });

  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const su = session?.user as any;
  const userId = su?.id as string | undefined;
  const tenantId = su?.tenantId as string | undefined;

  const [r] = await db.select().from(residents).where(eq(residents.id, residentId)).limit(1);
  if (!r) return NextResponse.json({ error: "resident_not_found" }, { status: 404 });

  const age = Math.floor((Date.now() - new Date(r.birthdate).getTime()) / (365.25 * 24 * 3600 * 1000));
  const meds = await db.select().from(medications).where(eq(medications.residentId, residentId));
  const vits = await db.select().from(vitalSigns).where(eq(vitalSigns.residentId, residentId)).orderBy(desc(vitalSigns.recordedAt)).limit(30);
  const incs = await db.select().from(incidents).where(eq(incidents.residentId, residentId)).orderBy(desc(incidents.occurredAt)).limit(10);

  const providerName = process.env.LLM_PROVIDER ?? "mock";
  const usingReal = providerName !== "mock" && process.env.ENABLE_REAL_LLM === "true";

  let result: RiskResult;
  let modelVersion = "mock-v1";

  if (usingReal && userId && tenantId) {
    try {
      const prompt = buildRiskAssessV1({
        residentName: r.fullName,
        age,
        pflegegrad: r.pflegegrad,
        diagnoses: (r.diagnoses as string[] | undefined) ?? [],
        medications: meds.map((m) => `${m.name} ${m.dosage}`),
        recentVitals: vits.map((v) => ({ type: v.type, value: v.valueNumeric ?? v.valueText ?? "", at: v.recordedAt.toISOString() })),
        recentIncidents: incs.map((i) => ({ type: i.type, severity: i.severity, at: i.occurredAt.toISOString() })),
      });
      const resp = await llmComplete({ ...prompt, tenantId, userId });
      const parsed = parseJSONSafely<RiskResult>(resp.content);
      if (parsed?.risks) {
        result = parsed;
        modelVersion = `claude-4-7-${resp.model}`;
      } else {
        result = mockResult();
      }
    } catch (e) {
      logger.error("risk-assess.error", { err: String(e) });
      result = mockResult();
    }
  } else {
    result = mockResult();
  }

  // Persistiere in risk_scores
  const rows = Object.entries(result.risks).map(([type, r]) => ({
    residentId,
    type,
    score: r.score,
    modelVersion,
  }));
  try {
    await db.insert(riskScores).values(rows);
  } catch (e) {
    logger.warn("risk-assess.persist_failed", { err: String(e) });
  }

  return NextResponse.json({ ...result, model_version: modelVersion });
}
