import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DatabaseZap, FileDown, ShieldCheck } from "lucide-react";
import { ImportWizard } from "@/components/migration/ImportWizard";

export const metadata = {
  title: "Daten-Migration | CareAI Admin",
  description: "Bewohner:innen-Daten aus Medifox, DAN, Vivendi, SenSo oder CSV importieren.",
};

export default function MigrationPage() {
  return (
    <div className="container max-w-6xl space-y-8 py-8">
      <header className="space-y-4">
        <Badge variant="outline" className="gap-1.5">
          <DatabaseZap className="size-3.5" />
          Daten-Migration
        </Badge>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold md:text-4xl">
              Eure Bestandsdaten, in CareAI — in 15 Minuten
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Importiert Stammdaten aus Medifox, DAN, Vivendi oder SenSo.
              Automatische Feld-Erkennung, Validierung, Dry-Run — und ein
              Audit-Report über jede importierte Zeile.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link
              href="/admin/migration/anleitung/medifox"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 hover:border-primary/50"
            >
              <FileDown className="size-4" />
              Export-Anleitungen
            </Link>
            <Link
              href="/docs/MIGRATION.md"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 hover:border-primary/50"
            >
              <ShieldCheck className="size-4" />
              Migrations-Handbuch
            </Link>
          </div>
        </div>
      </header>

      <ImportWizard />
    </div>
  );
}
