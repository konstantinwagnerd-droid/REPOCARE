/**
 * POST /api/ai/care-plan-suggest
 *
 * Body: { residentId: string }
 * Returns: NANDA-I Diagnosen + NIC Interventionen + NOC Outcomes.
 *
 * Nutzt echten Claude-4-7-Client wenn LLM_PROVIDER=anthropic + ENABLE_REAL_LLM=true,
 * sonst Mock-Fallback.
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { residents, carePlans, sisAssessments, nandaDiagnoses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { llmComplete } from "@/lib/llm/client";
import { buildCarePlanSuggestV1 } from "@/lib/llm/prompts/care-plan-suggest-v1";
import { parseJSONSafely } from "@/lib/llm/safety";
import { logger } from "@/lib/monitoring/logger";

export const runtime = "nodejs";
export const maxDuration = 60;

function mockSuggest(residentName: string) {
  return {
    diagnoses: [
      { nanda_code: "00155", label: "Sturzgefahr", problem: "Erhöhtes Sturzrisiko", etiology: "Eingeschränkte Mobilität, BZD-Einnahme", symptoms: ["unsicherer Gang", "Vorsturz"] },
    ],
    interventions: [
      {
        nic_code: "6490",
        nic_label: "Sturzprävention",
        activities: ["Rollator bereitstellen", "Handläufe prüfen", "Nachtbeleuchtung im Zimmer", "Medikation auf Sturzrisiko prüfen"],
        frequency: "täglich",
        responsible_role: "pflegekraft",
        target_noc: { code: "1909", label: "Sicheres Verhalten: Sturzprävention", current: 2, target: 4, deadline_weeks: 4 },
      },
    ],
    quality_measures: ["Wöchentliche Tinetti-Prüfung", "Medikationsreview 3-monatlich"],
    review_in_weeks: 4,
    confidence: 0.6,
    mock: true,
    residentName,
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
  const [sis] = await db.select().from(sisAssessments).where(eq(sisAssessments.residentId, residentId)).orderBy(desc(sisAssessments.createdAt)).limit(1);
  const plans = await db.select().from(carePlans).where(eq(carePlans.residentId, residentId));

  const providerName = process.env.LLM_PROVIDER ?? "mock";
  const usingReal = providerName !== "mock" && process.env.ENABLE_REAL_LLM === "true";

  if (!usingReal) {
    return NextResponse.json(mockSuggest(r.fullName));
  }

  if (!userId || !tenantId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const prompt = buildCarePlanSuggestV1({
      residentName: r.fullName,
      age,
      pflegegrad: r.pflegegrad,
      diagnoses: (r.diagnoses as string[] | undefined) ?? [],
      sis: sis
        ? {
            themenfelder: {
              "1": (sis.themenfeld1 as never) ?? { finding: "", resources: "", needs: "" },
              "2": (sis.themenfeld2 as never) ?? { finding: "", resources: "", needs: "" },
              "3": (sis.themenfeld3 as never) ?? { finding: "", resources: "", needs: "" },
              "4": (sis.themenfeld4 as never) ?? { finding: "", resources: "", needs: "" },
              "5": (sis.themenfeld5 as never) ?? { finding: "", resources: "", needs: "" },
              "6": (sis.themenfeld6 as never) ?? { finding: "", resources: "", needs: "" },
            },
            risikomatrix: (sis.risikoMatrix as never) ?? {},
          }
        : undefined,
      existingCarePlans: plans.map((p) => ({ title: p.title, status: p.status })),
    });

    const resp = await llmComplete({ ...prompt, tenantId, userId });
    const parsed = parseJSONSafely(resp.content) ?? mockSuggest(r.fullName);

    // Draft speichern falls NANDA-Diagnose vorhanden — als unsigned Vorschlag.
    try {
      const parsedAsRecord = parsed as Record<string, unknown>;
      const dArr = Array.isArray(parsedAsRecord.diagnoses) ? (parsedAsRecord.diagnoses as Array<Record<string, unknown>>) : [];
      for (const d of dArr.slice(0, 3)) {
        await db.insert(nandaDiagnoses).values({
          residentId,
          code: String(d.nanda_code ?? "00000"),
          label: String(d.label ?? "AI-Vorschlag"),
          problem: String(d.problem ?? ""),
          etiology: String(d.etiology ?? ""),
          symptoms: Array.isArray(d.symptoms) ? (d.symptoms as string[]) : [],
          priority: 3,
          status: "ruht", // ruht = Vorschlag, muss bestätigt werden
          createdBy: userId,
        });
      }
    } catch (e) {
      logger.warn("care-plan-suggest.persist_failed", { err: String(e) });
    }

    return NextResponse.json({
      ...parsed,
      provider: resp.provider,
      model: resp.model,
      cost_eur: resp.usage.costEur,
    });
  } catch (e) {
    logger.error("care-plan-suggest.error", { err: String(e) });
    return NextResponse.json(mockSuggest(r.fullName));
  }
}
