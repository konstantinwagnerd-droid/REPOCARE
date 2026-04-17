import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "CareAI — Documentation de soins pilotée par l'IA", template: "%s | CareAI" },
  description: "CareAI est la suite de documentation de soins pilotée par l'IA pour les prestataires DACH et l'Europe. Dictée vocale, automatisation SIS, piste d'audit conforme MDK.",
  alternates: {
    canonical: "/fr",
    languages: { "de-DE": "/", "en-US": "/en", "fr-FR": "/fr", "it-IT": "/it", "es-ES": "/es", "x-default": "/" },
  },
};

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return <div lang="fr">{children}</div>;
}
