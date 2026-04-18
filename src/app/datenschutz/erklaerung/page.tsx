export const metadata = { title: "Datenschutzerklärung — CareAI" };

export default function DatenschutzerklaerungPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="font-serif text-4xl font-semibold">Datenschutzerklärung</h1>
      <div className="prose prose-neutral mt-6 space-y-4 text-sm leading-relaxed">
        <p>
          CareAI verarbeitet personenbezogene Daten ausschließlich auf Grundlage der DSGVO und des
          österreichischen DSG.
        </p>
        <h2 className="font-serif text-xl font-semibold">Verantwortlich</h2>
        <p>CareAI GmbH (i.G.), Wien, Österreich</p>
        <h2 className="font-serif text-xl font-semibold">Datenspeicherung</h2>
        <p>
          Alle Daten werden ausschließlich in ISO-27001-zertifizierten Rechenzentren von Hetzner
          Online GmbH in Falkenstein (Deutschland) gespeichert. Keine Datenverarbeitung außerhalb
          der EU.
        </p>
        <h2 className="font-serif text-xl font-semibold">Verschlüsselung</h2>
        <p>AES-256 at rest, TLS 1.3 in transit. Revisionsfestes Audit-Log für jede Änderung.</p>
        <h2 className="font-serif text-xl font-semibold">Betroffenenrechte</h2>
        <p>
          Auskunft, Berichtigung, Löschung, Einschränkung und Datenübertragbarkeit können jederzeit
          unter <a href="mailto:datenschutz@careai.health">datenschutz@careai.health</a> geltend
          gemacht werden.
        </p>
        <h2 className="font-serif text-xl font-semibold">Weitere Dokumente</h2>
        <ul>
          <li><a href="/datenschutz">Datenschutz-Übersicht (Marketing)</a></li>
          <li><a href="/api/legal/av-vertrag-entwurf/pdf">AV-Vertrag (Art. 28 DSGVO) — PDF</a></li>
          <li><a href="/api/legal/dsfa-careai/pdf">Datenschutz-Folgenabschätzung — PDF</a></li>
          <li><a href="/api/legal/tom-careai/pdf">TOM-Dokument — PDF</a></li>
          <li><a href="/api/legal/subprocessors/pdf">Subprocessor-Liste — PDF</a></li>
        </ul>
      </div>
    </div>
  );
}
