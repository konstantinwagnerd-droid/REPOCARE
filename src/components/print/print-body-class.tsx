"use client";
import { useEffect } from "react";

/**
 * Client-Komponente, die die body-Klasse "print-document-page" setzt/entfernt.
 * Wird von src/app/app/print/layout.tsx aus verwendet.
 */
export function PrintBodyClass() {
  useEffect(() => {
    const cls = "print-document-page";
    document.body.classList.add(cls);
    return () => document.body.classList.remove(cls);
  }, []);
  return null;
}
