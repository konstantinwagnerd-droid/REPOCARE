/**
 * NANDA-I Pflegediagnosen (PES-Schema) — Feature 2/10 (MUST)
 *
 * Strukturierte Problem / Aetiologie / Symptome-Erfassung.
 * Gap-Close Vivendi / Medifox / Novatec.
 *
 * Quelle: NANDA International Taxonomie II (2021-2023), 267 anerkannte Diagnosen.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus } from "lucide-react";

// Haeufigste Diagnosen in stationaerer Altenpflege (Top-20 Auszug)
const DIAGNOSIS_LIBRARY = [
  { code: "00155", domain: "Sicherheit", label: "Sturzgefahr", priority: 1 },
  { code: "00249", domain: "Sicherheit", label: "Dekubitusrisiko", priority: 1 },
  { code: "00085", domain: "Bewegung", label: "Beeintraechtigte koerperliche Mobilitaet", priority: 2 },
  { code: "00002", domain: "Ernaehrung", label: "Unausgewogene Ernaehrung — weniger als erforderlich", priority: 2 },
  { code: "00028", domain: "Ernaehrung", label: "Dehydratationsgefahr", priority: 2 },
  { code: "00016", domain: "Ausscheidung", label: "Beeintraechtigte Urinausscheidung", priority: 3 },
  { code: "00011", domain: "Ausscheidung", label: "Obstipation", priority: 3 },
  { code: "00132", domain: "Komfort", label: "Akuter Schmerz", priority: 1 },
  { code: "00133", domain: "Komfort", label: "Chronischer Schmerz", priority: 2 },
  { code: "00108", domain: "Selbstpflege", label: "Selbstpflegedefizit — Koerperpflege", priority: 2 },
  { code: "00109", domain: "Selbstpflege", label: "Selbstpflegedefizit — sich kleiden", priority: 3 },
  { code: "00102", domain: "Selbstpflege", label: "Selbstpflegedefizit — Nahrungsaufnahme", priority: 2 },
  { code: "00095", domain: "Schlaf", label: "Gestoertes Schlafmuster", priority: 3 },
  { code: "00053", domain: "Psychosozial", label: "Soziale Isolation", priority: 3 },
  { code: "00148", domain: "Psychosozial", label: "Angst", priority: 2 },
  { code: "00128", domain: "Kognition", label: "Akute Verwirrtheit", priority: 1 },
  { code: "00129", domain: "Kognition", label: "Chronische Verwirrtheit", priority: 2 },
  { code: "00046", domain: "Haut", label: "Beeintraechtigte Hautintegritaet", priority: 2 },
  { code: "00004", domain: "Sicherheit", label: "Infektionsgefahr", priority: 2 },
  { code: "00206", domain: "Sicherheit", label: "Blutungsgefahr", priority: 2 },
];

const DOMAINS = Array.from(new Set(DIAGNOSIS_LIBRARY.map((d) => d.domain)));

export default function PflegediagnosenPage() {
  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Pflegediagnosen</h1>
          <p className="mt-1 text-muted-foreground">
            NANDA-I Taxonomie mit PES-Schema (Problem · Aetiologie · Symptome).
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary"><ClipboardList className="mr-1 h-3 w-3" /> NANDA-I 2021-2023</Badge>
          <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Neue Diagnose</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PES-Schema</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="font-semibold text-primary">P — Problem</div>
            <p className="mt-1 text-muted-foreground">NANDA-Diagnose-Titel, z.B. "Sturzgefahr".</p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-semibold text-primary">E — Aetiologie</div>
            <p className="mt-1 text-muted-foreground">Beeinflussende Faktoren: "aufgrund von reduzierter Muskelkraft + Benzodiazepin-Medikation".</p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-semibold text-primary">S — Symptome / Kennzeichen</div>
            <p className="mt-1 text-muted-foreground">Beobachtbare Zeichen: "Tinetti-Score 16, 2x Sturz in 4 Wochen".</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {DOMAINS.map((domain) => (
          <div key={domain}>
            <h2 className="mb-3 text-lg font-semibold">{domain}</h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {DIAGNOSIS_LIBRARY.filter((d) => d.domain === domain).map((d) => (
                <Card key={d.code} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-start justify-between gap-2 text-base">
                      <span>{d.label}</span>
                      <Badge variant={d.priority === 1 ? "danger" : d.priority === 2 ? "default" : "secondary"}>
                        Prio {d.priority}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    <div>Code NANDA-I: <span className="font-mono">{d.code}</span></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
