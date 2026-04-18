import { notFound } from "next/navigation";
import { PrintPage } from "@/components/print/print-page";
import { PrintHeader } from "@/components/print/print-header";
import { PrintFooter } from "@/components/print/print-footer";
import { PrintSection, PrintKV } from "@/components/print/print-section";
import { PrintSignatures } from "@/components/print/print-signatures";
import { PrintTable } from "@/components/print/print-table";
import { fmtDate, getPrintContext } from "@/lib/print-context";
import { buildJahresbericht } from "@/lib/reports/jahresbericht";

export const dynamic = "force-dynamic";

function pct(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${n.toFixed(2)}`;
}

export default async function JahresberichtPrint({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) notFound();

  const ctx = await getPrintContext();
  if (!ctx.tenantId) notFound();

  const data = await buildJahresbericht(ctx.tenantId, year);

  return (
    <PrintPage title={`Qualitätsjahresbericht ${year}`}>
      <PrintHeader
        facilityName={ctx.facilityName}
        facilityAddress={ctx.facilityAddress}
        documentType="Qualitätsmanagement-Bericht"
        title={`Qualitätsjahresbericht ${year}`}
        subtitle={ctx.facilityName}
        meta={[
          { label: "Berichtsjahr", value: String(year) },
          { label: "Erstellt am", value: fmtDate(new Date()) },
        ]}
      />

      <PrintSection title="1. Belegung & Aufnahmen" keepTogether>
        <PrintKV
          cols={2}
          items={[
            { label: "Aktive Bewohner (Jahresende)", value: data.belegung.aktiv },
            { label: "Neu aufgenommen", value: data.belegung.neuAufgenommen },
            { label: "Ausgezogen / verstorben", value: data.belegung.ausgezogen },
            { label: "Auslastung", value: data.belegung.auslastungProzent != null ? `${data.belegung.auslastungProzent.toFixed(1)}%` : "—" },
          ]}
        />
      </PrintSection>

      <PrintSection title="2. Pflegegrad-Verteilung" keepTogether>
        <PrintTable
          columns={[
            { key: "pg", label: "Pflegegrad", width: "50%" },
            { key: "count", label: "Anzahl", width: "25%", align: "right" },
            { key: "pct", label: "Anteil", width: "25%", align: "right" },
          ]}
          rows={Object.entries(data.pflegegradVerteilung)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => ({
              pg: k,
              count: v,
              pct: data.belegung.aktiv ? `${((v / data.belegung.aktiv) * 100).toFixed(1)}%` : "—",
            }))}
        />
      </PrintSection>

      <PrintSection title="3. Ereignis-Meldungen (Incidents)" keepTogether>
        <PrintKV
          cols={2}
          items={[
            { label: "Ereignisse gesamt", value: data.incidents.gesamt },
            { label: "Sturz-Inzidenz / 1000 BT", value: pct(data.incidents.sturzInzidenzPro1000) },
          ]}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4mm", marginTop: "3mm" }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: "1mm" }}>Nach Schweregrad</div>
            <PrintTable
              columns={[
                { key: "s", label: "Schwere", width: "60%" },
                { key: "n", label: "Anzahl", width: "40%", align: "right" },
              ]}
              rows={Object.entries(data.incidents.nachSchwere).map(([s, n]) => ({ s, n }))}
            />
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: "1mm" }}>Nach Typ</div>
            <PrintTable
              columns={[
                { key: "t", label: "Typ", width: "60%" },
                { key: "n", label: "Anzahl", width: "40%", align: "right" },
              ]}
              rows={Object.entries(data.incidents.nachTyp).map(([t, n]) => ({ t, n }))}
            />
          </div>
        </div>
      </PrintSection>

      <PrintSection title="4. Wunden & Dekubitus" keepTogether>
        <PrintKV
          cols={2}
          items={[
            { label: "Dokumentierte Wunden", value: data.wunden.gesamt },
            { label: "Dekubitus-Inzidenz / 1000 BT", value: pct(data.wunden.dekubitusInzidenzPro1000) },
            { label: "Verheilt", value: data.wunden.verheilt },
            { label: "Offen (Jahresende)", value: data.wunden.offen },
          ]}
        />
      </PrintSection>

      <PrintSection title="5. Personal" keepTogether>
        <PrintKV
          cols={2}
          items={[
            { label: "Aktive Pflegekräfte", value: data.personal.aktiv },
            { label: "Geleistete Schichten", value: data.personal.schichtenGeleistet },
            { label: "Fluktuation", value: data.personal.fluktuationProzent != null ? `${data.personal.fluktuationProzent.toFixed(1)}%` : "—" },
          ]}
        />
      </PrintSection>

      <PrintSection title="6. Qualitätsmaßnahmen" keepTogether>
        <PrintKV
          cols={2}
          items={[
            { label: "Pflegevisiten", value: data.qualitaet.pflegevisiten },
            { label: "DNQP-Assessments", value: data.qualitaet.dnqpAssessments },
            { label: "Ø Visiten-Bewertung", value: data.qualitaet.durchschnittBewertung != null ? `${data.qualitaet.durchschnittBewertung.toFixed(2)} / 5` : "—" },
          ]}
        />
      </PrintSection>

      <PrintSection title="7. Bewertung & Ausblick">
        <div
          style={{
            border: "1px solid #d8dedc",
            minHeight: "35mm",
            padding: "2.5mm",
            fontSize: "9.5pt",
            whiteSpace: "pre-wrap",
          }}
        >
          {"\u00A0"}
        </div>
      </PrintSection>

      <PrintSignatures
        slots={[
          { label: "Einrichtungsleitung", role: "Leitung", date: fmtDate(new Date()) },
          { label: "Pflegedienstleitung (PDL)", role: "PDL" },
          { label: "Qualitätsbeauftragte:r", role: "QM" },
        ]}
        note="Der Qualitätsjahresbericht wurde gemäß § 113b SGB XI erstellt und ist für die Heimaufsicht vorzuhalten."
      />

      <PrintFooter facilityName={ctx.facilityName} documentId={`QJB-${year}`} />
    </PrintPage>
  );
}
