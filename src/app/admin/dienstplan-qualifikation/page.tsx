/**
 * Dienstplan mit Qualifikations-Check + ArbZG-Compliance — Feature 4/10 (MUST)
 *
 * ATOSS / Medifox Dienstplan-Parity:
 * - Min. Fachkraefte/Hilfskraefte/Azubis pro Schicht
 * - ArbZG §3 (max 10h/Tag), §5 (11h Ruhe), §9 Sonntagsruhe
 * - Qualifikations-Matching DGKP/PFA/PA (AT) bzw. examiniert/Helfer/Azubi (DE)
 *
 * Quelle: ArbZG (DE), AZG (AT); ATOSS Medical Solutions Produktinfo.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, UserCheck } from "lucide-react";

const SHIFTS = [
  {
    day: "Mo 22.04.",
    shift: "Frueh 06:00-14:00",
    station: "A",
    required: { fach: 2, hilf: 1, azubi: 0 },
    staffed: [
      { name: "Maria Schmidt", role: "DGKP/examiniert" },
      { name: "Julia Bauer", role: "DGKP/examiniert" },
      { name: "Tom Weber", role: "Helfer" },
    ],
    ok: true,
    warnings: [],
  },
  {
    day: "Mo 22.04.",
    shift: "Spaet 14:00-22:00",
    station: "A",
    required: { fach: 2, hilf: 1, azubi: 0 },
    staffed: [
      { name: "Anna Huber", role: "DGKP/examiniert" },
      { name: "Peter Gruber", role: "Helfer" },
    ],
    ok: false,
    warnings: ["UNTERDECKUNG: 1 Fachkraft fehlt", "Abdeckung 2/3 Min-Personal"],
  },
  {
    day: "Mo 22.04.",
    shift: "Nacht 22:00-06:00",
    station: "A",
    required: { fach: 1, hilf: 0, azubi: 0 },
    staffed: [
      { name: "Markus Wagner", role: "PFA/Helfer" },
    ],
    ok: false,
    warnings: ["FEHLQUALIFIKATION: Nacht benoetigt DGKP/examiniert, nicht PFA/Helfer"],
  },
  {
    day: "Di 23.04.",
    shift: "Frueh 06:00-14:00",
    station: "A",
    required: { fach: 2, hilf: 1, azubi: 0 },
    staffed: [
      { name: "Markus Wagner", role: "PFA/Helfer" },
      { name: "Maria Schmidt", role: "DGKP/examiniert" },
      { name: "Julia Bauer", role: "DGKP/examiniert" },
    ],
    ok: false,
    warnings: ["ArbZG §5: Markus Wagner hat Mo 22-06 Nacht → Ruhezeit < 11h bis Di 06:00"],
  },
];

export default function DienstplanQualifikationPage() {
  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Dienstplan &mdash; Qualifikations- &amp; ArbZG-Check</h1>
          <p className="mt-1 text-muted-foreground">Live-Kontrolle: Mindestbesetzung, Fachkraftquote, Ruhezeiten.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary"><UserCheck className="mr-1 h-3 w-3" /> 24 Schichten KW17</Badge>
          <Badge variant="danger">3 Warnungen</Badge>
          <Button size="sm">Auto-Loesen</Button>
        </div>
      </div>

      <div className="space-y-3">
        {SHIFTS.map((s, i) => (
          <Card key={i} className={`border-l-4 ${s.ok ? "border-l-green-500" : "border-l-red-500"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span>{s.day} &middot; {s.shift} &middot; Station {s.station}</span>
                {s.ok ? <Badge variant="secondary"><CheckCircle2 className="mr-1 h-3 w-3" /> OK</Badge>
                      : <Badge variant="danger"><AlertTriangle className="mr-1 h-3 w-3" /> {s.warnings.length} Warnung{s.warnings.length === 1 ? "" : "en"}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                {s.staffed.map((p) => (
                  <Badge key={p.name} variant="outline">{p.name} &middot; {p.role}</Badge>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                Bedarf: {s.required.fach} Fach / {s.required.hilf} Hilf / {s.required.azubi} Azubi &middot; Ist: {s.staffed.length} gesamt
              </div>
              {s.warnings.length > 0 && (
                <ul className="space-y-1 rounded-md bg-red-50 p-2 text-xs text-red-900 dark:bg-red-950/20 dark:text-red-100">
                  {s.warnings.map((w) => <li key={w}>&bull; {w}</li>)}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Regel-Basis</CardTitle></CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          <ul className="list-disc space-y-1 pl-5">
            <li>ArbZG §3 (DE) / AZG §9 (AT): max. 10h/Tag, im Schnitt 8h/Tag</li>
            <li>ArbZG §5 / AZG §12: mind. 11h Ruhezeit zwischen Schichten (8h mit Ausgleich in Pflege moeglich)</li>
            <li>Fachkraftquote stationaere Pflege: 50% (Bundeslaender variieren 40-60%)</li>
            <li>Nacht-Schicht: mind. 1 examinierte Kraft (DE) / DGKP (AT) pro Station</li>
            <li>Jugendarbeitsschutz (JArbSchG): Azubis &lt; 18 keine Nacht, max. 8h/Tag</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
