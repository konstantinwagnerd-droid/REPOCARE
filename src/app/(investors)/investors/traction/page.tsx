import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

export const metadata = { title: "Traction — CareAI Data Room" };

const pilots = [
  { name: "Pflegewohnhaus Wien III", beds: 120, since: "Aug 2025", status: "Aktiv", mrr: 2800 },
  { name: "Seniorenresidenz Doebling", beds: 86, since: "Okt 2025", status: "Aktiv", mrr: 2100 },
  { name: "Haus St. Klara (Graz)", beds: 64, since: "Jan 2026", status: "Aktiv", mrr: 2100 },
];

const lois = [
  { name: "Samariterbund Wien (4 Haeuser)", beds: 340, expected: "Q3 2026" },
  { name: "Pflegezentrum Muenchen-Pasing", beds: 180, expected: "Q4 2026" },
  { name: "Diakonie Hannover (2 Haeuser)", beds: 215, expected: "Q1 2027" },
  { name: "AT-Pflegeverbund Steiermark", beds: 430, expected: "Q1 2027" },
  { name: "Heim St. Florian (Linz)", beds: 75, expected: "Q2 2027" },
];

const pipeline = [
  { stage: "Discovery", deals: 18, beds: 2340 },
  { stage: "Qualified", deals: 11, beds: 1480 },
  { stage: "Demo", deals: 7, beds: 960 },
  { stage: "Proposal", deals: 4, beds: 520 },
  { stage: "LOI", deals: 5, beds: 1240 },
  { stage: "Closed Won", deals: 3, beds: 270 },
];

export default function TractionPage() {
  return (
    <div className="container py-10">
      <h1 className="font-serif text-3xl font-semibold">Traction</h1>
      <p className="mt-2 text-muted-foreground">
        3 aktive Pilot-Kunden in DACH, 5 LOIs, Pipeline mit 45+ qualifizierten Leads. Alle Daten Stand April 2026.
      </p>

      <section className="mt-8">
        <h2 className="mb-4 font-serif text-2xl font-semibold">Aktive Pilot-Kunden</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {pilots.map((p) => (
            <Card key={p.name}>
              <CardContent className="p-5">
                <div className="mb-2 flex items-center gap-2 text-sm text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{p.status}</span>
                </div>
                <p className="font-serif text-lg font-semibold">{p.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.beds} Betten · seit {p.since}</p>
                <p className="mt-3 font-mono text-sm">MRR: <strong>€ {p.mrr.toLocaleString("de-DE")}</strong></p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-serif text-2xl font-semibold">LOIs (unterzeichnet)</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left">
                <tr>
                  <th className="px-4 py-3">Einrichtung</th>
                  <th className="px-4 py-3">Betten</th>
                  <th className="px-4 py-3">Erwartetes Go-Live</th>
                </tr>
              </thead>
              <tbody>
                {lois.map((l) => (
                  <tr key={l.name} className="border-b border-border/60">
                    <td className="px-4 py-3">{l.name}</td>
                    <td className="px-4 py-3">{l.beds}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.expected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-serif text-2xl font-semibold">Pipeline</h2>
        <div className="grid gap-3 md:grid-cols-6">
          {pipeline.map((p) => (
            <Card key={p.stage}>
              <CardContent className="p-4">
                <Circle className="mb-2 h-4 w-4 text-primary" />
                <p className="text-xs uppercase text-muted-foreground">{p.stage}</p>
                <p className="mt-1 font-serif text-xl font-semibold">{p.deals}</p>
                <p className="text-xs text-muted-foreground">{p.beds} Betten</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-xl font-semibold">Case Study: Pflegewohnhaus Wien III</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>· Dokumentationszeit von 128 auf 71 Minuten pro Schicht reduziert (-45%)</li>
              <li>· Fehlerquote in Dokumentation 11,4% auf 3,2% (-72%)</li>
              <li>· Mitarbeiter-Zufriedenheit (NPS): -14 → +42</li>
              <li>· MD-Pruefung 03/2026: Note 1,4 (vorher 1,8)</li>
              <li>· Fluktuation Pflegepersonal: 28% → 14% Jahresrate</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
