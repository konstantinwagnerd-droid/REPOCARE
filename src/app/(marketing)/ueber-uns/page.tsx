import { PageHero } from "@/components/marketing/sections/page-hero";
import { SecondaryNav } from "@/components/marketing/sections/secondary-nav";
import { PflegeTeam } from "@/design-system/illustrations";
import { Card, CardContent } from "@/components/ui/card";
import { TimelineItem } from "@/design-system/patterns";

export const metadata = { title: "Ueber uns — CareAI" };

const team = [
  { name: "Konstantin Wagner", role: "CEO & Gruender", bio: "19, WU Wien, Unicorn-Ambitionen, 30h+/Woche." },
  { name: "Dr. Julia Lenhart", role: "Chief Care Officer", bio: "15 Jahre Pflege-Praxis, frueher PDL St. Poelten." },
  { name: "Marcus Weiss", role: "CTO", bio: "Ex-N26, Ex-Klarna. Security-First Architektur." },
  { name: "Amelie Baumann", role: "Head of People", bio: "Baut Teams, die Pflege wirklich verstehen." },
  { name: "Tobias Reiter", role: "Head of Design", bio: "Frueher bei Duolingo. Macht Software, die Freude macht." },
  { name: "Fatima Al-Khatib", role: "Head of Compliance", bio: "Juristin mit Schwerpunkt EU AI Act + MDR." },
];

const values = [
  {
    title: "Ernst nehmen, was Pflege sagt",
    text: "Wir entwickeln mit Pflegekraeften, nicht ueber sie hinweg. Jedes Feature hat mindestens drei DGKP-Tests vor Release.",
  },
  {
    title: "Transparenz als Produkt",
    text: "Trust Center, Status-Page, Changelog — alles oeffentlich. Wenn wir einen Fehler machen, sagen wir es.",
  },
  {
    title: "Pragmatismus vor Dogma",
    text: "KI dort, wo sie Zeit spart. Menschen dort, wo nur Menschen es koennen. Keine Ideologien.",
  },
  {
    title: "Nachhaltig wachsen",
    text: "Wir bauen ein Unternehmen fuer 30 Jahre, nicht fuer den naechsten Exit. Das heisst: faire Preise, faire Loehne, faire Kundenbeziehungen.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Ueber uns"
        title="Wir bauen Software, damit Pflegekraefte wieder pflegen koennen."
        description="CareAI ist in Wien gegruendet, in Europa verwurzelt, fuer den DACH-Raum entwickelt. Keine US-Investoren, kein Daten-Abzug."
        illustration={<PflegeTeam className="h-72 w-72" />}
      />
      <SecondaryNav active="/ueber-uns" />

      {/* Mission */}
      <section className="container py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Unsere Mission</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              In DACH fehlen bis 2030 rund 500.000 Pflegekraefte. Gleichzeitig verbringen Pflegende heute bis zu 35%
              ihrer Arbeitszeit mit Dokumentation. Unsere These: Ein erheblicher Teil dieser Zeit ist systematisch
              vermeidbar — wenn die Software endlich fuer, nicht gegen, die Pflegekraft arbeitet.
            </p>
            <p>
              CareAI gibt einen Teil der Zeit zurueck, die durch Doku verloren geht. Nicht, um mehr zu arbeiten. Sondern,
              um mehr bei Menschen zu sein. Das ist keine Software-Mission. Das ist eine Gesellschafts-Mission.
            </p>
          </div>
        </div>
      </section>

      {/* Werte */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="container py-16">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Was uns leitet</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {values.map((v) => (
              <Card key={v.title}>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container py-16">
        <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Team</h2>
        <p className="mt-3 text-muted-foreground">6 Menschen in Wien, wachsend.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {team.map((t) => (
            <Card key={t.name}>
              <CardContent className="p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 font-serif text-xl font-semibold text-primary-900">
                  {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="mt-4 font-semibold">{t.name}</div>
                <div className="text-sm text-primary">{t.role}</div>
                <p className="mt-2 text-sm text-muted-foreground">{t.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Zeitstrahl */}
      <section className="bg-muted/30">
        <div className="container py-16">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Von der Idee bis heute</h2>
          <ol className="mt-8 space-y-8 ">
            <TimelineItem date="Okt 2025" title="Die Idee" badge="Start">
              Konstantin sieht seine Grossmutter auf der Pflegestation Papierkram produzieren. Der Ausloeser.
            </TimelineItem>
            <TimelineItem date="Nov 2025" title="Erste Codezeile">
              Prototyp mit Claude + Next.js. Spracheingabe funktioniert in 3 Tagen.
            </TimelineItem>
            <TimelineItem date="Dez 2025" title="Erste Pilot-Einrichtung" badge="Wien">
              St. Elisabeth Wien testet CareAI ueber 4 Wochen. Feedback: „Gebt uns die Produktiv-Version sofort.”
            </TimelineItem>
            <TimelineItem date="Jan 2026" title="v1.0 General Availability" badge="GA">
              CareAI wird regulaer kaufbar. Drei zahlende Kunden in der ersten Woche.
            </TimelineItem>
            <TimelineItem date="Mar 2026" title="Pentest + Angehoerigen-Portal" badge="Security">
              Cure53 attestiert keine kritischen Findings. Angehoerigen-Portal mit Einwilligungs-Layer.
            </TimelineItem>
            <TimelineItem date="Apr 2026" title="3 Pilot-Einrichtungen, 445 Betten" badge="Traction" last>
              Wien, Graz, Muenchen laufen im Vollbetrieb. Erste internationale Anfragen aus der Schweiz.
            </TimelineItem>
          </ol>
        </div>
      </section>
    </>
  );
}
