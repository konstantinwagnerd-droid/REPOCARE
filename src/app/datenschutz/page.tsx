import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, FileText, Download, MapPin, Mail, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Datenschutz — Deine Daten bleiben in Deutschland. Immer. | CareAI",
  description:
    "Alle Pflegedaten in Hetzner Falkenstein (DE), ISO 27001 zertifiziert. AV-Vertrag, DSFA, TOM, Subprocessor-Liste. Keine Übermittlung außerhalb der EU.",
};

const siegel = [
  { label: "Hetzner Falkenstein", desc: "Hosting in Deutschland" },
  { label: "ISO 27001", desc: "Informationssicherheit" },
  { label: "DSGVO-konform", desc: "Art. 28 AV-Vertrag" },
  { label: "EU-AI-Act-ready", desc: "Hoch-Risiko-System" },
];

const dokumente = [
  { slug: "datenschutz-1pager-de", titel: "Datenschutz-1-Pager (DE)", beschreibung: "Überblick für PDL, 1 Seite A4" },
  { slug: "datenschutz-1pager-at", titel: "Datenschutz-1-Pager (AT)", beschreibung: "Österreich-spezifisch, GuKG + DSB" },
  { slug: "av-vertrag-entwurf", titel: "AV-Vertrag (Art. 28 DSGVO)", beschreibung: "Vollständiger Entwurf mit Anlagen" },
  { slug: "dsfa-careai", titel: "Datenschutz-Folgenabschätzung", beschreibung: "DSFA nach Art. 35 DSGVO" },
  { slug: "tom-careai", titel: "TOM-Dokument", beschreibung: "Technische + Organisatorische Maßnahmen" },
  { slug: "subprocessors", titel: "Subprocessor-Liste", beschreibung: "Aktive Unter-Auftragsverarbeiter" },
  { slug: "abrechnung-krankenkassen", titel: "Kassen-Abrechnung 1-Pager", beschreibung: "Wie CareAI mit Krankenkassen abrechnet" },
];

const faq = [
  {
    frage: "Wer hat Zugriff auf unsere Daten?",
    antwort:
      "Nur authentifizierte Mitarbeiter Ihrer Einrichtung über rollenbasierte Rechte. CareAI-Support hat standardmäßig KEINEN Zugriff. Support-Zugriff ist nur mit Ihrer schriftlichen Freigabe möglich, zeitlich befristet und vollständig audit-geloggt.",
  },
  {
    frage: "Wo liegen die Daten physisch?",
    antwort:
      "Rechenzentrum Hetzner Falkenstein in Sachsen (Deutschland). ISO 27001 zertifiziert. Datenbank auf Supabase EU Frankfurt. Keine Verarbeitung außerhalb der EU — die KI-Inferenz läuft auf dem Anthropic EU-Endpoint.",
  },
  {
    frage: "Was passiert bei einem Datenleck?",
    antwort:
      "Wir informieren Sie unverzüglich, spätestens binnen 24 Stunden nach Kenntnis. Wir unterstützen Sie bei der 72-Stunden-Meldung an die Aufsichtsbehörde nach Art. 33 DSGVO. Ein dokumentiertes Incident-Runbook liegt vor.",
  },
  {
    frage: "Können wir unsere Daten jederzeit exportieren?",
    antwort:
      "Ja. Strukturierter Export im JSON/CSV-Format, jederzeit in-App oder per Anfrage. Bei Vertragsende erhalten Sie binnen 30 Tagen einen vollständigen Export, danach auditierbare Löschung nach DIN 66398.",
  },
  {
    frage: "Werden unsere Daten zum KI-Training verwendet?",
    antwort:
      "Nein. Vertraglich ausgeschlossen mit Anthropic (Enterprise-Terms) und technisch auf Ebene des EU-Endpoints unterbunden. Kein Kundendaten-Training bei keinem unserer Sub-Processor.",
  },
  {
    frage: "Wie läuft die Abrechnung mit den Krankenkassen?",
    antwort:
      "CareAI erzeugt die Abrechnungsdateien im Format nach § 302 SGB V (DE) bzw. ÖGK-XML (AT). Einreichung erfolgt durch die Einrichtung über die Clearing-Stelle der Kasse — genau wie bei Medifox, Vivendi und allen anderen großen Anbietern. Siehe den 1-Pager.",
  },
];

export default function DatenschutzMarketingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 to-white py-20">
        <div className="container max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-medium text-teal-700">
            <MapPin className="h-3 w-3" /> Rechenzentrum Falkenstein · Sachsen · Deutschland
          </div>
          <h1 className="mt-6 font-serif text-5xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
            Deine Daten bleiben in
            <br />
            <span className="text-teal-700">Deutschland. Immer.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-neutral-600">
            CareAI ist als Auftragsverarbeiter nach Art. 28 DSGVO für Pflegeeinrichtungen gebaut.
            Alle Pflegedaten bleiben in ISO-27001-zertifizierten Rechenzentren in Deutschland. Kein
            Datenexport in die USA. Kein KI-Training auf Ihren Daten. Punkt.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/api/legal/datenschutz-1pager-de/pdf">
                <Download className="mr-2 h-4 w-4" /> Datenschutz-1-Pager (PDF)
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/av-vertrag">AV-Vertrag anfordern</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Siegel */}
      <section className="border-y bg-white py-12">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {siegel.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-center"
              >
                <ShieldCheck className="mx-auto h-8 w-8 text-teal-700" />
                <div className="mt-3 font-semibold">{s.label}</div>
                <div className="mt-1 text-xs text-neutral-500">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dokumente */}
      <section className="py-20">
        <div className="container max-w-5xl">
          <h2 className="font-serif text-3xl font-semibold">Alle Dokumente zum Download</h2>
          <p className="mt-2 text-neutral-600">
            Prüfbereit für Ihre PDL, Ihren DSB und Ihre Heimaufsicht.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {dokumente.map((d) => (
              <Card key={d.slug}>
                <CardContent className="flex items-start justify-between gap-4 p-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-teal-700" />
                      <div className="font-semibold">{d.titel}</div>
                    </div>
                    <div className="mt-2 text-sm text-neutral-600">{d.beschreibung}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/api/legal/${d.slug}/pdf`}>
                        <Download className="mr-1 h-4 w-4" /> PDF
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-50 py-20">
        <div className="container max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold">Häufige Fragen</h2>
          <div className="mt-8 space-y-4">
            {faq.map((f) => (
              <details key={f.frage} className="group rounded-xl border bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  <span className="mr-2 inline-block text-teal-700 group-open:rotate-90">›</span>
                  {f.frage}
                </summary>
                <p className="mt-3 pl-5 text-sm leading-relaxed text-neutral-600">{f.antwort}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <Card className="border-teal-200 bg-teal-50">
            <CardContent className="flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  <Lock className="h-5 w-5 text-teal-700" /> Fragen zum Datenschutz?
                </div>
                <p className="mt-2 text-sm text-neutral-700">
                  Direkt an unseren Datenschutzbeauftragten — Antwort binnen 48 Stunden garantiert.
                </p>
              </div>
              <Button asChild size="lg">
                <a href="mailto:datenschutz@careai.health">
                  <Mail className="mr-2 h-4 w-4" /> datenschutz@careai.health
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-neutral-500">
            <Link href="/datenschutz/erklaerung" className="underline-offset-4 hover:underline">
              Datenschutzerklärung <ExternalLink className="ml-1 inline h-3 w-3" />
            </Link>
            <Link href="/impressum" className="underline-offset-4 hover:underline">
              Impressum
            </Link>
            <Link href="/agb" className="underline-offset-4 hover:underline">
              AGB
            </Link>
            <Link href="/trust" className="underline-offset-4 hover:underline">
              Trust Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
