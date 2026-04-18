import React from "react";
import { PrintAutoTrigger } from "./print-auto-trigger";

/**
 * Shared DIN-A4 Print-Page-Wrapper fuer alle offiziellen Pflege-Dokumente.
 *
 * - Nutzt die globalen @media print Regeln aus src/app/print.css.
 * - Zeigt am Bildschirm eine A4-aehnliche Vorschau (weisser Bogen, Schatten),
 *   beim Druck greift @page (siehe print.css).
 * - Client-Hook "PrintAutoTrigger" loest window.print() aus, wenn ?print=auto.
 */
export function PrintPage({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <>
      {title ? <title>{title}</title> : null}
      <div className="print-page-shell min-h-screen bg-[#ececec] py-8 print:bg-white print:py-0">
        <article
          className="print-sheet mx-auto bg-white text-black shadow-lg print:shadow-none"
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "15mm 15mm 20mm 15mm",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "10pt",
            lineHeight: 1.4,
            boxSizing: "border-box",
          }}
        >
          {children}
        </article>
      </div>
      <PrintAutoTrigger />
    </>
  );
}
