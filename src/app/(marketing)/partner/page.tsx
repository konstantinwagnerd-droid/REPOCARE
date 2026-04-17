import Link from "next/link";
import {
  Handshake, ArrowRight, Users, Workflow, PlugZap, Briefcase,
  TrendingUp, BookOpen, Megaphone, LifeBuoy, Check, Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CommissionCalculator } from "@/components/partner/CommissionCalculator";
import { PartnerApplicationForm } from "@/components/partner/PartnerApplicationForm";

export const metadata = {
  title: "Partner-Programm | CareAI",
  description:
    "Werde CareAI-Partner: Reseller, Implementation, Integration oder Consulting. Bis 20 % Provision, Co-Marketing, Schulungen.",
};

const TIERS = [
  {
    icon: Users,
    title: "Reseller",
    badge: "20 % Provision",
    desc: "Ihr verkauft CareAI, wir übernehmen Lieferung und Support.",
    features: ["CareAI-Lizenz im eigenen Namen abrechnen", "Dedizierter Partner-Manager", "Co-Branded Collateral", "Protected Deals"],
  },
  {
    icon: Workflow,
    title: "Implementation",
    badge: "15 % Provision",
    desc: "Ihr betreibt das Onboarding bei Einrichtungen.",
    features: ["Schulung der Pflegekräfte", "Daten-Migration mit CareAI-Tools", "Go-Live Support", "Zusätzliche Implementierungs-Revenue"],
  },
  {
    icon: PlugZap,
    title: "Integration",
    badge: "10 % Provision",
    desc: "Ihr verbindet CareAI mit anderen Systemen (Dienstplan, ERP, DMS).",
    features: ["Early-Access zu APIs", "Dokumentierte Webhooks", "Technisches Partner-Enablement", "Joint Go-To-Market"],
  },
  {
    icon: Briefcase,
    title: "Consulting",
    badge: "15 % Provision",
    desc: "Ihr beratet Träger strategisch — CareAI ist Teil der Empfehlung.",
    features: ["Zugriff auf Benchmarks & Whitepapers", "Speaker-Slots auf CareAI-Events", "Dedizierte Analyst-Briefings", "Strategische Roadmap-Previews"],
  },
];

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Wiederkehrende Provisionen",
    desc: "12 Monate Commission pro Deal. Einmal verkaufen, 12 Monate verdienen.",
  },
  {
    icon: Megaphone,
    title: "Co-Marketing",
    desc: "Gemeinsame Webinare, Case-Studies, Konferenz-Auftritte. Ihr werdet sichtbar.",
  },
  {
    icon: BookOpen,
    title: "Schulungen & Zertifizierung",
    desc: "CareAI Certified Partner — online, selbstbestimmt, mit offiziellem Abschluss.",
  },
  {
    icon: LifeBuoy,
    title: "Direkt-Support",
    desc: "Eigener Slack-Channel, Partner-Telefon, 1-Werktag-SLA.",
  },
];

const STEPS = [
  { n: 1, title: "Bewerbung", desc: "Du füllst das Formular aus. 5 Minuten." },
  { n: 2, title: "Gespräch", desc: "Wir schauen gemeinsam, ob es passt. Telefon oder Video." },
  { n: 3, title: "Onboarding + Zertifizierung", desc: "Online-Kurs + Abschluss-Quiz. 3-4 Stunden verteilt über 2 Wochen." },
  { n: 4, title: "Go-Live", desc: "Dein Partner-Dashboard wird freigeschaltet. Du kannst verkaufen." },
];

const MOCK_PARTNERS = [
  "Müller IT-Systemhaus",
  "Pflegenetz Consulting",
  "DigiHaus Integrationen",
  "Seniorennet Österreich",
  "HealthFlow Systems",
  "DACH Pflegeberatung",
  "MedConnect GmbH",
  "CareStack Consulting",
];

export default function PartnerMarketingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="container grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <Badge variant="outline" className="mb-5 gap-1.5">
              <Handshake className="size-3.5" />
              Partner-Programm
            </Badge>
            <h1 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
              Wachst mit CareAI.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Systemhäuser, Implementation-Partner, Integrationsbauer:innen und
              Consulting-Firmen: CareAI öffnet euch den DACH-Pflegemarkt.
              Bis 20 % Provision, wiederkehrend, 12 Monate je Deal.
              Transparente Konditionen, keine versteckten Klauseln.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="#bewerbung">Partner werden <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/partner/login">Ich bin schon Partner</Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Card>
              <CardContent className="space-y-4 p-6">
                <h2 className="font-serif text-xl font-semibold">Kurz auf den Punkt</h2>
                <ul className="space-y-3 text-sm">
                  {[
                    "Bis 20 % Provision, 12 Monate wiederkehrend",
                    "Dedizierter Partner-Manager ab Tag 1",
                    "Co-Marketing-Assets, Playbooks, Sales-Decks",
                    "Offizielle Zertifizierung mit Abschluss-Zeugnis",
                    "Protected-Deal-Registrierung",
                    "1-Werktag-SLA auf Partner-Support",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="typen" className="container py-16">
        <h2 className="font-serif text-2xl font-semibold">Vier Wege, Partner zu werden</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Du bist Softwarehaus? Systemhaus? Berater:in? Für jedes Profil haben wir ein Modell.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TIERS.map((t) => {
            const Icon = t.icon;
            return (
              <Card key={t.title} className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <Badge variant="outline">{t.badge}</Badge>
                  </div>
                  <h3 className="font-serif text-xl font-semibold">{t.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                  <ul className="mt-auto space-y-2 text-sm">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-muted/20">
        <div className="container py-16">
          <h2 className="font-serif text-2xl font-semibold">Eure Vorteile im Detail</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {BENEFITS.map((b) => (
              <Card key={b.title}>
                <CardContent className="flex gap-4 p-5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <b.icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-2xl font-semibold">Provisions-Rechner</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Zieh die Regler — das Modell ist transparent, nichts Kleingedrucktes.
        </p>
        <div className="mt-8">
          <CommissionCalculator />
        </div>
      </section>

      <section className="border-t border-border bg-muted/20">
        <div className="container py-16">
          <h2 className="font-serif text-2xl font-semibold">Der Onboarding-Prozess</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Vier Schritte, keiner davon ist ein Hindernis.</p>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n}>
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col gap-3 p-5">
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                      {s.n}
                    </span>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-2xl font-semibold">Unsere Partner</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Auswahl aktiver CareAI-Partner in DACH.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {MOCK_PARTNERS.map((p) => (
            <div
              key={p}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4"
            >
              <Building2 className="size-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">{p}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="bewerbung" className="border-t border-border bg-muted/20">
        <div className="container py-16">
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold">Bewerbung</h2>
              <p className="mt-2 text-muted-foreground">
                Wir lesen jede Bewerbung persönlich und antworten binnen 2 Arbeitstagen.
              </p>
            </div>
            <PartnerApplicationForm />
          </div>
        </div>
      </section>
    </>
  );
}
