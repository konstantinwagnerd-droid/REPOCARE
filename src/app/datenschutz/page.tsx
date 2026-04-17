export default function DatenschutzPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="font-serif text-4xl font-semibold">Datenschutzerklärung</h1>
      <div className="prose prose-neutral mt-6 space-y-4 text-sm leading-relaxed">
        <p>CareAI verarbeitet personenbezogene Daten ausschließlich auf Grundlage der DSGVO und des österreichischen DSG.</p>
        <h2 className="font-serif text-xl font-semibold">Verantwortlich</h2>
        <p>CareAI GmbH, Lainzer Straße 100, 1130 Wien</p>
        <h2 className="font-serif text-xl font-semibold">Datenspeicherung</h2>
        <p>Alle Daten werden ausschließlich in ISO-27001-zertifizierten Rechenzentren von Hetzner Online GmbH in Falkenstein (Deutschland) gespeichert. Keine Datenverarbeitung außerhalb der EU.</p>
        <h2 className="font-serif text-xl font-semibold">Verschlüsselung</h2>
        <p>AES-256 at rest, TLS 1.3 in transit. Revisionsfestes Audit-Log für jede Änderung.</p>
        <h2 className="font-serif text-xl font-semibold">Betroffenenrechte</h2>
        <p>Auskunft, Berichtigung, Löschung, Einschränkung und Datenübertragbarkeit können jederzeit unter <a href="mailto:datenschutz@careai.eu">datenschutz@careai.eu</a> geltend gemacht werden.</p>
      </div>
    </div>
  );
}
