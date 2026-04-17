import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Team — CareAI Data Room" };

const current = [
  {
    name: "Konstantin Wagner",
    role: "Founder, CEO",
    bio: "19, WU Wien (BSc Wirtschaft, 2. Semester), >30h/Woche Fokus auf CareAI. Vorherige Projekte: Jarvis (KI-Orchestrierung), GVS-Chatbot. Pflege-Domain-Wissen durch 18 Monate Shadowing in 5 Einrichtungen.",
  },
];

const planned = [
  {
    name: "CTO",
    role: "CTO (in Gespraechen)",
    bio: "Ex-N26 Senior Engineer. 8+ Jahre TypeScript, Next.js, Postgres, verteilte Systeme. Start geplant Q3/2026 bei erfolgter Finanzierung. Commitment muendlich erteilt.",
  },
  {
    name: "Pflege-Expert:in",
    role: "Chief Care Officer (in Auswahl)",
    bio: "3 Kandidatinnen mit 10-18 Jahren Pflegepraxis + Fuehrungserfahrung (ehem. PDL, Traegerverband). Finale Auswahl bis Mai 2026.",
  },
  {
    name: "Senior Engineer",
    role: "Full-Stack Engineer",
    bio: "Rolle ausgeschrieben, 4 Final-Kandidaten. Fokus: Voice-Pipeline, Infrastructure, EU-Hosting.",
  },
];

const advisors = [
  {
    name: "Prof. Dr. B. Wingenfeld (angefragt)",
    role: "Pflegewissenschaftlicher Beirat",
    bio: "Urheber des Neuen Begutachtungsassessments, fuehrender DACH-Pflegewissenschaftler.",
  },
  {
    name: "Dr. S. Huber (verbindlich)",
    role: "Legal Advisor",
    bio: "Jurist mit EU AI Act- und DSGVO-Spezialisierung, Ex-Bundeskanzleramt AT.",
  },
  {
    name: "M. Reiter (verbindlich)",
    role: "GTM Advisor",
    bio: "Ex-Sales-Lead Compugroup, 15 Jahre DACH-Pflegemarkt-Erfahrung.",
  },
];

export default function TeamPage() {
  return (
    <div className="container py-10">
      <h1 className="font-serif text-3xl font-semibold">Team</h1>
      <p className="mt-2 text-muted-foreground">Klein und fokussiert heute — geplantes Wachstum mit Finanzierung.</p>

      <section className="mt-8">
        <h2 className="mb-4 font-serif text-xl font-semibold">Heute im Team</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {current.map((p) => (
            <Card key={p.name}>
              <CardContent className="p-6">
                <p className="text-xs uppercase text-primary">{p.role}</p>
                <p className="mt-1 font-serif text-lg font-semibold">{p.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-serif text-xl font-semibold">Geplantes Team (nach Seed)</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {planned.map((p) => (
            <Card key={p.name}>
              <CardContent className="p-5">
                <p className="text-xs uppercase text-muted-foreground">{p.role}</p>
                <p className="mt-1 font-serif text-lg font-semibold">{p.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-serif text-xl font-semibold">Beirat und Advisors</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {advisors.map((p) => (
            <Card key={p.name}>
              <CardContent className="p-5">
                <p className="text-xs uppercase text-muted-foreground">{p.role}</p>
                <p className="mt-1 font-serif text-base font-semibold">{p.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
