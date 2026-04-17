import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "CareAI — Documentación asistencial con IA", template: "%s | CareAI" },
  description: "CareAI es la suite de documentación asistencial con IA para proveedores DACH y europeos. Entrada por voz, automatización SIS, registro de auditoría conforme MDK.",
  alternates: {
    canonical: "/es",
    languages: { "de-DE": "/", "en-US": "/en", "fr-FR": "/fr", "it-IT": "/it", "es-ES": "/es", "x-default": "/" },
  },
};

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return <div lang="es">{children}</div>;
}
