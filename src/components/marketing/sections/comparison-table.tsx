/**
 * Vergleichs-Tabelle: CareAI vs. Medifox vs. Vivendi.
 */
import { Check, X } from "lucide-react";

type Row = {
  feature: string;
  careai: boolean | string;
  medifox: boolean | string;
  vivendi: boolean | string;
};

const rows: Row[] = [
  { feature: "Spracheingabe Deutsch inkl. Dialekte", careai: true, medifox: false, vivendi: false },
  { feature: "SIS-Automatik mit KI-Vorschlag", careai: true, medifox: false, vivendi: false },
  { feature: "EU AI Act ready (Hochrisiko-KI)", careai: true, medifox: false, vivendi: false },
  { feature: "Hosting ausschliesslich in EU", careai: true, medifox: true, vivendi: true },
  { feature: "FHIR + GDT + KIM", careai: true, medifox: "teilweise", vivendi: "teilweise" },
  { feature: "Transparentes Preismodell", careai: true, medifox: false, vivendi: false },
  { feature: "On-Premise-Option", careai: true, medifox: true, vivendi: true },
  { feature: "Angehoerigen-Portal mit Einwilligung", careai: true, medifox: false, vivendi: "Add-on" },
  { feature: "API-First Architektur", careai: true, medifox: false, vivendi: false },
  { feature: "Einfuehrung in unter 4 Wochen", careai: true, medifox: false, vivendi: false },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-primary" aria-label="Ja" />;
  if (value === false) return <X className="mx-auto h-5 w-5 text-muted-foreground/60" aria-label="Nein" />;
  return <span className="text-xs text-muted-foreground">{value}</span>;
}

export function ComparisonTable() {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Vergleich
        </div>
        <h2 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          Warum Einrichtungen zu CareAI wechseln.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Ehrlicher Vergleich mit den gaengigsten Systemen im DACH-Raum.
        </p>
      </div>

      <div className="mt-12 overflow-x-auto rounded-2xl border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="p-4 text-left font-medium">Funktion</th>
              <th className="p-4 text-center font-serif font-semibold text-primary">CareAI</th>
              <th className="p-4 text-center font-medium text-muted-foreground">Medifox</th>
              <th className="p-4 text-center font-medium text-muted-foreground">Vivendi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.feature} className="border-t border-border/60">
                <td className="p-4">{r.feature}</td>
                <td className="p-4 text-center">
                  <Cell value={r.careai} />
                </td>
                <td className="p-4 text-center">
                  <Cell value={r.medifox} />
                </td>
                <td className="p-4 text-center">
                  <Cell value={r.vivendi} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Stand: 2026-04. Basiert auf oeffentlich verfuegbaren Produkt-Informationen.
      </p>
    </section>
  );
}
