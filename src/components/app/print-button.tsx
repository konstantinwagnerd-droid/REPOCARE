"use client";

import { Printer } from "lucide-react";
import { useEffect } from "react";

/**
 * Dezenter "Drucken"-Button. Setzt optional eine Body-Klasse für @page-Regeln.
 */
export function PrintButton({ pageClass, label = "Drucken" }: { pageClass?: "print-handover" | "print-residents" | "print-dienstplan"; label?: string }) {
  useEffect(() => {
    if (!pageClass) return;
    document.body.classList.add(pageClass);
    return () => { document.body.classList.remove(pageClass); };
  }, [pageClass]);

  return (
    <button
      onClick={() => window.print()}
      aria-label={label}
      className="no-print inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm text-foreground transition-colors hover:bg-secondary"
    >
      <Printer className="h-4 w-4" /> {label}
    </button>
  );
}
