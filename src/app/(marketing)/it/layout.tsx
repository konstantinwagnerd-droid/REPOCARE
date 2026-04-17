import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "CareAI — Documentazione assistenziale basata sull'IA", template: "%s | CareAI" },
  description: "CareAI è la suite di documentazione assistenziale basata sull'IA per i fornitori DACH ed europei. Input vocale, automazione SIS, audit trail conforme MDK.",
  alternates: {
    canonical: "/it",
    languages: { "de-DE": "/", "en-US": "/en", "fr-FR": "/fr", "it-IT": "/it", "es-ES": "/es", "x-default": "/" },
  },
};

export default function ItLayout({ children }: { children: React.ReactNode }) {
  return <div lang="it">{children}</div>;
}
