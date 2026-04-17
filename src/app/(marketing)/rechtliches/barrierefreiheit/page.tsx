import { PageHero } from "@/components/marketing/sections/page-hero";

export const metadata = {
  title: "Barrierefreiheitserklaerung — CareAI",
  description: "Erklaerung zur Konformitaet mit WCAG 2.2 AA, Barrierefreiheitsstaerkungsgesetz (BFSG) und Web-Zugaenglichkeits-Gesetz (WZG).",
  alternates: { canonical: "/rechtliches/barrierefreiheit" },
};

export default function AccessibilityStatementPage() {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title="Barrierefreiheitserklaerung" description="Stand: April 2026" />
      <section className="container mx-auto max-w-3xl space-y-5 py-10 leading-relaxed text-muted-foreground">
        <h2 className="font-serif text-2xl font-semibold text-foreground">1. Verpflichtung zur Barrierefreiheit</h2>
        <p>
          CareAI verpflichtet sich, seine Websites und Anwendungen im Einklang mit dem deutschen Barrierefreiheitsstaerkungsgesetz
          (BFSG) sowie dem oesterreichischen Web-Zugaenglichkeits-Gesetz (WZG) barrierefrei zugaenglich zu machen. Grundlage ist
          die Richtlinie WCAG 2.2, Konformitaetsstufe AA.
        </p>

        <h2 className="font-serif text-2xl font-semibold text-foreground">2. Status der Konformitaet</h2>
        <p>
          Diese Website ist teilweise konform mit WCAG 2.2 Level AA. Konformitaetspruefung durch interne Tests (axe-core,
          Screenreader-Tests NVDA / VoiceOver) und regelmaessige externe Audits (letzter Audit: Q1/2026).
        </p>

        <h2 className="font-serif text-2xl font-semibold text-foreground">3. Nicht barrierefreie Inhalte</h2>
        <p>Folgende Inhalte sind derzeit nicht vollstaendig barrierefrei:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Einige Alt-Texte der illustrativen SVG-Grafiken fehlen (in Bearbeitung, Fertigstellung Q3/2026)</li>
          <li>Einige Chart-Visualisierungen im Investor-Bereich ohne tabellarische Alternative (Investor-Bereich ist nicht oeffentlich)</li>
          <li>Eingebettete Pitch-Deck-PDFs sind nicht voll WCAG-konform (wir liefern eine HTML-Alternative auf Anfrage)</li>
        </ul>

        <h2 className="font-serif text-2xl font-semibold text-foreground">4. Feedback und Kontakt</h2>
        <p>
          Haben Sie Probleme beim Zugang auf CareAI-Inhalte? Melden Sie sich bitte unter{" "}
          <a className="text-primary underline-offset-4 hover:underline" href="mailto:accessibility@careai.eu">accessibility@careai.eu</a>.
          Wir antworten innerhalb von 7 Werktagen.
        </p>

        <h2 className="font-serif text-2xl font-semibold text-foreground">5. Durchsetzungsverfahren</h2>
        <p>
          In Deutschland: Schlichtungsstelle nach § 16 BGG (BFIT-Bund). In Oesterreich: Beschwerdestelle bei der FFG
          (Forschungsfoerderungsgesellschaft) fuer das WZG.
        </p>

        <h2 className="font-serif text-2xl font-semibold text-foreground">6. Erstellung dieser Erklaerung</h2>
        <p>
          Diese Erklaerung wurde am 12. April 2026 erstellt auf Basis einer Selbstbewertung und eines externen Audits
          (Agentur: WebAccess Consulting Wien). Die letzte Ueberpruefung erfolgte im April 2026. Wir ueberpruefen die Erklaerung
          halbjaehrlich.
        </p>
      </section>
    </>
  );
}
