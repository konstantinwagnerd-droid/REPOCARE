import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import {
  residents,
  sisAssessments,
  carePlans,
  careReports,
  vitalSigns,
  medications,
  wounds,
  incidents,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { aggregateJourney } from "@/lib/journey/aggregator";
import { enrichEvents } from "@/lib/journey/enricher";
import { filterEvents } from "@/lib/journey/filter";
import type { JourneyEventType, JourneySeverity } from "@/lib/journey/types";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ residentId: string }> },
): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { residentId } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;
  const types =
    (searchParams.get("types")?.split(",").filter(Boolean) as JourneyEventType[] | undefined) ??
    undefined;
  const severities =
    (searchParams.get("severities")?.split(",").filter(Boolean) as JourneySeverity[] | undefined) ??
    undefined;
  const onlyImportant = searchParams.get("onlyImportant") === "1";

  const [r] = await db.select().from(residents).where(eq(residents.id, residentId)).limit(1);
  if (!r) return NextResponse.json({ error: "not found" }, { status: 404 });

  const [sisList, plans, reports, vitals, meds, woundList, incList] = await Promise.all([
    db.select().from(sisAssessments).where(eq(sisAssessments.residentId, residentId)).orderBy(desc(sisAssessments.createdAt)).limit(50),
    db.select().from(carePlans).where(eq(carePlans.residentId, residentId)),
    db.select().from(careReports).where(eq(careReports.residentId, residentId)).orderBy(desc(careReports.createdAt)).limit(200),
    db.select().from(vitalSigns).where(eq(vitalSigns.residentId, residentId)).orderBy(desc(vitalSigns.recordedAt)).limit(500),
    db.select().from(medications).where(eq(medications.residentId, residentId)),
    db.select().from(wounds).where(eq(wounds.residentId, residentId)),
    db.select().from(incidents).where(eq(incidents.residentId, residentId)).orderBy(desc(incidents.occurredAt)).limit(100),
  ]);

  const raw = aggregateJourney({
    resident: {
      id: r.id,
      fullName: r.fullName,
      admissionDate: r.admissionDate,
      pflegegrad: r.pflegegrad,
    },
    sisAssessments: sisList.map((s) => ({ id: s.id, createdAt: s.createdAt })),
    carePlans: plans.map((p) => ({
      id: p.id,
      createdAt: p.createdAt,
      title: p.title,
      status: p.status,
    })),
    careReports: reports.map((cr) => ({
      id: cr.id,
      createdAt: cr.createdAt,
      content: cr.content,
      important: Array.isArray(cr.sisTags) && cr.sisTags.length > 2,
    })),
    vitalSigns: vitals.map((v) => ({
      id: v.id,
      type: v.type,
      value: v.valueNumeric ?? 0,
      recordedAt: v.recordedAt,
    })),
    medications: meds.map((m) => ({
      id: m.id,
      createdAt: m.startDate,
      name: m.name,
      action: "start" as const,
    })),
    wounds: woundList.map((w) => ({
      id: w.id,
      createdAt: w.openedAt,
      closedAt: w.closedAt,
      location: w.location,
      stage: w.stage,
    })),
    incidents: incList.map((i) => ({
      id: i.id,
      occurredAt: i.occurredAt,
      severity: i.severity,
      title: i.type,
      description: i.description,
    })),
  });

  const enriched = enrichEvents(raw);
  const filtered = filterEvents(enriched, { from, to, types, severities, onlyImportant });

  return NextResponse.json({
    resident: { id: r.id, fullName: r.fullName, pflegegrad: r.pflegegrad },
    events: filtered,
    total: filtered.length,
  });
}
