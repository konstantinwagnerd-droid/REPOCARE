export default function ImpressumPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="font-serif text-4xl font-semibold">Impressum</h1>
      <div className="prose prose-neutral mt-6 space-y-4 text-sm leading-relaxed">
        <p><strong>CareAI GmbH (in Gründung)</strong><br />Lainzer Straße 100<br />1130 Wien, Österreich</p>
        <p>Firmenbuchnummer: in Eintragung<br />UID: in Zuteilung<br />Geschäftsführung: Konstantin Wagner</p>
        <p>Kontakt: <a href="mailto:hallo@careai.eu">hallo@careai.eu</a> · +43 1 234 56 78</p>
        <p>Aufsichtsbehörde: Magistrat Wien, MA 40<br />Kammerzugehörigkeit: WKO Wien</p>
        <p>Diese Seite ist eine Demo — Angaben sind teilweise noch vorläufig.</p>
      </div>
    </div>
  );
}
