"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Löst automatisch den Druck-Dialog aus, wenn ?print=auto in der URL steht.
 * Kleiner Delay, damit das Layout + Fonts geladen sind.
 */
export function useAutoPrint(delayMs = 600) {
  const params = useSearchParams();
  useEffect(() => {
    if (params.get("print") !== "auto") return;
    const t = setTimeout(() => {
      try {
        window.print();
      } catch {
        /* ignorieren, z.B. in Headless-Tests */
      }
    }, delayMs);
    return () => clearTimeout(t);
  }, [params, delayMs]);
}
