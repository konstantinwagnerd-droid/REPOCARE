import { PageHero } from "@/components/marketing/sections/page-hero";

export const metadata = {
  title: "Hinweisgeberschutz — CareAI",
  description: "Meldewege und Schutz von Hinweisgebern gemaess HinSchG (DE) und HSchG (AT). Vertraulichkeit garantiert.",
  alternates: { canonical: "/rechtliches/hinweisgeberschutz" },
};

export default function WhistleblowerPage() {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title="Hinweisgeberschutz / Whistleblower" description="Stand: April 2026" />
      <section className="container mx-auto max-w-3xl space-y-5 py-10 leading-relaxed text-muted-foreground">
        <h2 className="font-serif text-2xl font-semibold text-foreground">1. Zweck dieser Policy</h2>
        <p>
          CareAI nimmt Hinweise auf Verstoesse ernst — ob Gesetzesverstoesse, Datenschutzvorfaelle, Compliance-Bruch, Missbrauch
          von Ressourcen oder unethisches Verhalten. Diese Policy beschreibt die Meldewege und den Schutz Hinweisgebender
          entsprechend dem deutschen Hinweisgeberschutzgesetz (HinSchG) und dem oesterreichischen HSchG.
        </p>

        <h2 className="font-serif text-2xl font-semibold text-foreground">2. Wer kann Hinweise geben</h2>
        <p>
          Mitarbeitende, Praktikant:innen, Bewerber:innen, ehemalige Mitarbeiter:innen, Auftragnehmer:innen, Lieferanten,
          Kunden und jede Person, die im beruflichen Kontext von Missstaenden erfaehrt.
        </p>

        <h2 className="font-serif text-2xl font-semibold text-foreground">3. Meldewege</h2>
        <p>Sie haben mehrere Optionen — waehlen Sie, was Ihnen am sichersten erscheint:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Intern direkt</strong> an die Compliance-Ansprechperson:{" "}
            <a className="text-primary underline-offset-4 hover:underline" href="mailto:hinweise@careai.eu">hinweise@careai.eu</a>
          </li>
          <li>
            <strong>Intern anonym</strong> ueber unser extern gehostetes, DSGVO-konformes Portal:{" "}
            <a className="text-primary underline-offset-4 hover:underline" href="https://integrityline.careai.eu" target="_blank" rel="noopener">integrityline.careai.eu</a>
          </li>
          <li><strong>Extern</strong> an die Bundesstelle Hinweisgeberschutz (DE, BaFin) bzw. die WKStA (AT)</li>
          <li>
            <strong>Postalisch</strong> an die Compliance-Ansprechperson (Stichwort "Hinweis"):<br />
            CareAI GmbH i.Gr., z.H. Compliance, Stephansplatz 4, 1010 Wien, AT
          </li>
        </ul>

        <h2 className="font-serif text-2xl font-semibold text-foreground">4. Vertraulichkeit</h2>
        <p>
          Die Identitaet der hinweisgebenden Person wird vertraulich behandelt und nur im gesetzlich zulaessigen Rahmen und mit
          Zustimmung weitergegeben. Anonyme Hinweise sind moeglich — Rueckfragen erfolgen dann ueber das Portal.
        </p>

        <h2 className="font-serif text-2xl font-semibold text-foreground">5. Schutz vor Repressalien</h2>
        <p>
          CareAI verpflichtet sich, keinerlei Benachteiligungen gegen hinweisgebende Personen zuzulassen. Kuendigungen,
          Versetzungen, Abmahnungen und jede Form von Diskriminierung im Zusammenhang mit einer Meldung sind unzulaessig und
          werden arbeitsrechtlich verfolgt.
        </p>

        <h2 className="font-serif text-2xl font-semibold text-foreground">6. Ablauf einer Meldung</h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>Eingangsbestaetigung binnen 7 Tagen</li>
          <li>Erste Rueckmeldung zur Plausibilitaet binnen 3 Monaten</li>
          <li>Untersuchung durch Compliance-Beauftragte</li>
          <li>Dokumentation aller Schritte</li>
          <li>Entscheidung ueber Konsequenzen und Kommunikation</li>
        </ol>

        <h2 className="font-serif text-2xl font-semibold text-foreground">7. Missbrauch</h2>
        <p>
          Bewusst falsche Meldungen koennen rechtliche Konsequenzen haben. Gutglaeubige Hinweise, die sich nicht bestaetigen,
          haben jedoch keinerlei negative Folgen fuer die hinweisgebende Person.
        </p>
      </section>
    </>
  );
}
