import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FactSheet } from "@/components/presse/FactSheet";
import { factSheet } from "@/components/presse/data";
import { PrintButton } from "@/components/presse/PrintButton";

export const metadata = {
  title: "Über CareAI — Fact-Sheet | Presse",
  description: "Fact-Sheet über CareAI: Unternehmen, Mission, Markt, Produkt, Compliance und Pressekontakt.",
};

export default function UeberCareAIPage() {
  return (
    <div className="container max-w-4xl space-y-8 py-12">
      <div className="print:hidden">
        <Link
          href="/presse"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Zurück zum Presse-Hub
        </Link>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-3">Fact-Sheet</Badge>
          <h1 className="font-serif text-3xl font-semibold md:text-4xl">
            Über CareAI
          </h1>
          <p className="mt-2 text-muted-foreground">
            Alle relevanten Fakten auf einer Seite. Stand:{" "}
            {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}.
          </p>
        </div>
        <PrintButton />
      </header>

      <FactSheet sections={factSheet} />

      <footer className="print:block border-t border-border pt-6 text-sm text-muted-foreground">
        CareAI GmbH · Wien, Österreich · presse@careai.health · +43 1 xxx xxxx<br />
        Dieses Fact-Sheet darf unverändert und mit Quellenangabe frei verwendet werden.
      </footer>
    </div>
  );
}
