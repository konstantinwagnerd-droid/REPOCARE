import { NextRequest } from "next/server";
import { db } from "@/db/client";
import {
  residents, tenants, sisAssessments, carePlans, careReports,
  medications, wounds, incidents, exportRecords, users,
} from "@/db/schema";
import { eq, inArray, and, gte, lte, desc, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { renderPdf, pdfResponse } from "@/lib/pdf/render";
import { MdBundleDoc, type MdBundleData } from "@/lib/pdf/md-pruefung-bundle";
import type { AkteData } from "@/lib/pdf/bewohner-akte";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const kind = (body.kind as "MD" | "NQZ") ?? "MD";
  const anonymized = !!body.anonymized;
  const auditor = typeof body.auditor === "string" ? body.auditor : undefined;
  const residentIds = Array.isArray(body.residentIds) ? (body.residentIds as string[]) : [];

  const from = body.from ? new Date(body.from as string) : new Date(Date.now() - 30 * 86400 * 1000);
  const to = body.to ? new Date(body.to as string) : new Date();

  const tenantId = session.user.tenantId;
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);

  let selected: typeof residents.$inferSelect[] = [];
  if (residentIds.length > 0) {
    selected = await db.select().from(residents).where(and(eq(residents.tenantId, tenantId), inArray(residents.id, residentIds), isNull(residents.deletedAt)));
  } else {
    // Zufällige Stichprobe (6)
    const all = await db.select().from(residents).where(and(eq(residents.tenantId, tenantId), isNull(residents.deletedAt)));
    selected = all.sort(() => Math.random() - 0.5).slice(0, Math.min(6, all.length));
  }

  const akten: AkteData[] = await Promise.all(selected.map(async (r) => {
    const [sisList, plans, reports, meds, woundList, incList] = await Promise.all([
      db.select().from(sisAssessments).where(eq(sisAssessments.residentId, r.id)).orderBy(desc(sisAssessments.createdAt)).limit(1),
      db.select().from(carePlans).where(eq(carePlans.residentId, r.id)),
      db.select({ rep: careReports, u: users })
        .from(careReports)
        .leftJoin(users, eq(users.id, careReports.authorId))
        .where(and(eq(careReports.residentId, r.id), gte(careReports.createdAt, from), lte(careReports.createdAt, to)))
        .orderBy(desc(careReports.createdAt)).limit(15),
      db.select().from(medications).where(eq(medications.residentId, r.id)),
      db.select().from(wounds).where(eq(wounds.residentId, r.id)),
      db.select().from(incidents).where(and(eq(incidents.residentId, r.id), gte(incidents.occurredAt, from), lte(incidents.occurredAt, to))),
    ]);
    const sis = sisList[0];
    return {
      resident: {
        fullName: r.fullName,
        birthdate: r.birthdate,
        pflegegrad: r.pflegegrad,
        room: r.room,
        station: r.station,
        admissionDate: r.admissionDate,
      },
      period: { from, to },
      include: { stammdaten: true, sis: true, plan: true, reports: true, medication: true, wounds: true, incidents: true },
      sis: sis ? {
        themenfeld1: sis.themenfeld1 ?? null,
        themenfeld2: sis.themenfeld2 ?? null,
        themenfeld3: sis.themenfeld3 ?? null,
        themenfeld4: sis.themenfeld4 ?? null,
        themenfeld5: sis.themenfeld5 ?? null,
        themenfeld6: sis.themenfeld6 ?? null,
      } : undefined,
      plans: plans.map((p) => ({ title: p.title, description: p.description, frequency: p.frequency, status: p.status })),
      reports: (reports as Array<{ rep: typeof careReports.$inferSelect; u: typeof users.$inferSelect | null }>).map(({ rep, u }) => ({
        shift: rep.shift, content: rep.content, createdAt: rep.createdAt, authorName: u?.fullName ?? undefined, signatureHash: rep.signatureHash,
      })),
      medications: meds.map((m) => ({ name: m.name, dosage: m.dosage })),
      wounds: woundList.map((w) => ({ location: w.location, type: w.type, stage: w.stage, openedAt: w.openedAt, closedAt: w.closedAt })),
      incidents: incList.map((i) => ({ type: i.type, severity: i.severity, description: i.description, occurredAt: i.occurredAt })),
    } satisfies AkteData;
  }));

  const data: MdBundleData = {
    kind,
    facilityName: tenant?.name ?? "CareAI Demo Einrichtung",
    period: { from, to },
    residents: akten,
    anonymized,
    auditor,
  };

  const { buffer, hash, filename } = await renderPdf(MdBundleDoc, data, {
    facilityName: tenant?.name ?? "CareAI Demo Einrichtung",
    facilityAddress: tenant?.address ?? undefined,
    title: kind === "MD" ? "MD-Prüfungsbundle" : "NQZ-Prüfungsbundle",
    subtitle: `${data.residents.length} Bewohner:innen · ${from.toLocaleDateString("de-DE")} – ${to.toLocaleDateString("de-DE")}`,
    confidential: true,
    recipient: auditor,
    watermark: auditor ? `Prüfung ${auditor}` : undefined,
  });

  await db.insert(exportRecords).values({
    tenantId, userId: session.user.id, kind: `${kind.toLowerCase()}_bundle`, hash, filename, recipient: auditor,
  });
  await logAudit({
    tenantId, userId: session.user.id, entityType: "tenant", entityId: tenantId, action: "read",
    after: { export: `${kind}_bundle`, hash, residents: akten.length },
  });

  return pdfResponse(buffer, filename, hash);
}
