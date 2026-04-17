"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Database, FileCode2, FileText, FileSpreadsheet, Layers } from "lucide-react";
import type { MigrationSource } from "@/lib/migration/types";

const SOURCES: Array<{
  id: MigrationSource;
  title: string;
  desc: string;
  format: string;
  icon: typeof Database;
}> = [
  {
    id: "medifox",
    title: "Medifox",
    desc: `Marktführer in DE, Export via "Datei → Exportieren → Bewohnerstamm".`,
    format: "CSV (UTF-8, Semikolon)",
    icon: Database,
  },
  {
    id: "dan",
    title: "DAN GES.SYS",
    desc: "Klinikum- und Heim-Software, Export aus Verwaltungsmodul.",
    format: "XML oder TSV",
    icon: FileCode2,
  },
  {
    id: "vivendi",
    title: "Vivendi PD",
    desc: "Connext-Software, Export aus Stammdaten-Modul.",
    format: "XML (VivendiExport)",
    icon: Layers,
  },
  {
    id: "senso",
    title: "SenSo / Sensopflege",
    desc: "Verbreitet bei ambulanten Diensten, Semikolon-CSV-Export.",
    format: "CSV",
    icon: FileSpreadsheet,
  },
  {
    id: "csv-generic",
    title: "Allgemeines CSV",
    desc: "Beliebiges CSV/Excel (als CSV exportiert) — mit manuellem Mapping.",
    format: "CSV",
    icon: FileText,
  },
];

export function SourcePicker({
  value,
  onChange,
}: {
  value: MigrationSource | null;
  onChange: (v: MigrationSource) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Quell-System" className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {SOURCES.map((s) => {
        const active = value === s.id;
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(s.id)}
            className={cn(
              "group relative text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl",
            )}
          >
            <Card
              className={cn(
                "h-full transition-all",
                active && "border-primary ring-2 ring-primary/30 bg-primary/5",
                !active && "hover:border-primary/50 hover:shadow-md",
              )}
            >
              <CardContent className="flex gap-4 p-5">
                <span className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl",
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                )}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">{s.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{s.desc}</span>
                  <span className="mt-2 inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {s.format}
                  </span>
                </span>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
