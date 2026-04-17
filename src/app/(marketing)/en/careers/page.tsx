import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Careers", alternates: { canonical: "/en/careers", languages: { "de-DE": "/karriere", "en-US": "/en/careers" } } };

const openings = [
  { title: "Senior Full-Stack Engineer (TypeScript / Next.js)", location: "Vienna or remote (EU)", type: "Full-time" },
  { title: "Clinical Product Manager", location: "Vienna", type: "Full-time" },
  { title: "Customer Success Manager (DACH)", location: "Berlin or Vienna", type: "Full-time" },
  { title: "ML Engineer (Speech / NLP)", location: "Remote (EU)", type: "Full-time" },
  { title: "Enterprise Account Executive", location: "Munich or Vienna", type: "Full-time" },
];

export default function EnCareersPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Careers</Badge>
      <h1 className="font-serif text-5xl font-semibold">Work on what matters.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Join a team that builds calm technology for the people who take care of everyone else.
      </p>
      <div className="mt-10 grid gap-4">
        {openings.map((o) => (
          <Card key={o.title}><CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <h2 className="font-semibold">{o.title}</h2>
              <p className="text-sm text-muted-foreground">{o.location} · {o.type}</p>
            </div>
            <a href="mailto:jobs@careai.at" className="text-sm font-medium text-primary">Apply →</a>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
