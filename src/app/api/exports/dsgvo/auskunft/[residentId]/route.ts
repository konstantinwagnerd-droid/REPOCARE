import { NextRequest } from "next/server";
import { db } from "@/db/client";
import {
  residents, tenants, sisAssessments, carePlans, careReports,
  vitalSigns, medications, medicationAdministrations, wounds, incidents, riskScores, auditLog, users, exportRecords,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { renderPdf } from "@/lib/pdf/render";
import { DsgvoAuskunftDoc, type DsgvoAuskunftData } from "@/lib/pdf/dsgvo-auskunft";
import { sha256 } from "@/lib/pdf/hash";
import { logAudit } from "@/lib/audit";
import JSZip from "jszip";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ residentId: string }> }) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const { residentId } = await params;
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const requestedBy = typeof body.requestedBy === "string" ? body.requestedBy : session.user.name ?? session.user.email;

  const [r] = await db.select().from(residents).where(eq(residents.id, residentId)).limit(1);
  if (!r) return new Response("Not found", { status: 404 });
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, r.tenantId)).limit(1);

  // Alle personenbezogenen Daten einsammeln
  const [sis, plans, reports, vitals, meds, mar, woundList, incList, risks, audit] = await Promise.all([
    db.select().from(sisAssessments).where(eq(sisAssessments.residentId, residentId)),
    db.select().from(carePlans).where(eq(carePlans.residentId, residentId)),
    db.select().from(careReports).where(eq(careReports.residentId, residentId)),
    db.select().from(vitalSigns).where(eq(vitalSigns.residentId, residentId)),
    db.select().from(medications).where(eq(medications.residentId, residentId)),
    db.select().from(medicationAdministrations).orderBy(desc(medicationAdministrations.scheduledAt)).limit(500),
    db.select().from(wounds).where(eq(wounds.residentId, residentId)),
    db.select().from(incidents).where(eq(incidents.residentId, residentId)),
    db.select().from(riskScores).where(eq(riskScores.residentId, residentId)),
    db.select({ a: auditLog, u: users }).from(auditLog).leftJoin(users, eq(users.id, auditLog.userId)).where(eq(auditLog.entityId, residentId)).orderBy(desc(auditLog.createdAt)).limit(200),
  ]);

  const data: DsgvoAuskunftData = {
    resident: { fullName: r.fullName, birthdate: r.birthdate, room: r.room },
    requestedBy,
    facilityName: tenant?.name ?? "CareAI Demo Einrichtung",
    categories: [
      { name: "Stammdaten", purpose: "Identifikation, Leistungserbringung", legalBasis: "DSGVO Art. 6(1)(b)(c)", retention: "10 Jahre nach Austritt", recordCount: 1 },
      { name: "Gesundheitsdaten (SIS)", purpose: "Pflegeplanung, MDK/NQZ-Nachweis", legalBasis: "DSGVO Art. 9(2)(h)", retention: "10 Jahre", recordCount: sis.length },
      { name: "Maßnahmenpläne", purpose: "Pflegedurchführung", legalBasis: "DSGVO Art. 9(2)(h) + SGB XI", retention: "10 Jahre", recordCount: plans.length },
      { name: "Pflegeberichte", purpose: "Verlaufsdokumentation", legalBasis: "GuKG § 5 / SGB XI § 113c", retention: "10 Jahre", recordCount: reports.length },
      { name: "Vitalwerte", purpose: "Gesundheitsüberwachung", legalBasis: "DSGVO Art. 9(2)(h)", retention: "10 Jahre", recordCount: vitals.length },
      { name: "Medikation + MAR", purpose: "Therapiedurchführung", legalBasis: "§ 31a SGB V", retention: "10 Jahre", recordCount: meds.length + mar.length },
      { name: "Wunddokumentation", purpose: "Dekubitusprävention", legalBasis: "Expertenstandard DNQP", retention: "10 Jahre", recordCount: woundList.length },
      { name: "Vorfälle / Incidents", purpose: "Qualitätssicherung", legalBasis: "DSGVO Art. 9(2)(h)", retention: "10 Jahre", recordCount: incList.length },
      { name: "Risiko-Scores (KI)", purpose: "Entscheidungsunterstützung", legalBasis: "DSGVO Art. 22(4) + EU AI Act", retention: "10 Jahre", recordCount: risks.length },
      { name: "Audit-Protokoll", purpose: "Revisionssicherheit", legalBasis: "DSGVO Art. 32", retention: "10 Jahre", recordCount: audit.length },
    ],
    recipients: [
      { name: "Medizinischer Dienst (MD) / NQZ", purpose: "Qualitätsprüfung", legalBasis: "SGB XI § 114 / GuKG" },
      { name: "Hausarzt", purpose: "Medizinische Versorgung", legalBasis: "Einwilligung + DSGVO Art. 9(2)(h)" },
      { name: "Gesetzliche Krankenkassen", purpose: "Abrechnung", legalBasis: "SGB XI" },
    ],
    auditEntries: audit.map(({ a, u }) => ({ createdAt: a.createdAt, action: a.action, entityType: a.entityType, userName: u?.fullName ?? null })),
  };

  const { buffer: pdfBuffer, hash } = await renderPdf(DsgvoAuskunftDoc, data, {
    facilityName: tenant?.name ?? "CareAI Demo Einrichtung",
    title: `DSGVO Art. 15 Auskunft — ${r.fullName}`,
    subtitle: `Antragsteller:in: ${requestedBy}`,
    confidential: true,
    recipient: requestedBy,
    watermark: `DSGVO-Auskunft · ${new Date().toLocaleDateString("de-DE")}`,
  });

  // JSON-Datendump
  const jsonDump = {
    exportedAt: new Date().toISOString(),
    resident: r,
    sis, plans, reports, vitals, medications: meds, medicationAdministrations: mar, wounds: woundList, incidents: incList, riskScores: risks,
    auditLog: audit.map(({ a, u }) => ({ ...a, userName: u?.fullName })),
  };
  const jsonStr = JSON.stringify(jsonDump, null, 2);

  // README
  const readme = `# DSGVO Art. 15 Auskunft — ${r.fullName}

Erstellt: ${new Date().toISOString()}
Antragsteller:in: ${requestedBy}
Einrichtung: ${tenant?.name ?? "—"}

## Inhalt dieses Archivs

- auskunft.pdf — lesbare Auskunft mit allen Datenkategorien, Empfängern, Rechten
- daten.json — vollständiger maschinenlesbarer Rohdaten-Export (Art. 20 DSGVO — Datenübertragbarkeit)
- audit-auszug.json — Protokoll aller Zugriffe auf diese Daten
- recipients.txt — Liste der Datenempfänger
- rechte.txt — Ihre Rechte nach DSGVO
- hash.txt — SHA-256 Hash-Verifikation

## Ihre Rechte

- Art. 16 DSGVO: Berichtigung unrichtiger Daten
- Art. 17 DSGVO: Löschung (eingeschränkt durch gesetzliche Aufbewahrungspflicht 10 Jahre)
- Art. 18 DSGVO: Einschränkung der Verarbeitung
- Art. 20 DSGVO: Datenübertragbarkeit (siehe daten.json)
- Art. 21 DSGVO: Widerspruch
- Art. 77 DSGVO: Beschwerde bei der Aufsichtsbehörde
  - Österreich: Datenschutzbehörde Wien
  - Deutschland: zuständige:r Landesdatenschutzbeauftragte:r

Hash: ${hash}
`;

  const zip = new JSZip();
  zip.file("auskunft.pdf", pdfBuffer);
  zip.file("daten.json", jsonStr);
  zip.file("audit-auszug.json", JSON.stringify(data.auditEntries, null, 2));
  zip.file("recipients.txt", data.recipients.map((r) => `${r.name} — ${r.purpose} (${r.legalBasis})`).join("\n"));
  zip.file("rechte.txt", readme);
  zip.file("hash.txt", hash);
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  const zipHash = sha256(zipBuffer);
  const filename = `DSGVO-Auskunft_${r.fullName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.zip`;

  await db.insert(exportRecords).values({
    tenantId: r.tenantId, userId: session.user.id, kind: "dsgvo_auskunft", residentId: r.id, hash: zipHash, filename, recipient: requestedBy,
  });
  await logAudit({
    tenantId: r.tenantId, userId: session.user.id, entityType: "resident", entityId: r.id, action: "read",
    after: { export: "dsgvo_auskunft", hash: zipHash, requestedBy },
  });

  return new Response(new Uint8Array(zipBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "X-CareAI-Hash": zipHash,
    },
  });
}
