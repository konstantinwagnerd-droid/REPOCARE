"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal-Glossar fuer haeufige Fachbegriffe in der Pflege.
 * Erweiterbar — Key ist kleingeschrieben.
 */
export const PFLEGE_GLOSSAR: Record<string, string> = {
  sis:
    "Strukturierte Informationssammlung — standardisiertes Assessment-Instrument in der Pflege (6 Themenfelder nach Krohwinkel/Beikirch).",
  dekubitus:
    "Druckgeschwuer — Hautschaedigung durch anhaltenden Druck auf Gewebe. Risikobewertung: Braden-/Norton-Skala.",
  fem:
    "Freiheitsentziehende Massnahme — jede Einschraenkung der Bewegungsfreiheit; benoetigt strenge Dokumentation und ggf. richterliche Genehmigung.",
  sgb: "Sozialgesetzbuch — regelt in Deutschland u.a. die Pflegeversicherung (SGB XI).",
  mdk:
    "Medizinischer Dienst der Krankenversicherung — prueft Pflegequalitaet und Pflegegrad-Einstufungen.",
  pflegegrad:
    "Einstufung der Pflegebeduerftigkeit von 1 bis 5 (SGB XI). Bestimmt den Leistungsumfang der Pflegeversicherung.",
  azg:
    "Arbeitszeitgesetz — regelt Hoechstarbeitszeiten, Ruhepausen und -zeiten (DE: ArbZG, AT: AZG).",
  qi: "Qualitaetsindikator — kennzahlenbasiertes Mass der Pflegequalitaet (z.B. Sturzrate, Dekubitusrate).",
  sgb_xi: "Elftes Sozialgesetzbuch — rechtliche Grundlage der Pflegeversicherung in Deutschland.",
  pdl: "Pflegedienstleitung — verantwortlich fuer Organisation und Qualitaet der Pflege.",
};

interface GlossarTipProps {
  /** Der Fachbegriff, wird als Key (lowercase) im Glossar nachgeschlagen. */
  term: string;
  /** Optional: abweichender Anzeigetext (sonst `term`). */
  children?: React.ReactNode;
  /** Optional: Override-Erklaerung statt Glossar-Lookup. */
  explanation?: string;
  className?: string;
}

export function GlossarTip({ term, children, explanation, className }: GlossarTipProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const def = explanation ?? PFLEGE_GLOSSAR[term.toLowerCase()] ?? "Keine Definition hinterlegt.";

  return (
    <span className={cn("relative inline-block", className)}>
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className="cursor-help border-b border-dotted border-muted-foreground/70 text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {children ?? term}
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-0 top-full z-50 mt-1 w-72 rounded-lg border border-border bg-popover p-3 text-xs leading-relaxed text-popover-foreground shadow-lg"
        >
          <strong className="block text-sm">{children ?? term.toUpperCase()}</strong>
          <span className="mt-1 block text-muted-foreground">{def}</span>
        </span>
      )}
    </span>
  );
}
