import { NextRequest } from "next/server";
import { db } from "@/db/client";
import { residents, medications, tenants, exportRecords } from "@/db/schema";
import { eq, and, isNull, or, gte } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { renderPdf, pdfResponse } from "@/lib/pdf/render";
import { MedikationsplanDoc, type BmpData, type BmpEntry } from "@/lib/pdf/medikationsplan";
import { qrDataUrl } from "@/lib/pdf/qr";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

function parseEntry(m: typeof medications.$inferSelect): BmpEntry {
  const times = m.frequency?.times ?? [];
  const has = (slot: string) => times.some((t) => t.toLowerCase().includes(slot));
  const dose = (m.dosage.match(/([0-9]+[.,]?[0-9]*)/)?.[1] ?? "1");
  return {
    wirkstoff: m.name.split(" ")[0],
    handelsname: m.name,
    staerke: m.dosage.replace(/^[0-9.,]+\s*/, "") || m.dosage,
    form: "Tablette",
    morgens: has("mor") || has("08") || has("7") ? dose : undefined,
    mittags: has("mit") || has("12") ? dose : undefined,
    abends: has("abd") || has("abend") || has("18") || has("20") ? dose : undefined,
    nachts: has("nacht") || has("22") ? dose : undefined,
    einheit: "Stk",
    hinweise: m.prescribedBy ? `Verordnet: ${m.prescribedBy}` : undefined,
    grund: "laut Therapieplan",
  };
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ residentId: string }> }) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const { residentId } = await params;
  const [r] = await db.select().from(residents).where(eq(residents.id, residentId)).limit(1);
  if (!r) return new Response("Not found", { status: 404 });
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, r.tenantId)).limit(1);

  const now = new Date();
  const meds = await db.select().from(medications).where(
    and(eq(medications.residentId, residentId), or(isNull(medications.endDate), gte(medications.endDate, now))),
  );

  // Mock Datamatrix als QR-Code mit BMP-Metadaten
  const barcode = await qrDataUrl(`BMP|${r.id.slice(0, 8)}|${meds.length}|${now.toISOString().slice(0, 10)}`);

  const data: BmpData = {
    resident: { fullName: r.fullName, birthdate: r.birthdate, pflegegrad: r.pflegegrad },
    issuedAt: now,
    doctor: meds[0]?.prescribedBy ?? undefined,
    entries: meds.map(parseEntry),
    barcodeDataUrl: barcode,
  };

  const { buffer, hash, filename } = await renderPdf(MedikationsplanDoc, data, {
    facilityName: tenant?.name ?? "CareAI Demo Einrichtung",
    title: `Bundeseinheitlicher Medikationsplan — ${r.fullName}`,
    subtitle: `Stand ${now.toLocaleDateString("de-DE")} · § 31a SGB V`,
    confidential: true,
  });
  await db.insert(exportRecords).values({ tenantId: r.tenantId, userId: session.user.id, kind: "bmp", residentId: r.id, hash, filename });
  await logAudit({ tenantId: r.tenantId, userId: session.user.id, entityType: "resident", entityId: r.id, action: "read", after: { export: "bmp", hash } });

  return pdfResponse(buffer, filename, hash);
}
