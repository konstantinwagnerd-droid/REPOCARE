import { PageHero } from "@/components/marketing/sections/page-hero";
import { SecondaryNav } from "@/components/marketing/sections/secondary-nav";
import { Sicherheit } from "@/design-system/illustrations";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, KeyRound, ShieldCheck, Server, Users, FileCheck, Database, AlertTriangle } from "lucide-react";

export const metadata = { title: "Sicherheit — CareAI" };

const pillars = [
  {
    icon: Lock,
    title: "Verschluesselung",
    points: ["AES-256 at rest", "TLS 1.3 in transit", "Client-side Encryption fuer Diktat-Rohdaten"],
  },
  {
    icon: FileCheck,
    title: "Audit-Trail",
    points: ["Jede Aenderung signiert", "90 Tage Hot-Retention", "Unveraenderbarer Write-Ahead-Log"],
  },
  {
    icon: Users,
    title: "Zugriffskontrolle",
    points: ["RBAC mit 6 Rollen", "MFA erzwingbar", "Session-Timeout konfigurierbar"],
  },
  {
    icon: Database,
    title: "Backup-Strategie",
    points: ["Taeglich verschluesselt", "2 EU-Standorte", "Point-in-Time-Recovery bis 7 Tage"],
  },
  {
    icon: Server,
    title: "Hosting",
    points: ["Hetzner Falkenstein", "ISO 27001 Rechenzentrum", "100% Oekostrom"],
  },
  {
    icon: AlertTriangle,
    title: "Incident Response",
    points: ["24/7 On-Call-Rotation", "RTO < 4h, RPO < 15min", "Postmortems oeffentlich"],
  },
  {
    icon: KeyRound,
    title: "Secret-Management",
    points: ["HashiCorp Vault", "Rotierende Credentials", "Keine Secrets in Code"],
  },
  {
    icon: ShieldCheck,
    title: "Security Hygiene",
    points: ["Wekly Dependency Scans", "Pre-Commit-Hooks", "SAST + DAST in CI"],
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Sicherheit"
        title="Sicherheit ist kein Feature. Sie ist die Architektur."
        description="Defense-in-Depth von Tag 1: Verschluesselung, Isolation, Audit, Backup, Monitoring. Wir behandeln Pflegedaten so wie Banken Transaktionsdaten behandeln."
        illustration={<Sicherheit className="h-72 w-72" />}
      />
      <SecondaryNav active="/security" />

      <section className="container py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <Card key={p.title}>
              <CardContent className="p-6">
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="font-serif text-lg font-semibold">{p.title}</h3>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/30">
        <div className="container py-16">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Responsible Disclosure</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Sie haben eine Schwachstelle gefunden? Wir danken Ihnen — ernsthaft. Schreiben Sie an{" "}
            <a href="mailto:security@careai.app" className="text-primary hover:underline">
              security@careai.app
            </a>{" "}
            (PGP-Key auf Trust Center). Wir bestaetigen innerhalb 24h, beheben kritische Findings innerhalb 14 Tagen und
            erwaehnen Sie auf Wunsch im Hall of Fame.
          </p>
        </div>
      </section>
    </>
  );
}
