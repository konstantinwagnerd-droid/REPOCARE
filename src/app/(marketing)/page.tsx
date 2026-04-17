import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic, ShieldCheck, Sparkles, HeartPulse, FileText, ClipboardCheck, Users, BrainCircuit,
  Lock, Server, Globe2, ArrowRight, Check, Quote, Clock, TrendingUp,
} from "lucide-react";
import { LogoWall } from "@/components/marketing/sections/logo-wall";
import { ComparisonTable } from "@/components/marketing/sections/comparison-table";
import { TrustRow } from "@/components/marketing/sections/trust-row";
import { StickyCta } from "@/components/marketing/sections/sticky-cta";

const features = [
  { icon: Mic, title: "Spracheingabe statt Tippen", desc: "Pflegekräfte diktieren, CareAI strukturiert. 67% weniger Dokumentationszeit pro Schicht." },
  { icon: BrainCircuit, title: "SIS intelligent vorbefüllt", desc: "Strukturierte Informationssammlung mit 6 Themenfeldern und Risiko-Matrix R1–R7 — automatisch vorgeschlagen." },
  { icon: ClipboardCheck, title: "Maßnahmenplan automatisch", desc: "Aus SIS und Tagesberichten generiert CareAI individuelle, MDK-konforme Maßnahmen." },
  { icon: HeartPulse, title: "Vitalwerte & Risiken im Blick", desc: "Sturz, Dekubitus, Delir — prädiktive Scores mit Trend-Pfeil und Eskalationshinweis." },
  { icon: FileText, title: "Schichtbericht in 30 Sekunden", desc: "KI fasst alle relevanten Ereignisse für die Übergabe zusammen — nie wieder Zettelwirtschaft." },
  { icon: ShieldCheck, title: "MDK-sicher & revisionsfest", desc: "Jede Änderung im Audit-Log. Begründungspflicht erfüllt. Prüfer-Export per Knopfdruck." },
] as const;

const impacts = [
  { sdg: "SDG 3", title: "Gesundheit & Wohlergehen", desc: "Mehr Zeit am Bewohner." },
  { sdg: "SDG 5", title: "Geschlechtergerechtigkeit", desc: "Pflege ist zu 80% weiblich — wir entlasten." },
  { sdg: "SDG 8", title: "Würdige Arbeit", desc: "Weniger Burnout, mehr Sinn." },
  { sdg: "SDG 10", title: "Ungleichheiten reduzieren", desc: "Auch für kleine Träger leistbar." },
];

const pricing = [
  { name: "Starter", price: 299, seats: "bis 25 Plätze", tag: "Für kleine Sozialträger", features: ["Alle Kernfunktionen", "Spracheingabe unbegrenzt", "SIS, Maßnahmen, MAR", "E-Mail Support", "DACH-Hosting"] },
  { name: "Professional", price: 599, seats: "bis 80 Plätze", tag: "Beliebteste Wahl", highlight: true, features: ["Alles aus Starter", "Angehörigen-Portal", "Erweiterte Risiko-Scores", "Schicht- & Dienstplan", "API-Schnittstellen", "Priorisierter Support"] },
  { name: "Enterprise", price: 999, seats: "ab 80 Plätze", tag: "Mehrere Häuser & on-prem", features: ["Alles aus Professional", "On-Premise Option", "SSO / SAML", "Dedizierter CSM", "SLA 99.9%", "Custom KI-Modelle"] },
];

const testimonials = [
  { name: "Maria Kreuzer", role: "Pflegedienstleitung, Seniorenresidenz Hietzing", quote: "Wir schreiben nicht mehr — wir pflegen. Die Dokumentation ist Nebensache geworden. Genau so soll es sein." },
  { name: "Dr. Ahmed Sadeghi", role: "Geschäftsführung, Pflege Aktiv Süd", quote: "Nach sechs Wochen Pilot hatten wir pro Schicht 90 Minuten mehr Zeit. Unsere Fluktuation ist seitdem um 21% gesunken." },
  { name: "Jana Hofer", role: "DGKP, Station C3", quote: "Endlich eine Software, die mit uns denkt, nicht gegen uns. Die Spracheingabe versteht sogar meinen Tiroler Dialekt." },
];

const faqs = [
  { q: "Ist CareAI DSGVO-konform?", a: "Ja. Server stehen in Falkenstein (Hetzner, Deutschland). Ende-zu-Ende verschlüsselt. AV-Vertrag und TOMs vorhanden. Keine Datenweitergabe in Drittländer." },
  { q: "Erfüllt ihr den EU AI Act?", a: "CareAI fällt in die Kategorie „Hochrisiko-KI im Gesundheitsbereich“ — wir erfüllen alle Anforderungen: Risikomanagement-System, Transparenzpflichten, menschliche Aufsicht. Dokumentation auf Anfrage." },
  { q: "Wie lange dauert die Einführung?", a: "In der Regel 2–4 Wochen. Wir übernehmen Datenimport aus Vivendi, MediFox, Senso oder Excel. Schulung vor Ort oder remote inklusive." },
  { q: "Funktioniert das auch mit Handschuhen auf Tablets?", a: "Ja. Alle Bedienelemente sind mindestens 44×44 Pixel. Spracheingabe macht das Tippen ohnehin meistens überflüssig." },
  { q: "Was ist mit Datensicherheit bei Ausfall?", a: "Tägliche verschlüsselte Backups an zwei EU-Standorten. Offline-Modus für kritische Funktionen. SLA 99,9% Verfügbarkeit bei Enterprise." },
  { q: "Können Angehörige zu viel sehen?", a: "Nein. Angehörige sehen nur bewusst freigegebene Inhalte: Wohlbefindens-Score, Aktivitäten (bei Einwilligung), Nachrichten. Keine medizinischen Detaildaten." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 dot-pattern opacity-60" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-gradient-to-b from-primary-50/60 via-background to-background" />
        <div className="container grid gap-12 py-20 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-7">
            <Badge variant="outline" className="mb-6 gap-1.5 rounded-full border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="h-3 w-3" /> Neu: SIS-Automatik in Beta
            </Badge>
            <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Mehr Zeit für Menschen.<br />
              <span className="text-primary-700">Weniger für Papierkram.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              CareAI ist die KI-gestützte Pflegedokumentation für Österreich, Deutschland und die Schweiz.
              Spracheingabe, SIS-Automatik, Maßnahmenplanung — in einer ruhig gestalteten Oberfläche,
              die Pflegekräfte wirklich gerne nutzen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl" variant="accent">
                <Link href="/signup">Demo vereinbaren <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/login">Live-Demo öffnen</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> DSGVO-konform</div>
              <div className="flex items-center gap-2"><Server className="h-4 w-4 text-primary" /> Hosting in DE</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> EU AI Act bereit</div>
              <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-primary" /> Deutsch · AT · DE · CH</div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 text-primary-foreground">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
                  <Mic className="h-3.5 w-3.5" /> Live-Diktat, gerade eben
                </div>
                <p className="font-serif text-xl leading-relaxed">
                  „Frau Berger hat heute gut gefrühstückt, Blutdruck 132 auf 78, keine Schmerzen,
                  Wunde am rechten Unterschenkel zeigt erste Granulation. Mobilisation mit Gehhilfe
                  hat 15 Minuten geklappt.“
                </p>
                <div className="mt-6 rounded-xl bg-primary-900/60 p-4 text-sm">
                  <div className="mb-2 flex items-center justify-between opacity-80">
                    <span>CareAI strukturiert</span>
                    <Badge variant="outline" className="border-accent/50 text-accent">Vorschlag</Badge>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-accent shrink-0" /> Nahrungsaufnahme: angemessen</li>
                    <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-accent shrink-0" /> RR 132/78 mmHg erfasst</li>
                    <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-accent shrink-0" /> Wunde UE rechts: Grad II, Granulation</li>
                    <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-accent shrink-0" /> Mobilisation: 15 min, Gehhilfe</li>
                    <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-accent shrink-0" /> SIS-Zuordnung: Themenfeld 2, 3</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* KPI STRIP */}
      <section className="border-y border-border/60 bg-muted/40">
        <div className="container grid gap-8 py-12 md:grid-cols-4">
          {[
            { icon: Clock, value: "67%", label: "weniger Dokuzeit pro Schicht" },
            { icon: TrendingUp, value: "+21%", label: "Mitarbeiterbindung nach 6 Monaten" },
            { icon: ShieldCheck, value: "100%", label: "MDK-konforme SIS-Einträge" },
            { icon: Users, value: "12k+", label: "Bewohner:innen dokumentiert" },
          ].map((k) => (
            <div key={k.label} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <k.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-serif text-3xl font-semibold">{k.value}</div>
                <div className="text-sm text-muted-foreground">{k.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LOGO WALL */}
      <LogoWall />

      {/* FEATURES */}
      <section id="features" className="container py-24">
        <div className="mb-14 max-w-2xl">
          <Badge variant="secondary" className="mb-3">Funktionen</Badge>
          <h2 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            Gemacht von Menschen, die verstehen was Pflege braucht.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Co-entwickelt mit zwei Pilot-Einrichtungen in Wien und München. Keine Feature-Flut — nur das, was in der Schicht wirklich zählt.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="transition-shadow hover:shadow-md">
              <CardContent className="p-7">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mb-2 font-serif text-xl font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="bg-primary-900 text-primary-foreground">
        <div className="container grid gap-14 py-24 lg:grid-cols-2">
          <div>
            <Badge variant="outline" className="mb-4 border-white/20 bg-white/5 text-white">Sozialer Impact</Badge>
            <h2 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
              Pflegenotstand ist lösbar — wenn Technik entlastet, statt zu belasten.
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              In DACH fehlen bis 2030 rund <strong>500.000 Pflegekräfte</strong>. Gleichzeitig verbringen Pflegende heute bis zu 35% ihrer Arbeitszeit mit Dokumentation.
              CareAI gibt einen Teil dieser Zeit zurück — dorthin, wo sie hingehört.
            </p>
            <Button asChild variant="accent" size="lg" className="mt-6">
              <Link href="/signup">Teil der Lösung werden</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {impacts.map((i) => (
              <Card key={i.sdg} className="border-white/10 bg-white/5 text-primary-foreground backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">{i.sdg}</div>
                  <div className="font-serif text-lg font-semibold">{i.title}</div>
                  <div className="mt-1 text-sm text-primary-100">{i.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="preise" className="container py-24">
        <div className="mb-14 text-center">
          <Badge variant="secondary" className="mb-3">Preise</Badge>
          <h2 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">Auch für kleine Sozialträger leistbar.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Transparent pro Einrichtung, keine versteckten Nutzergebühren. Jede Sekunde, die eine Pflegekraft gewinnt, ist die Investition wert.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {pricing.map((p) => (
            <Card key={p.name} className={p.highlight ? "relative border-primary-700 bg-primary-900 text-primary-foreground shadow-xl" : ""}>
              {p.highlight && (
                <Badge variant="accent" className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">Empfohlen</Badge>
              )}
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className={p.highlight ? "text-accent" : "text-primary"}>
                    <div className="text-xs font-semibold uppercase tracking-wider">{p.tag}</div>
                  </div>
                  <h3 className="mt-1 font-serif text-2xl font-semibold">{p.name}</h3>
                  <p className={p.highlight ? "text-sm text-primary-100" : "text-sm text-muted-foreground"}>{p.seats}</p>
                </div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-serif text-5xl font-semibold">{p.price}€</span>
                  <span className={p.highlight ? "text-sm text-primary-100" : "text-sm text-muted-foreground"}>/ Monat</span>
                </div>
                <ul className="mb-7 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className={p.highlight ? "mt-0.5 h-4 w-4 shrink-0 text-accent" : "mt-0.5 h-4 w-4 shrink-0 text-primary"} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant={p.highlight ? "accent" : "outline"} className="w-full" size="lg">
                  <Link href="/signup">Demo anfragen</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-muted/30">
        <div className="container py-24">
          <div className="mb-14 max-w-2xl">
            <Badge variant="secondary" className="mb-3">Stimmen aus dem Pilot</Badge>
            <h2 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">Pflege, die wieder Freude macht.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-7">
                  <Quote className="h-6 w-6 text-accent" />
                  <p className="mt-4 text-base leading-relaxed">{t.quote}</p>
                  <div className="mt-6 border-t border-border pt-4">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DATENSCHUTZ */}
      <section id="datenschutz" className="container py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Badge variant="secondary" className="mb-3">Datenschutz & EU AI Act</Badge>
            <h2 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
              Höchste Standards. Ohne Kleingedrucktes.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Pflegedaten gehören zu den sensibelsten Daten überhaupt. Wir behandeln sie so.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: Server, title: "Hosting in Falkenstein (Hetzner)", desc: "ISO 27001 zertifiziertes Rechenzentrum, ausschließlich in Deutschland." },
                { icon: Lock, title: "AES-256 at rest, TLS 1.3 in transit", desc: "Jede Änderung signiert, jede Zeile auditierbar." },
                { icon: ShieldCheck, title: "EU AI Act ready", desc: "Hochrisiko-KI nach Anhang III: Risikomanagement, Logging, menschliche Aufsicht." },
                { icon: FileText, title: "On-Premise Option (Enterprise)", desc: "Für Einrichtungen mit höchsten Anforderungen: komplett in Ihrem Netzwerk." },
              ].map((x) => (
                <div key={x.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <x.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-semibold">{x.title}</div>
                    <div className="text-sm text-muted-foreground">{x.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card className="self-start bg-gradient-to-br from-primary-50 to-background">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-semibold">Prüfer-Paket auf Knopfdruck</h3>
              <p className="mt-3 text-muted-foreground">
                MDK-Prüfung oder Behördenanfrage? CareAI exportiert auf Wunsch alle relevanten Dokumentationen revisionsfest im geforderten Format.
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-primary shrink-0" /> Vollständiges Audit-Log (wer, was, wann)</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-primary shrink-0" /> SIS-Exporte nach MDK-Qualitätsprüfung</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-primary shrink-0" /> Medikationsnachweis (MAR)</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-primary shrink-0" /> Dekubitus-, Sturz-, Delir-Protokolle</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-muted/30">
        <div className="container grid gap-12 py-24 lg:grid-cols-3">
          <div>
            <Badge variant="secondary" className="mb-3">Häufige Fragen</Badge>
            <h2 className="font-serif text-4xl font-semibold tracking-tight">Noch Fragen?</h2>
            <p className="mt-4 text-muted-foreground">
              Wir antworten meist innerhalb eines Werktages — oder vereinbaren direkt eine Demo.
            </p>
            <Button asChild variant="accent" size="lg" className="mt-6">
              <Link href="/signup">Demo anfragen</Link>
            </Button>
          </div>
          <div className="space-y-4 lg:col-span-2">
            {faqs.map((f) => (
              <Card key={f.q}>
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-semibold">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <ComparisonTable />

      {/* TRUST ROW */}
      <TrustRow />

      {/* FINAL CTA */}
      <section className="container py-24">
        <Card className="overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-primary-foreground">
          <CardContent className="flex flex-col items-center gap-6 p-12 text-center md:p-20">
            <h2 className="max-w-3xl font-serif text-4xl font-semibold md:text-5xl">
              Geben Sie Ihrem Team die Zeit zurück, für die es diesen Beruf gewählt hat.
            </h2>
            <p className="max-w-2xl text-primary-100">
              Unverbindliche Demo in 30 Minuten. Keine Kreditkarte. Keine Verpflichtung.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="accent" size="xl">
                <Link href="/signup">Demo vereinbaren <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link href="/login">Live-Demo jetzt öffnen</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <StickyCta />
    </>
  );
}
