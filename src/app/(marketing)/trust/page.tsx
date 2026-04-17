import { PageHero } from "@/components/marketing/sections/page-hero";
import { SecondaryNav } from "@/components/marketing/sections/secondary-nav";
import { Sicherheit } from "@/design-system/illustrations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, ShieldCheck, Lock, FileText, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Trust Center — CareAI" };

const badges = [
  { label: "DSGVO", desc: "100% konform, DPA auf Anfrage" },
  { label: "EU AI Act", desc: "Hochrisiko-KI nach Anhang III" },
  { label: "ISO 27001", desc: "in Vorbereitung Q3 2026" },
  { label: "Hetzner Falkenstein", desc: "EN ISO 27001 Rechenzentrum" },
  { label: "100% Oekostrom", desc: "Hosting klimaneutral" },
  { label: "SOC 2 Type II", desc: "geplant 2027" },
];

const subprocessors = [
  {
    name: "Hetzner Online GmbH",
    purpose: "Primaeres Hosting (App, DB)",
    region: "Falkenstein, Deutschland",
    data: "Alle Fachdaten, Backups",
  },
  {
    name: "Anthropic Ireland Ltd.",
    purpose: "KI-Inferenz (Claude EU, kein Training)",
    region: "Irland (EU)",
    data: "Ephemere Prompts, keine Persistenz",
  },
  {
    name: "ElevenLabs EU Ltd.",
    purpose: "Text-to-Speech (optional)",
    region: "EU",
    data: "Auf Wunsch verarbeitete Textauszuege",
  },
  {
    name: "Resend B.V.",
    purpose: "Transaktionale E-Mails",
    region: "Niederlande (EU)",
    data: "E-Mail-Adressen, Versand-Logs",
  },
];

const documents = [
  { label: "Auftragsverarbeitungsvertrag (AVV)", size: "PDF, 180 KB" },
  { label: "Datenschutzfolgen-Abschaetzung (DSFA) Template", size: "PDF, 240 KB" },
  { label: "Sicherheits-White-Paper 2026", size: "PDF, 520 KB" },
  { label: "Technisch-organisatorische Massnahmen (TOMs)", size: "PDF, 160 KB" },
  { label: "Incident-Response-Plan", size: "PDF, 95 KB" },
];

const pentests = [
  {
    date: "Maerz 2026",
    scope: "Gesamt-Anwendung + API",
    partner: "Cure53 (unabhaengig)",
    result: "Keine kritischen Findings; 2 mittlere (behoben innerhalb 14 Tagen)",
  },
  {
    date: "September 2025",
    scope: "API + Auth-Flow",
    partner: "SEC Consult (unabhaengig)",
    result: "Keine kritischen Findings; 1 mittleres (behoben)",
  },
];

export default function TrustPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust Center"
        title="Vertrauen ist die Grundlage unseres Produkts."
        description="CareAI verarbeitet die sensibelsten Daten in einer Einrichtung. Hier finden Sie alles, was Sie fuer Ihre Pruefung, Ihre DSB und Ihren Vorstand brauchen."
        illustration={<Sicherheit className="h-72 w-72" />}
        actions={
          <>
            <Button asChild variant="accent" size="lg">
              <Link href="/kontakt">Mit DSB sprechen</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="mailto:security@careai.app">security@careai.app</a>
            </Button>
          </>
        }
      />
      <SecondaryNav active="/trust" />

      {/* Badges */}
      <section className="container py-16">
        <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Zertifizierungen & Posture</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {badges.map((b) => (
            <Card key={b.label}>
              <CardContent className="flex items-start gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-semibold">{b.label}</div>
                  <div className="text-sm text-muted-foreground">{b.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pentests */}
      <section className="bg-muted/30">
        <div className="container py-16">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Penetrationstest-Historie</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Zweimal jaehrlich extern getestet. Zusammenfassung oeffentlich — vollstaendiger Bericht auf Anfrage unter NDA.
          </p>
          <div className="mt-8 space-y-4">
            {pentests.map((p) => (
              <Card key={p.date}>
                <CardContent className="grid gap-4 p-6 md:grid-cols-4">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Datum</div>
                    <div className="mt-1 font-medium">{p.date}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Scope</div>
                    <div className="mt-1">{p.scope}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Partner</div>
                    <div className="mt-1">{p.partner}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Ergebnis</div>
                    <div className="mt-1 text-sm">{p.result}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subprocessors */}
      <section className="container py-16">
        <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Unterauftragsverarbeiter</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Wir sind transparent: Jeder Dienstleister mit Zugriff auf Fachdaten wird hier gelistet. Ueber Aenderungen informieren wir mit 30 Tagen Vorlauf.
        </p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-4 text-left font-medium">Dienstleister</th>
                <th className="p-4 text-left font-medium">Zweck</th>
                <th className="p-4 text-left font-medium">Standort</th>
                <th className="p-4 text-left font-medium">Datenkategorien</th>
              </tr>
            </thead>
            <tbody>
              {subprocessors.map((s) => (
                <tr key={s.name} className="border-t border-border/60">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4">{s.purpose}</td>
                  <td className="p-4">{s.region}</td>
                  <td className="p-4 text-muted-foreground">{s.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Documents */}
      <section className="bg-muted/30">
        <div className="container py-16">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Compliance-Dokumente</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {documents.map((d) => (
              <Card key={d.label}>
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-medium">{d.label}</div>
                      <div className="text-xs text-muted-foreground">{d.size}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/kontakt">
                      <Download className="mr-1 h-4 w-4" /> Anfordern
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DSB + Breach + SLA */}
      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <Lock className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-serif text-lg font-semibold">Externer Datenschutzbeauftragter</h3>
              <div className="mt-2 text-sm text-muted-foreground">
                Dr. Julia Weissenbacher, LL.M.
                <br />
                Kanzlei Weissenbacher & Partner, Wien
                <br />
                <a href="mailto:dsb@careai.app" className="text-primary hover:underline">
                  dsb@careai.app
                </a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Clock className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-serif text-lg font-semibold">Breach Notification</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Meldung innerhalb <strong>24 Stunden</strong> an Tenant-Admin, maximal 72 Stunden an Aufsichtsbehoerde — gemaess Art. 33 DSGVO.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-serif text-lg font-semibold">SLA</h3>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                <li>99,5% Uptime (Pro), 99,9% (Enterprise)</li>
                <li>24h Response bei kritischen Bugs</li>
                <li>72h Response bei Feature-Anfragen</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container pb-20">
        <Card className="bg-gradient-to-br from-primary-700 to-primary-900 text-primary-foreground">
          <CardContent className="flex flex-col items-start gap-4 p-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-serif text-2xl font-semibold">Haben Sie noch Fragen?</h3>
              <p className="mt-2 text-primary-100">Unser Team antwortet meist innerhalb eines Werktages.</p>
            </div>
            <Button asChild variant="accent" size="lg">
              <a href="mailto:security@careai.app">
                <ExternalLink className="mr-1 h-4 w-4" /> security@careai.app
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
