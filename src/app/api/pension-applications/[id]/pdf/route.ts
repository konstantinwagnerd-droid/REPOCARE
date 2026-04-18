/**
 * Pflegegeld-Antrag als PDF generieren.
 * Nutzt renderPdf + PensionApplicationDoc; setzt pdfHash am Antragsdatensatz.
 */
import { NextRequest } from "next/server";
import { db } from "@/db/client";
import { pensionApplications, residents, tenants, exportRecords } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { renderPdf, pdfResponse } from "@/lib/pdf/render";
import {
  PensionApplicationDoc,
  type PensionApplicationData,
} from "@/lib/pdf/pflegegeld-antrag";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const tenantId = session.user.tenantId as string | undefined;
  if (!tenantId) return new Response("No tenant", { status: 400 });

  const { id } = await params;

  const [app] = await db
    .select()
    .from(pensionApplications)
    .where(and(eq(pensionApplications.id, id), eq(pensionApplications.tenantId, tenantId)))
    .limit(1);
  if (!app) return new Response("Not found", { status: 404 });

  const [resident] = await db.select().from(residents).where(eq(residents.id, app.residentId)).limit(1);
  if (!resident) return new Response("Resident not found", { status: 404 });

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);

  const data = app.formData as unknown as PensionApplicationData;
  // Sicherheit: jurisdiction aus DB-Spalte nehmen (formData könnte abweichen)
  data.jurisdiction = app.applicationType;

  const titleLabel =
    app.applicationType === "de-sgb-xi"
      ? "Antrag auf Leistungen der Pflegeversicherung (SGB XI)"
      : "Antrag auf Bundespflegegeld (BPGG)";

  const { buffer, hash, filename } = await renderPdf(PensionApplicationDoc, data, {
    facilityName: tenant?.name ?? "CareAI Demo Einrichtung",
    facilityAddress: tenant?.address ?? undefined,
    title: titleLabel,
    subtitle: `${resident.fullName} — Stand ${new Date().toLocaleDateString("de-DE")}`,
    confidential: true,
  });

  await db
    .update(pensionApplications)
    .set({ pdfHash: hash })
    .where(eq(pensionApplications.id, id));

  await db.insert(exportRecords).values({
    tenantId,
    userId: session.user.id as string,
    kind: "pension_application",
    residentId: resident.id,
    hash,
    filename,
  });

  await logAudit({
    tenantId,
    userId: session.user.id as string,
    entityType: "pension_application",
    entityId: id,
    action: "read",
    after: { export: "pdf", hash },
  });

  return pdfResponse(buffer, filename, hash);
}
