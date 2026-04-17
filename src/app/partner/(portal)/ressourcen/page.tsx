import { redirect } from "next/navigation";
import { Download, FileText, Presentation, BookOpen, BookMarked } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPartnerSession } from "@/components/partner/session";

export const metadata = { title: "Ressourcen" };

const RESOURCES = [
  { icon: Presentation, title: "Sales-Deck (DE, 22 Slides)", desc: "Das zentrale Verkaufs-Deck. Co-branded verfügbar.", format: "PDF / PPTX", size: "8,4 MB" },
  { icon: FileText, title: "Preisliste Q2 2026", desc: "Aktuelle Listenpreise für Starter, Professional, Enterprise. Gilt bis 30.06.", format: "PDF", size: "240 KB" },
  { icon: BookOpen, title: "Partner-FAQ", desc: "43 Fragen, die Kund:innen und ihr euch stellen werdet.", format: "PDF", size: "1,1 MB" },
  { icon: BookMarked, title: "Sales-Playbook", desc: "Qualifizierung, Einwände, Referenzen, Abschluss-Technik.", format: "PDF, 28 Seiten", size: "2,8 MB" },
  { icon: FileText, title: "Produkt-One-Pager (DE)", desc: "Kompakt für erste E-Mails und Messen. Co-Branding möglich.", format: "PDF", size: "320 KB" },
  { icon: FileText, title: "Technisches Datenblatt", desc: "Architektur, APIs, Hosting, Security — für IT-Entscheider:innen.", format: "PDF", size: "1,4 MB" },
  { icon: FileText, title: "ROI-Berechnungs-Vorlage (Excel)", desc: "Gemeinsam mit der Einrichtung den ROI rechnen.", format: "XLSX", size: "96 KB" },
  { icon: FileText, title: "DSGVO-Briefing für Träger", desc: "Einseitige Erklärung für datenschutzsensible Gespräche.", format: "PDF", size: "180 KB" },
];

export default async function RessourcenPage() {
  const session = await getPartnerSession();
  if (!session) redirect("/partner/login");

  return (
    <div className="container max-w-5xl space-y-8 py-8">
      <header className="space-y-2">
        <Badge variant="outline">Ressourcen</Badge>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">Alles was du zum Verkaufen brauchst</h1>
        <p className="text-muted-foreground">
          Sales-Materialien, Preislisten, Playbooks — immer aktuell, auf Deutsch.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {RESOURCES.map((r) => (
          <Card key={r.title}>
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <r.icon className="size-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-0.5">{r.format}</span>
                  <span>{r.size}</span>
                </div>
              </div>
              <button
                type="button"
                aria-label={`${r.title} herunterladen`}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Download className="size-4" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
