import { PageHero } from "@/components/marketing/sections/page-hero";
import { SecondaryNav } from "@/components/marketing/sections/secondary-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rss, Mail } from "lucide-react";

export const metadata = { title: "Changelog — CareAI" };

type Release = {
  version: string;
  date: string;
  badge: "Feature" | "Verbesserung" | "Sicherheit" | "Fix";
  title: string;
  items: string[];
};

const releases: Release[] = [
  {
    version: "v1.3.0",
    date: "2026-04-15",
    badge: "Feature",
    title: "SIS-Automatik Beta fuer alle Tenants",
    items: [
      "KI schlaegt passende Themenfelder aus Diktat vor (Akzeptanz oder Anpassung in einem Klick)",
      "Risiko-Matrix R1–R7 wird bei Aenderungen automatisch neu bewertet",
      "Prueferexport enthaelt jetzt vollstaendige KI-Entscheidungslogs",
    ],
  },
  {
    version: "v1.2.5",
    date: "2026-03-28",
    badge: "Sicherheit",
    title: "Pentest-Findings behoben, TLS-1.3 erzwungen",
    items: [
      "Cure53-Audit abgeschlossen (keine kritischen Findings)",
      "CSP-Header verschaerft",
      "Rate-Limiting fuer Auth-Endpoints",
    ],
  },
  {
    version: "v1.2.0",
    date: "2026-03-10",
    badge: "Feature",
    title: "Angehoerigen-Portal Launch",
    items: [
      "Tablet- und Mobile-optimierte Ansicht fuer Familien",
      "Konsent-basierte Inhalte (Wohlbefinden, Aktivitaeten, Nachrichten)",
      "Push-Benachrichtigungen bei wichtigen Ereignissen",
    ],
  },
  {
    version: "v1.1.2",
    date: "2026-02-21",
    badge: "Verbesserung",
    title: "Spracheingabe: +27% Dialekterkennung",
    items: [
      "Verbessertes Model fuer Tirolerisch, Steirisch, Bayrisch",
      "Kontextbezogene Fachbegriffe aus Pflege-Taxonomie",
      "Hintergrundrauschen-Filter (Stationsflur)",
    ],
  },
  {
    version: "v1.1.0",
    date: "2026-01-30",
    badge: "Feature",
    title: "FHIR R4 + GDT Integration",
    items: [
      "Bidirektionaler FHIR-Austausch mit ELGA (AT)",
      "GDT fuer Blutdruck, SpO2, Waagen",
      "Neue Einstellungsseite fuer Integrationen",
    ],
  },
  {
    version: "v1.0.0",
    date: "2026-01-15",
    badge: "Feature",
    title: "General Availability",
    items: ["CareAI wird General Available", "SLA 99.5% (Pro) / 99.9% (Enterprise) aktiviert", "DSGVO-AVV bereit"],
  },
  {
    version: "v0.9.0",
    date: "2025-12-01",
    badge: "Feature",
    title: "Beta Start",
    items: ["Pilot in 3 Einrichtungen (Wien, Graz, Muenchen)", "Kernfeatures: SIS, Doku, Maßnahmen, MAR"],
  },
];

function BadgeColor({ kind }: { kind: Release["badge"] }) {
  const map = {
    Feature: "bg-primary/10 text-primary",
    Verbesserung: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    Sicherheit: "bg-red-500/10 text-red-700 dark:text-red-300",
    Fix: "bg-muted text-muted-foreground",
  } as const;
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[kind]}`}>{kind}</span>;
}

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        eyebrow="Changelog"
        title="Was sich bei CareAI geaendert hat."
        description="Transparente Release-Notes. Wir schreiben jede Aenderung nachvollziehbar auf — auch die, die wir nachts um 3 Uhr nicht gerne haetten machen muessen."
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <a href="/changelog.rss">
                <Rss className="mr-1 h-4 w-4" /> RSS-Feed
              </a>
            </Button>
            <Button variant="accent" size="sm" asChild>
              <a href="mailto:subscribe@careai.app?subject=Changelog-Abo">
                <Mail className="mr-1 h-4 w-4" /> Per E-Mail folgen
              </a>
            </Button>
          </>
        }
      />
      <SecondaryNav active="/changelog" />

      <section className="container py-14">
        <ol className="relative space-y-8 border-l border-border/60 pl-8">
          {releases.map((r) => (
            <li key={r.version} className="relative">
              <span className="absolute -left-[42px] top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-background">
                <span className="h-2 w-2 rounded-full bg-primary" />
              </span>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm text-muted-foreground">{r.version}</span>
                    <time className="text-xs text-muted-foreground">{r.date}</time>
                    <BadgeColor kind={r.badge} />
                  </div>
                  <h3 className="mt-2 font-serif text-xl font-semibold">{r.title}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {r.items.map((it) => (
                      <li key={it} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
