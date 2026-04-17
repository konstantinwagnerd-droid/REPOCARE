"use client";

import { Printer } from "lucide-react";

export function PrintButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm print:hidden"
      }
    >
      <Printer className="size-4" /> Drucken
    </button>
  );
}
