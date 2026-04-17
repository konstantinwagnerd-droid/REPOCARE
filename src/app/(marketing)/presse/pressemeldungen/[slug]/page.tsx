import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { pressReleases } from "@/components/presse/data";

interface PressDetail {
  slug: string;
  lead: string;
  body: string[];
  pull: { quote: string; by: string; role: string };
  contact: { name: string; role: string; email: string; phone: string };
  boilerplate: string;
}

const DETAILS: Record<string, PressDetail> = {
  "gruendung-careai-2024": {
    slug: "gruendung-careai-2024",
    lead:
      "WIEN, 01. Oktober 2024 — Die heute neu gegründete CareAI GmbH will Pflege-Dokumentation in stationären Einrichtungen radikal vereinfachen. Ziel: 67 % weniger Schreibarbeit, mehr Zeit am Bewohner. Gründer ist der 19-jährige KI-Entwickler Konstantin Wagner.",
    body: [
      "Die Pflegebranche in Deutschland und Österreich leidet unter chronischem Fachkräftemangel und gleichzeitig immer höheren Dokumentationsanforderungen. Bis zu 40 % einer Pflegeschicht gehen für administrative Aufgaben verloren. Die heute gegründete CareAI GmbH mit Sitz in Wien will diesen Missstand mit einer spezialisierten KI-Plattform beseitigen.",
      "Im Kern steht eine sprachgesteuerte Dokumentationslösung: Pflegekräfte diktieren während der Schicht, die KI strukturiert die Aussagen zu MDK-konformen SIS-Einträgen, Maßnahmenplänen und Schichtberichten. Die Zeitersparnis im Pilot: bis zu 90 Minuten pro Schicht.",
      "\"Wir schreiben nicht für die KI — die KI schreibt für uns\", erklärt Gründer Konstantin Wagner. \"Jede Sekunde, die wir von der Tastatur zurück ans Bett holen, ist gewonnene Pflegequalität.\"",
      "CareAI setzt konsequent auf europäische Infrastruktur: Hosting bei Hetzner in Falkenstein, vollständige DSGVO-Konformität, keine Drittland-Datenübermittlung. Erste Pilot-Einrichtungen werden Anfang 2025 starten.",
    ],
    pull: {
      quote:
        "Wir schreiben nicht für die KI — die KI schreibt für uns. Jede Sekunde, die wir von der Tastatur zurück ans Bett holen, ist gewonnene Pflegequalität.",
      by: "Konstantin Wagner",
      role: "CEO & Gründer, CareAI",
    },
    contact: {
      name: "Konstantin Wagner",
      role: "CEO",
      email: "presse@careai.health",
      phone: "+43 1 xxx xxxx",
    },
    boilerplate:
      "Über CareAI: Die CareAI GmbH entwickelt eine KI-gestützte Pflege-Dokumentations-Plattform für stationäre Einrichtungen im DACH-Raum. Mit Spracheingabe, automatischer SIS-Erstellung und prädiktiven Risiko-Scores entlastet CareAI Pflegekräfte um bis zu zwei Drittel der Dokumentationszeit. Das Unternehmen wurde 2024 in Wien gegründet, Hosting erfolgt in der EU, volle EU-AI-Act- und DSGVO-Konformität. Mehr: careai.health",
  },
  "pilot-seniorenresidenz-hietzing": {
    slug: "pilot-seniorenresidenz-hietzing",
    lead:
      "WIEN, 14. März 2025 — Die Seniorenresidenz Hietzing dokumentiert ihren sechswöchigen Pilotbetrieb mit CareAI: pro Schicht durchschnittlich 90 Minuten Zeitersparnis, 21 % weniger Pflegekraft-Fluktuation, bessere Schichtübergaben.",
    body: [
      "Nach sechs Wochen Pilotbetrieb zieht die Seniorenresidenz Hietzing eine erste Bilanz zum Einsatz der CareAI-Plattform. Die Ergebnisse übertreffen die Erwartungen: 90 Minuten Zeitersparnis pro Schicht, 67 % weniger Zeit für Dokumentation, 21 % weniger Kündigungen in den drei Monaten nach Einführung.",
      "\"Wir schreiben nicht mehr — wir pflegen\", beschreibt Pflegedienstleitung Maria Kreuzer den Unterschied. \"Die Dokumentation ist Nebensache geworden. Genau so soll es sein.\"",
      "Besonders bewährt hat sich die automatische SIS-Vorbefüllung aus sprachlich erfassten Beobachtungen. Die KI erkennt Risiken (Sturz, Dekubitus, Delir) und schlägt Maßnahmen vor, die die Pflegekraft bestätigt oder anpasst. Jede Änderung wird revisionsfest protokolliert.",
      "CareAI plant auf Basis dieser Ergebnisse die Expansion auf weitere Wiener Einrichtungen im Sommer 2025, gefolgt von München und Graz im Herbst.",
    ],
    pull: {
      quote:
        "Wir schreiben nicht mehr — wir pflegen. Die Dokumentation ist Nebensache geworden. Genau so soll es sein.",
      by: "Maria Kreuzer",
      role: "Pflegedienstleitung, Seniorenresidenz Hietzing",
    },
    contact: {
      name: "Konstantin Wagner",
      role: "CEO",
      email: "presse@careai.health",
      phone: "+43 1 xxx xxxx",
    },
    boilerplate:
      "Über CareAI: KI-gestützte Pflege-Dokumentation für DACH-Einrichtungen. Gegründet 2024 in Wien. Mehr: careai.health",
  },
  "aws-preseed-foerderung": {
    slug: "aws-preseed-foerderung",
    lead:
      "WIEN, 22. Juli 2025 — Die Austria Wirtschaftsservice GmbH (aws) fördert CareAI mit 200.000 Euro aus dem Preseed-Programm. Die Mittel fließen in Markteintritt, klinische Validierung und EU-AI-Act-Konformität.",
    body: [
      "Die Austria Wirtschaftsservice GmbH hat CareAI in das Preseed-Förderprogramm aufgenommen. Die Förderhöhe von 200.000 Euro ermöglicht dem Wiener Start-up den forcierten Markteintritt in weitere Bundesländer, die klinische Validierung der Risiko-Prognose-Modelle und den vollständigen Abschluss der EU-AI-Act-Dokumentation.",
      "\"Wir sind dankbar für das Vertrauen der aws\", so Gründer Konstantin Wagner. \"Der Preseed-Check ist ein starkes Signal, dass Österreich Gesundheits-KI made in Europe ernst nimmt.\"",
      "Die Förderung ergänzt Bootstrap-Umsätze aus den ersten Pilot-Einrichtungen. CareAI verzichtet bewusst auf US-Venture-Capital, um die Datenhoheit und die europäische Ausrichtung zu sichern.",
    ],
    pull: {
      quote:
        "Der Preseed-Check ist ein starkes Signal, dass Österreich Gesundheits-KI made in Europe ernst nimmt.",
      by: "Konstantin Wagner",
      role: "CEO & Gründer, CareAI",
    },
    contact: {
      name: "Konstantin Wagner",
      role: "CEO",
      email: "presse@careai.health",
      phone: "+43 1 xxx xxxx",
    },
    boilerplate:
      "Über CareAI: KI-gestützte Pflege-Dokumentation für DACH-Einrichtungen. Gegründet 2024 in Wien. Gefördert durch aws Preseed. Mehr: careai.health",
  },
  "eu-ai-act-konformitaet": {
    slug: "eu-ai-act-konformitaet",
    lead:
      "WIEN, 10. Februar 2026 — CareAI veröffentlicht heute die Version 2.0 seiner Pflege-Plattform und ist damit das erste KI-Pflege-System im DACH-Raum, das alle Anforderungen des EU AI Act für Hochrisiko-KI erfüllt.",
    body: [
      "Der EU AI Act stuft KI-Systeme im Gesundheitsbereich als Hochrisiko-Anwendungen ein. Die Compliance-Pflichten umfassen Risikomanagement, Datenqualität, Transparenz, menschliche Aufsicht, Genauigkeits- und Robustheits-Nachweise sowie vollständige Dokumentation.",
      "CareAI 2.0 erfüllt alle Anforderungen und ist das erste KI-Pflege-System im DACH-Raum, das dies nachweisen kann. Die Dokumentation umfasst über 400 Seiten und steht Einrichtungen, Aufsichtsbehörden und akademischen Partnern zur Verfügung.",
      "\"CareAI ist Hochrisiko-KI — und das behandeln wir nicht als Bürokratie-Last, sondern als Qualitätsmerkmal\", erklärt CEO Konstantin Wagner. \"Menschliche Aufsicht, Transparenz, Audit-Trails: das macht KI in der Pflege erst vertretbar.\"",
    ],
    pull: {
      quote:
        "CareAI ist Hochrisiko-KI — und das behandeln wir nicht als Bürokratie-Last, sondern als Qualitätsmerkmal.",
      by: "Konstantin Wagner",
      role: "CEO, CareAI",
    },
    contact: {
      name: "Konstantin Wagner",
      role: "CEO",
      email: "presse@careai.health",
      phone: "+43 1 xxx xxxx",
    },
    boilerplate:
      "Über CareAI: KI-gestützte Pflege-Dokumentation, EU-AI-Act-konform, Hosting in der EU. Gegründet 2024 in Wien. Mehr: careai.health",
  },
  "1000-bewohner-meilenstein": {
    slug: "1000-bewohner-meilenstein",
    lead:
      "WIEN, 01. April 2026 — CareAI dokumentiert nach sechs Monaten Marktbetrieb bereits 1.000 Bewohner:innen in 12 Einrichtungen quer durch DACH. Nächster Expansion-Schritt: Nordrhein-Westfalen und Bayern.",
    body: [
      "Sechs Monate nach dem offiziellen Marktstart betreut CareAI die Dokumentation von 1.000 Pflegebedürftigen in 12 stationären Einrichtungen in Österreich und Süddeutschland. Die Einrichtungen berichten übereinstimmend von signifikanter Entlastung der Pflegekräfte und verbesserter Dokumentationsqualität.",
      "Auf Basis der positiven Ergebnisse plant CareAI die Expansion nach Nordrhein-Westfalen und Bayern. Gespräche mit Trägern laufen; der nächste Go-live ist für Juni 2026 terminiert.",
      "\"1.000 Bewohner:innen ist ein Meilenstein — aber wir denken in Millionen\", so Konstantin Wagner. \"In DACH gibt es 1,2 Millionen Heimplätze. Unser Ziel ist, in jedem davon die Dokumentations-Belastung um mindestens die Hälfte zu reduzieren.\"",
    ],
    pull: {
      quote:
        "1.000 Bewohner:innen ist ein Meilenstein — aber wir denken in Millionen.",
      by: "Konstantin Wagner",
      role: "CEO, CareAI",
    },
    contact: {
      name: "Konstantin Wagner",
      role: "CEO",
      email: "presse@careai.health",
      phone: "+43 1 xxx xxxx",
    },
    boilerplate:
      "Über CareAI: KI-gestützte Pflege-Dokumentation für DACH-Einrichtungen. 12 Einrichtungen, 1.000+ Bewohner:innen. Mehr: careai.health",
  },
};

export default async function PressDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = pressReleases.find((r) => r.slug === slug);
  const detail = DETAILS[slug];
  if (!meta || !detail) notFound();

  return (
    <article className="container max-w-3xl space-y-8 py-12">
      <Link
        href="/presse/pressemeldungen"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"
      >
        <ArrowLeft className="size-4" />
        Zurück zum Archiv
      </Link>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="outline">{meta.category}</Badge>
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" aria-hidden="true" />
            <time dateTime={meta.date}>
              {new Date(meta.date).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden="true" />
            {meta.location}
          </span>
        </div>
        <h1 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">
          {meta.title}
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">{meta.subtitle}</p>
      </header>

      <section className="prose prose-neutral max-w-none">
        <p className="text-base font-semibold">{detail.lead}</p>
        {detail.body.map((p, i) => (
          <p key={i} className="leading-relaxed">{p}</p>
        ))}
      </section>

      <aside className="rounded-2xl border-l-4 border-primary bg-primary/5 p-6">
        <blockquote className="font-serif text-xl italic leading-snug">
          &ldquo;{detail.pull.quote}&rdquo;
        </blockquote>
        <footer className="mt-3 text-sm">
          <strong>{detail.pull.by}</strong> · {detail.pull.role}
        </footer>
      </aside>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-serif text-lg font-semibold">Über CareAI</h2>
          <p className="mt-2 text-sm text-muted-foreground">{detail.boilerplate}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-serif text-lg font-semibold">Pressekontakt</h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd>{detail.contact.name}, {detail.contact.role}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">E-Mail</dt>
              <dd>
                <a className="inline-flex items-center gap-1 text-primary hover:underline" href={`mailto:${detail.contact.email}`}>
                  <Mail className="size-3.5" /> {detail.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Telefon</dt>
              <dd>{detail.contact.phone}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </article>
  );
}

export function generateStaticParams() {
  return pressReleases.map((r) => ({ slug: r.slug }));
}
