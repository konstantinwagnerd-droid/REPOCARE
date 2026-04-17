import Link from "next/link";
import { PageHero } from "@/components/marketing/sections/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Rechtliches — CareAI",
  description: "Uebersicht aller rechtlichen Dokumente: Impressum, Datenschutz, AGB, AV-Vertrag, Cookies, Barrierefreiheit, Hinweisgeberschutz, Nachhaltigkeit.",
  alternates: { canonical: "/rechtliches" },
};

const docs = [
  { href: "/impressum", title: "Impressum", desc: "Anbieterkennung nach § 5 TMG und ECG" },
  { href: "/datenschutz", title: "Datenschutzerklaerung", desc: "Vollstaendige Information nach Art. 13, 14 DSGVO" },
  { href: "/agb", title: "AGB", desc: "Allgemeine Geschaeftsbedingungen fuer B2B-Kunden" },
  { href: "/av-vertrag", title: "AV-Vertrag", desc: "Auftragsverarbeitung nach Art. 28 DSGVO" },
  { href: "/rechtliches/cookies", title: "Cookie-Richtlinie", desc: "Cookies, Tracking, Consent-Management" },
  { href: "/rechtliches/barrierefreiheit", title: "Barrierefreiheit", desc: "Erklaerung zur WCAG 2.2 AA Konformitaet" },
  { href: "/rechtliches/hinweisgeberschutz", title: "Hinweisgeberschutz", desc: "Meldewege und Vertraulichkeit nach HinSchG" },
  { href: "/rechtliches/nachhaltigkeit", title: "Nachhaltigkeit", desc: "Kurzbericht: Hetzner Oekostrom, Ressourcen, Reisetaetigkeit" },
];

export default function LegalOverviewPage() {
  return (
    <>
      <PageHero
        eyebrow="Rechtliches"
        title="Alle rechtlichen Dokumente auf einen Blick."
        description="Transparent, aktuell, juristisch gepruefft. Stand: April 2026."
      />

      <section className="container py-12">
        <div className="grid gap-4 md:grid-cols-2">
          {docs.map((d) => (
            <Link key={d.href} href={d.href} className="group">
              <Card className="transition-transform hover:-translate-y-0.5">
                <CardContent className="flex items-start gap-4 p-5">
                  <FileText className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-serif text-lg font-semibold group-hover:text-primary">{d.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
