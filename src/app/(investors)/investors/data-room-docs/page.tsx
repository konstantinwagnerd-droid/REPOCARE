import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Data Room Dokumente — CareAI" };

const docs = [
  { title: "Gesellschaftsvertrag-Muster (GmbH i.Gr.)", kind: "Legal", path: "/investors/exports/gesellschaftsvertrag-muster.pdf", size: "184 KB" },
  { title: "Term-Sheet-Template SAFE (Pre-Money 5M Cap)", kind: "Legal", path: "/investors/exports/term-sheet-safe.pdf", size: "112 KB" },
  { title: "MNDA (Mutual NDA) — Template", kind: "Legal", path: "/investors/exports/mnda-template.pdf", size: "98 KB" },
  { title: "Datenschutzfolgenabschaetzung (DSFA)", kind: "Compliance", path: "/investors/exports/dsfa-careai.pdf", size: "342 KB" },
  { title: "Pitch Deck (16 Folien, April 2026)", kind: "Pitch", path: "/investors/exports/careai-pitch-deck.pdf", size: "2,4 MB" },
  { title: "Businessplan (ausfuehrlich, 48 Seiten)", kind: "Pitch", path: "/investors/exports/careai-businessplan.pdf", size: "3,8 MB" },
  { title: "Integrale Planung 2026-2029 (Excel)", kind: "Finanzen", path: "/investors/exports/careai-financial-model.xlsx", size: "412 KB" },
  { title: "Lebenslauf Konstantin Wagner", kind: "Team", path: "/investors/exports/cv-konstantin-wagner.pdf", size: "128 KB" },
  { title: "KI-Ethik-Charta CareAI", kind: "Compliance", path: "/investors/exports/ki-ethik-charta.pdf", size: "78 KB" },
  { title: "EU AI Act Konformitaetsbewertung (draft)", kind: "Compliance", path: "/investors/exports/ai-act-assessment.pdf", size: "256 KB" },
  { title: "Mietvertrag Hauptsitz Wien", kind: "Legal", path: "/investors/exports/mietvertrag-wien.pdf", size: "180 KB" },
  { title: "Auftragsverarbeitungsvertrag (Master)", kind: "Legal", path: "/investors/exports/avv-master.pdf", size: "142 KB" },
];

export default function DataRoomDocsPage() {
  return (
    <div className="container py-10">
      <h1 className="font-serif text-3xl font-semibold">Dokumenten-Liste</h1>
      <p className="mt-2 text-muted-foreground">
        Vertrauliche Dokumente. Download nur mit gueltigem Investor-Token. Jeder Zugriff wird protokolliert.
      </p>

      <div className="mt-8 grid gap-3">
        {docs.map((d) => (
          <Card key={d.title}>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.kind} · {d.size}</p>
                </div>
              </div>
              <Link
                href={d.path}
                target="_blank"
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary"
              >
                <Download className="h-4 w-4" /> Download
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
