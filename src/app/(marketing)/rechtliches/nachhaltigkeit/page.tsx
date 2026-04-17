import { PageHero } from "@/components/marketing/sections/page-hero";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Nachhaltigkeit — CareAI",
  description: "Kurzbericht zu unserer Umweltauswirkung — Hetzner Oekostrom, papierloses Arbeiten, Reisepolitik.",
  alternates: { canonical: "/rechtliches/nachhaltigkeit" },
};

export default function SustainabilityPage() {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title="Nachhaltigkeitsbericht (Kurzfassung)" description="Stand: April 2026" />
      <section className="container mx-auto max-w-3xl space-y-5 py-10 leading-relaxed text-muted-foreground">
        <p>
          CareAI ist ein kleines Unternehmen — wir erstellen keinen CSRD-pflichtigen Nachhaltigkeitsbericht (das betrifft uns
          erst ab 250 Mitarbeitenden oder €40 Mio Umsatz). Dennoch legen wir hier transparent offen, was wir tun.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <Card><CardContent className="p-5">
            <p className="text-xs uppercase text-primary">Energie</p>
            <p className="mt-1 font-serif text-lg font-semibold">100% Oekostrom in der Cloud</p>
            <p className="mt-2 text-sm">Alle Produktions-Server laufen bei Hetzner Online GmbH. Standorte: Falkenstein (DE) und Helsinki (FI), beide 100% erneuerbare Energie nach Hetzner-Nachhaltigkeitsbericht.</p>
          </CardContent></Card>

          <Card><CardContent className="p-5">
            <p className="text-xs uppercase text-primary">Buero</p>
            <p className="mt-1 font-serif text-lg font-semibold">Co-Working + Remote</p>
            <p className="mt-2 text-sm">Kein fester Buerostandort mit hoher Flaechenlast. Primaer Co-Working-Space Impact Hub Wien (Oekostrom, Fairtrade-Kaffee). Remote-first-Kultur reduziert Pendel-CO2.</p>
          </CardContent></Card>

          <Card><CardContent className="p-5">
            <p className="text-xs uppercase text-primary">Arbeitsweise</p>
            <p className="mt-1 font-serif text-lg font-semibold">Weitgehend papierlos</p>
            <p className="mt-2 text-sm">Interne Prozesse zu ~98% papierfrei. Ausgedruckt werden nur verpflichtende Unterschrift-Dokumente (Vertraege), danach Scan + sicheres Schreddern.</p>
          </CardContent></Card>

          <Card><CardContent className="p-5">
            <p className="text-xs uppercase text-primary">Reisen</p>
            <p className="mt-1 font-serif text-lg font-semibold">Bahn vor Flug, Video vor Bahn</p>
            <p className="mt-2 text-sm">Innerhalb DACH ist Bahn Standard. Fluege nur bei ueber 6 Stunden Gesamtreisezeit mit Bahn. Kundentermine soweit moeglich remote (Zoom, Microsoft Teams).</p>
          </CardContent></Card>

          <Card><CardContent className="p-5">
            <p className="text-xs uppercase text-primary">Hardware</p>
            <p className="mt-1 font-serif text-lg font-semibold">Refurbished statt neu</p>
            <p className="mt-2 text-sm">Alle Team-Laptops sind refurbished (Fairphone + MacBook-Refurb). Mobilgeraete mindestens 3 Jahre im Einsatz, danach Weitergabe an Mitarbeitende oder Wiederverwertung.</p>
          </CardContent></Card>

          <Card><CardContent className="p-5">
            <p className="text-xs uppercase text-primary">Soziales</p>
            <p className="mt-1 font-serif text-lg font-semibold">Diversitaet im Team</p>
            <p className="mt-2 text-sm">Ziel bis Ende 2027: 50% Frauen, 50% in Fuehrung. Aktuell 33% / 33% (bei Teamgroesse 3). Transparente Gehaltsbaender, keine Verhandlungstricks.</p>
          </CardContent></Card>
        </div>

        <h2 className="font-serif text-2xl font-semibold text-foreground">Was wir nicht tun</h2>
        <p>
          Wir kompensieren derzeit keine CO2-Emissionen aktiv ueber den Markt (Qualitaet der Kompensationsmarkt-Projekte ist
          oft zweifelhaft). Wir investieren stattdessen in Vermeidung (Remote, Oekostrom, Bahnreisen). Wir publizieren keinen
          THG-Bilanzbericht mangels Relevanz/Groesse — werden das ab 50 Mitarbeitenden einfuehren.
        </p>

        <h2 className="font-serif text-2xl font-semibold text-foreground">Ziele 2027</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Erster vollstaendiger THG-Bilanz-Report (Scope 1+2, ggf. 3) bis Q4 2027</li>
          <li>100% Gender-Balance ueber alle Ebenen</li>
          <li>Aufnahme in Code of Ethics fuer Pflege-Tech (DACH Gruppierung geplant)</li>
        </ul>
      </section>
    </>
  );
}
