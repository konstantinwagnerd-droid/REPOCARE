import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { residents, sisAssessments, users } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { PrintPage } from "@/components/print/print-page";
import { PrintHeader } from "@/components/print/print-header";
import { PrintFooter } from "@/components/print/print-footer";
import { PrintSection, PrintKV } from "@/components/print/print-section";
import { PrintSignatures } from "@/components/print/print-signatures";
import { fmtDate, getPrintContext } from "@/lib/print-context";

export const dynamic = "force-dynamic";

const THEMEN: Array<{ key: "themenfeld1" | "themenfeld2" | "themenfeld3" | "themenfeld4" | "themenfeld5" | "themenfeld6"; title: string }> = [
  { key: "themenfeld1", title: "1. Kognitive und kommunikative Fähigkeiten" },
  { key: "themenfeld2", title: "2. Mobilität und Beweglichkeit" },
  { key: "themenfeld3", title: "3. Krankheitsbezogene Anforderungen und Belastungen" },
  { key: "themenfeld4", title: "4. Selbstversorgung" },
  { key: "themenfeld5", title: "5. Leben in sozialen Beziehungen" },
  { key: "themenfeld6", title: "6. Haushaltsführung / Wohnen / Häuslichkeit" },
];

export default async function SISPrint({ params }: { params: Promise<{ residentId: string }> }) {
  const { residentId } = await params;
  const ctx = await getPrintContext();

  const [r] = await db.select().from(residents).where(eq(residents.id, residentId)).limit(1);
  if (!r) notFound();

  const [sis] = await db
    .select()
    .from(sisAssessments)
    .where(and(eq(sisAssessments.residentId, residentId), eq(sisAssessments.isCurrent, true)))
    .orderBy(desc(sisAssessments.createdAt))
    .limit(1);

  const creator = sis?.createdBy
    ? (await db.select().from(users).where(eq(users.id, sis.createdBy)).limit(1))[0]
    : null;

  return (
    <PrintPage title={`SIS — ${r.fullName}`}>
      <PrintHeader
        facilityName={ctx.facilityName}
        facilityAddress={ctx.facilityAddress}
        documentType="§ 113b SGB XI"
        title="Strukturierte Informationssammlung (SIS)"
        subtitle={r.fullName}
        meta={[
          { label: "Zimmer", value: r.room },
          { label: "Pflegegrad", value: `PG ${r.pflegegrad}` },
          { label: "Geburtsdatum", value: fmtDate(r.birthdate) },
          { label: "Version", value: `v${sis?.version ?? 1}` },
        ]}
      />

      <PrintSection title="Bewohner-Stammdaten" keepTogether>
        <PrintKV
          cols={2}
          items={[
            { label: "Name", value: r.fullName },
            { label: "Geburtsdatum", value: fmtDate(r.birthdate) },
            { label: "Aufnahme", value: fmtDate(r.admissionDate) },
            { label: "Pflegegrad", value: `PG ${r.pflegegrad}` },
            { label: "Station / Zimmer", value: `${r.station} · ${r.room}` },
            { label: "Allergien", value: (r.allergies ?? []).join(", ") || "—" },
          ]}
        />
      </PrintSection>

      {THEMEN.map((t) => {
        const feld = (sis?.[t.key] ?? null) as { finding?: string; resources?: string; needs?: string } | null;
        return (
          <PrintSection key={t.key} title={t.title}>
            <div style={{ fontSize: "9.5pt", lineHeight: 1.45 }}>
              <div style={{ marginBottom: "1.5mm" }}>
                <strong>Beobachtung / Befund:</strong>{" "}
                <span>{feld?.finding?.trim() || <em style={{ color: "#5C6664" }}>— (nicht erfasst)</em>}</span>
              </div>
              <div style={{ marginBottom: "1.5mm" }}>
                <strong>Ressourcen:</strong>{" "}
                <span>{feld?.resources?.trim() || <em style={{ color: "#5C6664" }}>—</em>}</span>
              </div>
              <div>
                <strong>Pflegerischer Bedarf / Wünsche:</strong>{" "}
                <span>{feld?.needs?.trim() || <em style={{ color: "#5C6664" }}>—</em>}</span>
              </div>
            </div>
          </PrintSection>
        );
      })}

      {sis?.risikoMatrix ? (
        <PrintSection title="Risiko-Matrix (R1–R7)">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2mm 4mm", fontSize: "9pt" }}>
            {Object.entries(sis.risikoMatrix).map(([k, v]) => (
              <div key={k} style={{ border: "1px solid #d8dedc", padding: "1.5mm" }}>
                <div style={{ fontWeight: 700, color: "#0E6B67" }}>{k}</div>
                <div>
                  Level: <strong>{v?.level ?? "—"}</strong>
                </div>
                {v?.note ? <div style={{ color: "#5C6664" }}>{v.note}</div> : null}
              </div>
            ))}
          </div>
        </PrintSection>
      ) : null}

      <PrintSignatures
        slots={[
          {
            label: "Bezugspflege",
            name: creator?.fullName,
            role: "Pflegefachkraft",
            date: fmtDate(sis?.updatedAt ?? sis?.createdAt ?? new Date()),
          },
          { label: "Pflegedienstleitung (PDL)", role: "PDL" },
        ]}
        note="Mit Unterschrift wird die Richtigkeit der erhobenen Informationen bestätigt. SIS ist gemäß §113b SGB XI Grundlage der Maßnahmenplanung."
      />

      <PrintFooter
        facilityName={ctx.facilityName}
        documentId={sis ? `SIS-${sis.id.slice(0, 8)}-v${sis.version}` : `SIS-${r.id.slice(0, 8)}`}
      />
    </PrintPage>
  );
}
