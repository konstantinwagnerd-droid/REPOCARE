import { NextRequest } from "next/server";
import { db } from "@/db/client";
import { careReports, residents, users, vitalSigns, carePlans, incidents, exportRecords, tenants } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { renderPdf, pdfResponse } from "@/lib/pdf/render";
import { PflegeberichtDoc, type PflegeberichtData } from "@/lib/pdf/pflegebericht";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const { id } = await params;

  const [report] = await db.select().from(careReports).where(eq(careReports.id, id)).limit(1);
  if (!report) return new Response("Not found", { status: 404 });

  const [resident] = await db.select().from(residents).where(eq(residents.id, report.residentId)).limit(1);
  if (!resident) return new Response("Resident not found", { status: 404 });

  const [author] = await db.select().from(users).where(eq(users.id, report.authorId)).limit(1);
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, resident.tenantId)).limit(1);

  // Berichtszeitraum = Tag des Berichts
  const day = new Date(report.createdAt);
  const from = new Date(day); from.setHours(0, 0, 0, 0);
  const to = new Date(day); to.setHours(23, 59, 59, 999);

  const [vitals, plans, inc] = await Promise.all([
    db.select().from(vitalSigns).where(and(eq(vitalSigns.residentId, resident.id), gte(vitalSigns.recordedAt, from), lte(vitalSigns.recordedAt, to))),
    db.select().from(carePlans).where(eq(carePlans.residentId, resident.id)),
    db.select().from(incidents).where(and(eq(incidents.residentId, resident.id), gte(incidents.occurredAt, from), lte(incidents.occurredAt, to))),
  ]);

  const data: PflegeberichtData = {
    resident: {
      fullName: resident.fullName,
      birthdate: resident.birthdate,
      pflegegrad: resident.pflegegrad,
      room: resident.room,
    },
    report: {
      shift: report.shift,
      content: report.content,
      createdAt: report.createdAt,
      sisTags: report.sisTags,
      signatureHash: report.signatureHash,
      signedAt: report.signedAt,
      version: report.version,
    },
    author: {
      fullName: author?.fullName ?? "Unbekannt",
      role: author?.role ?? undefined,
      personnelNumber: author ? author.id.slice(0, 8).toUpperCase() : undefined,
    },
    period: { from, to },
    vitals: vitals.map((v) => ({
      type: v.type,
      value: v.valueText ?? String(v.valueNumeric ?? ""),
      recordedAt: v.recordedAt,
    })),
    carePlanRefs: plans.slice(0, 10).map((p) => ({ title: p.title, status: p.status })),
    incidents: inc.map((i) => ({ type: i.type, severity: i.severity, description: i.description, occurredAt: i.occurredAt })),
  };

  const { buffer, hash, filename } = await renderPdf(PflegeberichtDoc, data, {
    facilityName: tenant?.name ?? "CareAI Demo Einrichtung",
    facilityAddress: tenant?.address ?? undefined,
    title: `Pflegebericht — ${resident.fullName}`,
    subtitle: `Schicht ${report.shift} · ${new Date(report.createdAt).toLocaleDateString("de-DE")}`,
    confidential: true,
  });

  await db.insert(exportRecords).values({
    tenantId: resident.tenantId,
    userId: session.user.id,
    kind: "pflegebericht",
    residentId: resident.id,
    hash,
    filename,
  });

  await logAudit({
    tenantId: resident.tenantId,
    userId: session.user.id,
    entityType: "care_report",
    entityId: report.id,
    action: "read",
    after: { export: "pdf", hash },
  });

  return pdfResponse(buffer, filename, hash);
}
