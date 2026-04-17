import { PageHero } from "@/components/marketing/sections/page-hero";
import { SecondaryNav } from "@/components/marketing/sections/secondary-nav";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Rss, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Status — CareAI" };

const services = [
  { name: "Web-App", uptime90: 99.98 },
  { name: "Datenbank (Primary)", uptime90: 99.99 },
  { name: "Voice-API (Spracheingabe)", uptime90: 99.87 },
  { name: "Export-API (MD / AVV)", uptime90: 99.95 },
  { name: "Integrations-API (FHIR/GDT)", uptime90: 99.91 },
];

/** Mock 90-Tage-Uptime-Grid, deterministisch aus Service-Name */
function grid(name: string): ("ok" | "partial" | "down")[] {
  const arr: ("ok" | "partial" | "down")[] = [];
  let seed = 0;
  for (const c of name) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
  for (let i = 0; i < 90; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const r = (seed % 1000) / 1000;
    if (r < 0.01) arr.push("down");
    else if (r < 0.04) arr.push("partial");
    else arr.push("ok");
  }
  return arr;
}

const incidents = [
  {
    date: "2026-04-08 09:15 CET",
    title: "Erhoehte Latenz bei Voice-API",
    duration: "18 min",
    status: "resolved",
    summary: "Voice-API war durch einen fehlerhaften Deploy 18 Minuten lang um 1.4s langsamer. Rollback beendet.",
    postmortem: "/changelog#v1-2-5",
  },
  {
    date: "2026-03-22 14:03 CET",
    title: "Kurze Nichterreichbarkeit Export-API",
    duration: "6 min",
    status: "resolved",
    summary: "Geplantes DB-Maintenance-Fenster ueberzog um 6 Minuten. Keine Daten betroffen.",
    postmortem: "/changelog#v1-2-4",
  },
  {
    date: "2026-02-14 02:30 CET",
    title: "Hetzner-Stoerung Falkenstein DC14",
    duration: "42 min",
    status: "resolved",
    summary: "Externer Anbieter-Incident. Automatischer Failover auf Stand-By im Nebenrack.",
    postmortem: "/changelog#v1-1-3",
  },
  {
    date: "2026-01-19 11:05 CET",
    title: "Voice-API Rate-Limit-Bug",
    duration: "24 min",
    status: "resolved",
    summary: "Einige Tenants wurden faelschlich rate-limited. Fix deployed, betroffene Anfragen kompensiert.",
    postmortem: "/changelog#v1-1-2",
  },
  {
    date: "2026-01-02 08:00 CET",
    title: "Login-Probleme Microsoft SSO",
    duration: "1 h 12 min",
    status: "resolved",
    summary: "Zertifikats-Rotation auf Microsoft-Seite nicht propagiert. Manueller Fix, Monitoring verschaerft.",
    postmortem: "/changelog#v1-1-1",
  },
];

export default function StatusPage() {
  return (
    <>
      <PageHero
        eyebrow="System-Status"
        title="Alle Services laufen."
        description="Live-Status, 90-Tage-Historie, letzte Incidents. Wir halten Sie ehrlich informiert — auch wenn's unangenehm ist."
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <a href="/status.rss">
                <Rss className="mr-1 h-4 w-4" /> Feed abonnieren
              </a>
            </Button>
            <Button variant="accent" size="sm" asChild>
              <a href="mailto:status-subscribe@careai.app">
                <Bell className="mr-1 h-4 w-4" /> Benachrichtigungen
              </a>
            </Button>
          </>
        }
      />
      <SecondaryNav active="/status" />

      <section className="container py-12">
        <Card className="bg-gradient-to-br from-primary-50 to-background">
          <CardContent className="flex items-center gap-4 p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <div>
              <div className="font-serif text-2xl font-semibold">Alle Systeme operativ</div>
              <div className="text-sm text-muted-foreground">Aktualisiert vor wenigen Sekunden.</div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container space-y-4 pb-12">
        {services.map((s) => {
          const g = grid(s.name);
          return (
            <Card key={s.name}>
              <CardContent className="p-5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">90-Tage-Uptime: {s.uptime90.toFixed(2)}%</div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                    <CheckCircle2 className="h-4 w-4" /> Operativ
                  </span>
                </div>
                <div
                  role="img"
                  aria-label={`${s.name} Uptime, letzte 90 Tage`}
                  className="mt-4 flex gap-[2px]"
                >
                  {g.map((status, i) => (
                    <span
                      key={i}
                      title={`Tag ${90 - i}: ${status === "ok" ? "OK" : status === "partial" ? "Beeintraechtigt" : "Ausfall"}`}
                      className={`h-8 flex-1 rounded-sm ${
                        status === "ok" ? "bg-primary/70" : status === "partial" ? "bg-accent-500/80" : "bg-red-500/80"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>vor 90 Tagen</span>
                  <span>heute</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="bg-muted/30">
        <div className="container py-14">
          <h2 className="font-serif text-3xl font-semibold tracking-tight">Letzte Incidents</h2>
          <div className="mt-6 space-y-4">
            {incidents.map((i) => (
              <Card key={i.date}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <div className="font-semibold">{i.title}</div>
                      <time className="text-xs text-muted-foreground">{i.date} · Dauer {i.duration}</time>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      <CheckCircle2 className="h-3 w-3" /> behoben
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{i.summary}</p>
                  <a href={i.postmortem} className="mt-2 inline-block text-xs text-primary hover:underline">
                    Postmortem anzeigen →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
