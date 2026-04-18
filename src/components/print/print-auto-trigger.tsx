"use client";
import { Suspense } from "react";
import { useAutoPrint } from "@/hooks/use-auto-print";

function Inner() {
  useAutoPrint();
  return null;
}

/**
 * Client-Komponente, die window.print() triggert wenn ?print=auto.
 * Suspense wegen useSearchParams.
 */
export function PrintAutoTrigger() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
