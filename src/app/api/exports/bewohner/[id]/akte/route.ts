import { NextRequest } from "next/server";
import { db } from "@/db/client";
import {
  residents, users, tenants, sisAssessments, carePlans, careReports,
  vitalSigns, medications, medicationAdministrations, wounds, incidents, riskScores, exportRecords,
} from "@/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { renderPdf, pdfResponse } from "@/lib/pdf/render";
import { BewohnerAkteDoc, type AkteData } from "@/lib/pdf/bewohner-akte";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const from = body.from ? new Date(body.from as string) : new Date(Date.now() - 30 * 86400 * 1000);
  const to = body.to ? new Date(body.to as string) : new Date();
  const include = (body.include as AkteData["include"]) ?? {
    stammdaten: true, sis: true, plan: true, reports: true, vitals: true, medication: true, wounds: true, incidents: true, risks: true,
  };
  const recipient = typeof body.recipient === "string" ? body.recipient : undefined;

  const [resident] = await db.select().from(residents).where(eq(residents.id, id)).limit(1);
  if (!resident) return new Response("Not found", { status: 404 });
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, resident.tenantId)).limit(1);

  const [sisList, plans, reports, vitals, meds, mar, woundList, incList, risks] = await Promise.all([
    include.sis ? db.select().from(sisAssessments).where(eq(sisAssessments.residentId, id)).orderBy(desc(sisAssessments.createdAt)).limit(1) : [],
    include.plan ? db.select().from(carePlans).where(eq(carePlans.residentId, id)) : [],
    include.reports ? db.select({ r: careReports, u: users })
      .from(careReports)
      .leftJoin(users, eq(users.id, careReports.authorId))
      .where(and(eq(careReports.residentId, id), gte(careReports.createdAt, from), lte(careReports.createdAt, to)))
      .orderBy(desc(careReports.createdAt)) : [],
    include.vitals ? db.select().from(vitalSigns).where(and(eq(vitalSigns.residentId, id), gte(vitalSigns.recordedAt, from), lte(vitalSigns.recordedAt, to))).orderBy(desc(vitalSigns.recordedAt)) : [],
    include.medication ? db.select().from(medications).where(eq(medications.residentId, id)) : [],
    include.medication ? db.select({ a: medicationAdministrations, m: medications })
      .from(medicationAdministrations)
      .leftJoin(medications, eq(medications.id, medicationAdministrations.medicationId))
      .orderBy(desc(medicationAdministrations.scheduledAt))
      .limit(60) : [],
    include.wounds ? db.select().from(wounds).where(eq(wounds.residentId, id)) : [],
    include.incidents ? db.select().from(incidents).where(and(eq(incidents.residentId, id), gte(incidents.occurredAt, from), lte(incidents.occurredAt, to))) : [],
    include.risks ? db.select().from(riskScores).where(eq(riskScores.residentId, id)).orderBy(desc(riskScores.computedAt)).limit(30) : [],
  ]);

  const sis = sisList[0];
  const data: AkteData = {
    resident: {
      fullName: resident.fullName,
      birthdate: resident.birthdate,
      pflegegrad: resident.pflegegrad,
      room: resident.room,
      station: resident.station,
      admissionDate: resident.admissionDate,
      diagnoses: resident.diagnoses ?? [],
      allergies: resident.allergies ?? [],
      emergencyContact: resident.emergencyContact ?? null,
    },
    period: { from, to },
    include,
    sis: sis ? {
      themenfeld1: sis.themenfeld1 ?? null,
      themenfeld2: sis.themenfeld2 ?? null,
      themenfeld3: sis.themenfeld3 ?? null,
      themenfeld4: sis.themenfeld4 ?? null,
      themenfeld5: sis.themenfeld5 ?? null,
      themenfeld6: sis.themenfeld6 ?? null,
    } : undefined,
    plans: plans.map((p) => ({ title: p.title, description: p.description, frequency: p.frequency, status: p.status })),
    reports: (reports as Array<{ r: typeof careReports.$inferSelect; u: typeof users.$inferSelect | null }>).map(({ r, u }) => ({
      shift: r.shift, content: r.content, createdAt: r.createdAt, authorName: u?.fullName ?? undefined, signatureHash: r.signatureHash,
    })),
    vitals: vitals.map((v) => ({ type: v.type, value: v.valueText ?? String(v.valueNumeric ?? ""), recordedAt: v.recordedAt })),
    medications: meds.map((m) => ({
      name: m.name,
      dosage: m.dosage,
      frequencyText: m.frequency ? `${m.frequency.times?.join(", ") ?? ""} (${m.frequency.days?.join(", ") ?? ""})` : undefined,
      prescribedBy: m.prescribedBy,
    })),
    mar: (mar as Array<{ a: typeof medicationAdministrations.$inferSelect; m: typeof medications.$inferSelect | null }>).map(({ a, m }) => ({
      medicationName: m?.name ?? "—",
      scheduledAt: a.scheduledAt,
      status: a.status,
      notes: a.notes,
    })),
    wounds: woundList.map((w) => ({ location: w.location, type: w.type, stage: w.stage, openedAt: w.openedAt, closedAt: w.closedAt })),
    incidents: incList.map((i) => ({ type: i.type, severity: i.severity, description: i.description, occurredAt: i.occurredAt })),
    risks: risks.map((r) => ({ type: r.type, score: r.score, computedAt: r.computedAt })),
  };

  const { buffer, hash, filename } = await renderPdf(BewohnerAkteDoc, data, {
    facilityName: tenant?.name ?? "CareAI Demo Einrichtung",
    facilityAddress: tenant?.address ?? undefined,
    title: `Bewohner-Akte — ${resident.fullName}`,
    subtitle: `Zeitraum ${from.toLocaleDateString("de-DE")} – ${to.toLocaleDateString("de-DE")}`,
    confidential: true,
    recipient,
    watermark: recipient ? `Export für ${recipient} · ${new Date().toLocaleDateString("de-DE")}` : undefined,
  });

  await db.insert(exportRecords).values({
    tenantId: resident.tenantId,
    userId: session.user.id,
    kind: "bewohner_akte",
    residentId: resident.id,
    hash, filename, recipient,
  });
  await logAudit({
    tenantId: resident.tenantId,
    userId: session.user.id,
    entityType: "resident",
    entityId: resident.id,
    action: "read",
    after: { export: "akte", hash, recipient },
  });

  return pdfResponse(buffer, filename, hash);
}
