import { redirect } from "next/navigation";
import { Calendar, Megaphone, Image as ImageIcon, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPartnerSession } from "@/components/partner/session";

export const metadata = { title: "Co-Marketing" };

const EVENTS = [
  { date: "2026-05-14", title: "Webinar: KI in der Pflege — für Systemhäuser", desc: "90 Minuten Produkt-Deep-Dive mit Q&A." },
  { date: "2026-06-03", title: "ALTENPFLEGE Messe Nürnberg", desc: "Gemeinsamer Stand für zertifizierte Partner." },
  { date: "2026-09-22", title: "CareAI Partner-Summit Wien", desc: "Jährliche Konferenz aller Partner. Vortragsslots verfügbar." },
];

const ASSETS = [
  { icon: ImageIcon, title: "Co-Branded Logo-Kit", desc: "Dein Logo neben CareAI — korrekt, konsistent, druckreif." },
  { icon: FileText, title: "One-Pager-Vorlage (editierbar)", desc: "Dein Co-Brand, 4 Vorlagen (Pflegeheim, Tagespflege, Ambulant, Reha)." },
  { icon: FileText, title: "E-Mail-Signaturen", desc: "HTML-Snippet für euer CRM, mit Partner-Badge." },
  { icon: FileText, title: "Social-Media-Kit", desc: "LinkedIn- & Xing-Posts + Grafiken für Launch-Kampagnen." },
];

export default async function CoMarketingPage() {
  const session = await getPartnerSession();
  if (!session) redirect("/partner/login");

  return (
    <div className="container max-w-5xl space-y-8 py-8">
      <header className="space-y-2">
        <Badge variant="outline">Co-Marketing</Badge>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">Gemeinsam sichtbar werden</h1>
        <p className="text-muted-foreground">
          Wir brauchen euch, um in der Pflege anzukommen — also machen wir eure Marke sichtbar.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Event-Kalender</h2>
        <div className="space-y-3">
          {EVENTS.map((e) => (
            <Card key={e.title}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Calendar className="size-5" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-semibold">{e.title}</h3>
                    <time dateTime={e.date} className="text-xs text-muted-foreground">
                      · {new Date(e.date).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
                    </time>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{e.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Marketing-Assets</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ASSETS.map((a) => (
            <Card key={a.title}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <a.icon className="size-5" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <CardContent className="flex items-start gap-3 p-5">
          <Megaphone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="text-sm">
            <strong>Co-Marketing-Briefing:</strong> Für jede gemeinsame Kampagne gibt es ein
            einseitiges Briefing mit Ziel, Zielgruppe, Kernbotschaft, Budget-Aufteilung und
            KPIs. Template im Ressourcen-Bereich.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
