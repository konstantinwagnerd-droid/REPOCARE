import { redirect } from "next/navigation";
import { Award, CheckCircle2, PlayCircle, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPartnerSession } from "@/components/partner/session";
import { CertificationQuiz } from "@/components/partner/CertificationQuiz";

export const metadata = { title: "Schulungen" };

const MODULES = [
  { n: 1, title: "Produkt-Grundlagen", duration: "35 Min", topics: ["SIS & Risiko-Scores", "Sprach-Eingabe", "Schichtbericht", "Angehörigen-Portal"], completed: true },
  { n: 2, title: "Zielgruppen & Personas", duration: "25 Min", topics: ["PDL vs. Geschäftsführung", "Pain-Points je Rolle", "Buyer-Journey"], completed: true },
  { n: 3, title: "Preise & Lizenz-Modell", duration: "20 Min", topics: ["Starter / Pro / Enterprise", "Rabatt-Regeln", "Mehrhaus-Konstellationen"], completed: true },
  { n: 4, title: "DSGVO & EU AI Act für Sales", duration: "40 Min", topics: ["Compliance-Argumente", "Häufige Einwände", "AV-Vertrag"], completed: false },
  { n: 5, title: "Einwand-Behandlung", duration: "30 Min", topics: ["Preis-Einwand", "IT-Widerstand", "Personalrat"], completed: false },
  { n: 6, title: "Abschluss-Prüfung (Quiz)", duration: "15 Min", topics: ["12 Fragen, 80 % zum Bestehen"], completed: false },
];

export default async function SchulungenPage() {
  const session = await getPartnerSession();
  if (!session) redirect("/partner/login");
  const completed = MODULES.filter((m) => m.completed).length;
  const percent = Math.round((completed / MODULES.length) * 100);

  return (
    <div className="container max-w-4xl space-y-8 py-8">
      <header className="space-y-2">
        <Badge variant="outline">Schulungen</Badge>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">CareAI Certified Partner</h1>
        <p className="text-muted-foreground">
          {session.certified
            ? "Du bist zertifiziert. Gratuliere! Die Kurse bleiben dir für Auffrischungen erhalten."
            : `Schließe die 6 Module ab — 80 % im Quiz und du bist offiziell Certified. Aktuell: ${completed} von ${MODULES.length} Modulen fertig.`}
        </p>
      </header>

      {!session.certified && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Award className="size-6" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Fortschritt</span>
                  <span>{percent} %</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {MODULES.map((m) => (
          <Card key={m.n}>
            <CardContent className="flex items-start gap-4 p-5">
              <div className={
                "flex size-11 shrink-0 items-center justify-center rounded-xl " +
                (m.completed
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-muted-foreground")
              }>
                {m.completed ? <CheckCircle2 className="size-5" /> : <span className="font-semibold">{m.n}</span>}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="font-semibold">{m.title}</h3>
                  <span className="text-xs text-muted-foreground">· {m.duration}</span>
                </div>
                <ul className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
                  {m.topics.map((t) => (
                    <li key={t} className="rounded-full bg-muted px-2 py-0.5">{t}</li>
                  ))}
                </ul>
              </div>
              <Button variant={m.completed ? "outline" : "default"} size="sm">
                {m.completed ? (
                  <>
                    <CheckCircle2 className="size-4" />
                    Bestanden
                  </>
                ) : (
                  <>
                    <PlayCircle className="size-4" />
                    Starten
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {!session.certified && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold">
              {completed < MODULES.length - 1 && <Lock className="size-5 text-muted-foreground" aria-hidden="true" />}
              Abschluss-Quiz (Beispiel-Fragen)
            </h2>
            <p className="text-sm text-muted-foreground">
              Das echte Quiz wird nach Modul 5 freigeschaltet. Hier schon mal 3 Beispiel-Fragen zum Üben.
            </p>
            <CertificationQuiz />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
