import { PageHero } from "@/components/marketing/sections/page-hero";
import { SecondaryNav } from "@/components/marketing/sections/secondary-nav";
import { HumanInTheLoop } from "@/design-system/illustrations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = { title: "Karriere — CareAI" };

const values = [
  {
    title: "4-Tage-Woche optional",
    text: "Vollzeit = 32h oder 40h, Ihre Wahl. Bei uns bedeutet 4-Tage 100% Gehalt — nicht 80%.",
  },
  { title: "100% Remote moeglich", text: "Bueros in Wien und Muenchen. Pflicht-Tage: 0. Co-Working wird bezahlt." },
  { title: "Transparente Gehaltsbaender", text: "Jede Position hat ein oeffentliches Gehaltsband. Keine Verhandlungstricks." },
  { title: "50/50 Gender-Ziel", text: "Bis Ende 2027: 50% Frauen im Team, 50% in Fuehrung. Aktuell: 33% / 33%." },
  { title: "Mental-Health-Budget", text: "1.500 EUR/Jahr pro Person, frei verwendbar fuer Therapie, Coaching, Retreats." },
  { title: "Lern-Budget", text: "2.500 EUR/Jahr fuer Kurse, Konferenzen, Buecher — ohne Rechtfertigung." },
];

const positions = [
  {
    title: "Senior Pflege-Domain-Expert:in",
    type: "Teilzeit (20–30h)",
    salary: "55.000–75.000 EUR (FTE)",
    location: "Wien / Remote",
    short:
      "Sie haben >= 10 Jahre Pflege-Praxis und Lust, endlich Software von innen heraus zu gestalten. Sie uebersetzen Pflege-Wirklichkeit in Produktentscheidungen.",
  },
  {
    title: "Full-Stack-Engineer",
    type: "Vollzeit (32–40h)",
    salary: "70.000–95.000 EUR",
    location: "Wien / Muenchen / Remote",
    short:
      "TypeScript, Next.js, Drizzle, Postgres. Sie lieben API-Design, hassen Tech-Debt und schreiben Tests aus freien Stuecken. Bonus: KI-Praxiserfahrung.",
  },
  {
    title: "Customer Success Manager:in Pflege",
    type: "Vollzeit (32–40h)",
    salary: "55.000–70.000 EUR",
    location: "Wien / DACH Remote",
    short:
      "Sie begleiten Einrichtungen vom Kickoff bis zum zweiten Jahr. Sie waren schon mal in einer Pflege-Einrichtung — nicht nur als Besucher.",
  },
];

export default function KarrierePage() {
  return (
    <>
      <PageHero
        eyebrow="Karriere"
        title="Gemeinsam bauen, was die Pflege brauchte — seit 30 Jahren."
        description="Wir stellen Menschen ein, die gesellschaftlichen Impact ueber Aktien-Pakete stellen. Und trotzdem einen Aktien-Pakete bekommen."
        illustration={<HumanInTheLoop className="h-72 w-72" />}
      />
      <SecondaryNav active="/karriere" />

      {/* Mission */}
      <section className="container py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Warum bei uns arbeiten?</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Wir bauen Software, die direkt Lebensqualitaet von Menschen in ihren letzten Lebensjahren verbessert — und
              die Arbeitsbedingungen derjenigen, die sich um sie kuemmern. Wenn Sie jeden Montag wissen wollen, <em>warum</em> Sie
              arbeiten: das ist unser Angebot.
            </p>
            <p>
              Wir sind klein (6 Personen), waechst schnell, und meinen es ernst mit ausgewogenen Arbeitszeiten.
              „Hustle-Culture” gibts hier nicht — die Pflegekraefte, fuer die wir bauen, hustlen schon genug.
            </p>
          </div>
        </div>
      </section>

      {/* Values / Benefits */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="container py-16">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Was wir bieten</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <Card key={v.title}>
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="container py-16">
        <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Offene Positionen</h2>
        <div className="mt-8 space-y-5">
          {positions.map((p) => (
            <Card key={p.title}>
              <CardContent className="grid gap-4 p-6 md:grid-cols-4">
                <div className="md:col-span-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-xl font-semibold">{p.title}</h3>
                    <Badge variant="secondary">{p.type}</Badge>
                    <Badge variant="outline">{p.location}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{p.short}</p>
                  <div className="mt-3 text-sm font-medium text-primary">{p.salary}</div>
                </div>
                <div className="flex items-center md:justify-end">
                  <Button asChild variant="accent">
                    <Link href={`/kontakt?topic=${encodeURIComponent("Bewerbung: " + p.title)}`}>Bewerben</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bewerbung */}
      <section className="bg-muted/30">
        <div className="container py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">So bewerben Sie sich</h2>
            <ul className="mt-6 space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary">•</span> Formloses Anschreiben (max. 300 Woerter) oder Video bis 3 Minuten.
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span> <strong>Kein Foto-Zwang.</strong> Keine Noten. Keine Lebenslauf-Luecken-Rechtfertigung.
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span> Antwort innerhalb 10 Werktagen, Prozess-Dauer &lt; 4 Wochen.
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span> Wir zahlen Bewerbungs-Gespraeche nach 2. Runde (60 EUR/h).
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
