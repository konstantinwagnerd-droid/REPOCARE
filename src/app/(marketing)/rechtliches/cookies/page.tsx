import { PageHero } from "@/components/marketing/sections/page-hero";

export const metadata = {
  title: "Cookie-Richtlinie — CareAI",
  description: "Welche Cookies wir setzen, wofuer und wie Sie zustimmen oder widersprechen.",
  alternates: { canonical: "/rechtliches/cookies" },
};

export default function CookiesPage() {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title="Cookie-Richtlinie" description="Stand: April 2026" />
      <section className="container mx-auto max-w-3xl space-y-6 py-10 leading-relaxed">
        <h2 className="font-serif text-2xl font-semibold">1. Was sind Cookies</h2>
        <p className="text-muted-foreground">
          Cookies sind kleine Textdateien, die auf Ihrem Endgeraet gespeichert werden. Sie enthalten Informationen, die bei einem
          wiederholten Besuch der Website gelesen werden koennen. CareAI setzt Cookies sparsam ein.
        </p>

        <h2 className="font-serif text-2xl font-semibold">2. Notwendige Cookies (kein Consent erforderlich)</h2>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li><strong>careai-session</strong> — Authentifizierung, Laufzeit: Session. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</li>
          <li><strong>careai-theme</strong> — Dark/Light-Mode-Praeferenz, Laufzeit: 1 Jahr.</li>
          <li><strong>careai-csrf</strong> — CSRF-Schutz, Laufzeit: Session.</li>
        </ul>

        <h2 className="font-serif text-2xl font-semibold">3. Analyse-Cookies (Consent erforderlich)</h2>
        <p className="text-muted-foreground">
          Wir setzen <strong>keine</strong> Analyse-Cookies. Wir nutzen ausschliesslich serverseitige Logs und anonymisierte Stats
          (Plausible-kompatibel, self-hosted, ohne Cookie).
        </p>

        <h2 className="font-serif text-2xl font-semibold">4. Marketing-Cookies</h2>
        <p className="text-muted-foreground">Setzen wir nicht. Keine Werbenetzwerke, keine Tracker, keine Social-Plugins mit Drittanbieter-Cookies.</p>

        <h2 className="font-serif text-2xl font-semibold">5. Cookies verwalten</h2>
        <p className="text-muted-foreground">
          Sie koennen Cookies jederzeit im Browser-Menue loeschen oder blockieren. Notwendige Cookies zu deaktivieren kann zur
          Nicht-Funktionsfaehigkeit fuehren. Analyse- oder Marketing-Cookies sind bei uns nicht aktiv.
        </p>

        <h2 className="font-serif text-2xl font-semibold">6. Kontakt</h2>
        <p className="text-muted-foreground">Fragen zum Cookie-Einsatz: <a className="text-primary underline-offset-4 hover:underline" href="mailto:datenschutz@careai.eu">datenschutz@careai.eu</a>.</p>
      </section>
    </>
  );
}
