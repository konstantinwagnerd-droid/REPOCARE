/**
 * Medikation mit AMTS-Check — Feature 5/10 (MUST)
 *
 * Arzneimittel-Therapie-Sicherheit nach §31a SGB V.
 * Checks: Interaktion / Doppelverordnung / Allergie-Kontra / Dosis / Polypharmazie.
 *
 * Quelle: ABDA-Datenbank, ifap/MMI, PRISCUS-Liste (potenziell inadaequate
 * Medikation im Alter).
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Pill, Shield } from "lucide-react";

const MOCK_ALERTS = [
  {
    severity: "kontraindiziert",
    kind: "Interaktion",
    medA: "Marcumar (Phenprocoumon)",
    medB: "Ibuprofen 600",
    resident: "Herr Meier, Zimmer 12",
    mechanism: "NSAR verstaerkt Blutungsrisiko unter Cumarin + verdraengt aus Plasmaeiweissbindung",
    recommendation: "Ibuprofen absetzen. Alternative: Paracetamol 500-1000 mg, max 3 g/Tag.",
  },
  {
    severity: "schwerwiegend",
    kind: "Interaktion",
    medA: "Amiodaron",
    medB: "Simvastatin 40",
    resident: "Frau Huber, Zimmer 18",
    mechanism: "Amiodaron hemmt CYP3A4 → Simvastatin-Spiegel steigt → Rhabdomyolyse-Risiko",
    recommendation: "Simvastatin auf max 20 mg reduzieren oder Umstellung auf Pravastatin.",
  },
  {
    severity: "schwerwiegend",
    kind: "PRISCUS",
    medA: "Diazepam (Benzodiazepin Langzeit)",
    medB: null,
    resident: "Frau Schneider, Zimmer 21",
    mechanism: "PRISCUS-Liste: Benzos-Langzeit bei >65 Jahren → Sturzgefahr, kognitive Stoerungen",
    recommendation: "Schrittweises Ausschleichen. Alternative: Kurzwirksames Lorazepam bei Bedarf.",
  },
  {
    severity: "moderat",
    kind: "Doppelverordnung",
    medA: "Pantoprazol 40",
    medB: "Omeprazol 20",
    resident: "Herr Weber, Zimmer 7",
    mechanism: "Zwei Protonenpumpenhemmer parallel verordnet",
    recommendation: "Arztruecksprache — eines absetzen.",
  },
  {
    severity: "moderat",
    kind: "Allergie-Kontra",
    medA: "Cotrimoxazol",
    medB: null,
    resident: "Frau Wagner, Zimmer 3",
    mechanism: "Dokumentierte Sulfonamid-Allergie in Stammdaten",
    recommendation: "Stoppen. Arzt kontaktieren — Alternative waehlen.",
  },
];

const SEVERITY_STYLE = {
  kontraindiziert: "bg-red-50 border-red-300 text-red-900 dark:bg-red-950/30 dark:text-red-100",
  schwerwiegend: "bg-orange-50 border-orange-300 text-orange-900 dark:bg-orange-950/30 dark:text-orange-100",
  moderat: "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100",
  geringfuegig: "bg-muted border-border text-foreground",
} as const;

export default function MedikationAmtsPage() {
  const stats = {
    total: MOCK_ALERTS.length,
    kontraindiziert: MOCK_ALERTS.filter((a) => a.severity === "kontraindiziert").length,
    schwerwiegend: MOCK_ALERTS.filter((a) => a.severity === "schwerwiegend").length,
  };
  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">AMTS — Arzneimittel-Therapie-Sicherheit</h1>
          <p className="mt-1 text-muted-foreground">
            Echtzeit-Check gegen ABDA/MMI + PRISCUS-Liste &middot; §31a SGB V.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="danger">{stats.kontraindiziert} kontraindiziert</Badge>
          <Badge className="bg-orange-500">{stats.schwerwiegend} schwerwiegend</Badge>
          <Badge variant="secondary">{stats.total} offen</Badge>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-5">
          <Shield className="h-8 w-8 text-primary" />
          <div><div className="text-2xl font-semibold">312</div><div className="text-xs text-muted-foreground">Medikamente gepruefte</div></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5">
          <AlertTriangle className="h-8 w-8 text-amber-500" />
          <div><div className="text-2xl font-semibold">{stats.total}</div><div className="text-xs text-muted-foreground">aktive Warnungen</div></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5">
          <Pill className="h-8 w-8 text-primary" />
          <div><div className="text-2xl font-semibold">7</div><div className="text-xs text-muted-foreground">Bewohner &gt; 5 Medikamente (Polypharmazie)</div></div>
        </CardContent></Card>
      </div>

      <div className="space-y-3">
        {MOCK_ALERTS.map((a, i) => (
          <Card key={i} className={`border-l-4 ${SEVERITY_STYLE[a.severity as keyof typeof SEVERITY_STYLE]}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {a.medA}{a.medB ? <> <span className="text-muted-foreground">&times;</span> {a.medB}</> : null}
                </span>
                <div className="flex gap-2">
                  <Badge variant="outline">{a.kind}</Badge>
                  <Badge variant="outline" className="uppercase">{a.severity}</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-xs opacity-80">{a.resident}</div>
              <div><span className="font-medium">Mechanismus: </span>{a.mechanism}</div>
              <div><span className="font-medium">Empfehlung: </span>{a.recommendation}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
