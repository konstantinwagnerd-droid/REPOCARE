import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { residents, sisAssessments, carePlans, careReports, vitalSigns, medications, wounds, incidents } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { aggregateJourney } from "@/lib/journey/aggregator";
import { enrichEvents } from "@/lib/journey/enricher";
import { exportHtml, exportJson } from "@/lib/journey/export";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ residentId: string }> },
): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { residentId } = await ctx.params;
  const format = new URL(req.url).searchParams.get("format") ?? "html";

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

  const events = enrichEvents(
    aggregateJourney({
      resident: { id: r.id, fullName: r.fullName, admissionDate: r.admissionDate, pflegegrad: r.pflegegrad },
      sisAssessments: sisList.map((s) => ({ id: s.id, createdAt: s.createdAt })),
      carePlans: plans.map((p) => ({ id: p.id, createdAt: p.createdAt, title: p.title, status: p.status })),
      careReports: reports.map((cr) => ({ id: cr.id, createdAt: cr.createdAt, content: cr.content })),
      vitalSigns: vitals.map((v) => ({ id: v.id, type: v.type, value: v.valueNumeric ?? 0, recordedAt: v.recordedAt })),
      medications: meds.map((m) => ({ id: m.id, createdAt: m.startDate, name: m.name, action: "start" as const })),
      wounds: woundList.map((w) => ({ id: w.id, createdAt: w.openedAt, closedAt: w.closedAt, location: w.location, stage: w.stage })),
      incidents: incList.map((i) => ({ id: i.id, occurredAt: i.occurredAt, severity: i.severity, title: i.type, description: i.description })),
    }),
  );

  const meta = { residentName: r.fullName, residentId: r.id, pflegegrad: r.pflegegrad };
  if (format === "json") {
    return new NextResponse(exportJson(events, meta), {
      headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="journey-${r.id}.json"` },
    });
  }
  return new NextResponse(exportHtml(events, meta), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
