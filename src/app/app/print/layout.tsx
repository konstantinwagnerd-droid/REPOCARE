import type { ReactNode } from "react";
import { PrintBodyClass } from "@/components/print/print-body-class";

/**
 * Layout fuer alle offiziellen Druck-Dokumente unter /app/print/*.
 * Setzt die Body-Klasse "print-document-page" (per Client-Component),
 * damit die @page-Regeln greifen und App-Chrome beim Druck ausgeblendet wird.
 */
export default function PrintLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PrintBodyClass />
      {children}
    </>
  );
}
