import type { BrandPreset } from "./types";

export const PRESETS: BrandPreset[] = [
  {
    id: "careai-default",
    label: "CareAI Default",
    description: "Das Original — ruhiges Blau-Grün mit Serif-Akzenten.",
    colors: { primary: "#0F766E", accent: "#E11D48", gradientFrom: "#0F766E", gradientTo: "#14B8A6" },
    typography: { headline: "Fraunces", body: "Geist" },
  },
  {
    id: "warm-herbst",
    label: "Warm-Herbst",
    description: "Erdige Bernstein- und Terrakotta-Töne für familiäre Häuser.",
    colors: { primary: "#B45309", accent: "#9A3412", gradientFrom: "#B45309", gradientTo: "#F59E0B" },
    typography: { headline: "EB Garamond", body: "DM Sans" },
  },
  {
    id: "kuehl-modern",
    label: "Kühl-Modern",
    description: "Klares Indigo mit hoher Kontrast-Ästhetik für urbane Träger.",
    colors: { primary: "#4338CA", accent: "#0EA5E9", gradientFrom: "#4338CA", gradientTo: "#06B6D4" },
    typography: { headline: "Playfair Display", body: "Inter Tight" },
  },
  {
    id: "christlich-sanft",
    label: "Christlich-Sanft",
    description: "Gedämpftes Violett-Gold für kirchliche und diakonische Träger.",
    colors: { primary: "#6D28D9", accent: "#CA8A04", gradientFrom: "#6D28D9", gradientTo: "#A78BFA" },
    typography: { headline: "Alegreya", body: "Manrope" },
  },
  {
    id: "klinik-clean",
    label: "Klinik-Clean",
    description: "Medizinisches Blau-Weiß, klinisch sachlich, maximale Lesbarkeit.",
    colors: { primary: "#0369A1", accent: "#0891B2", gradientFrom: "#0369A1", gradientTo: "#38BDF8" },
    typography: { headline: "Instrument Serif", body: "Atkinson Hyperlegible" },
  },
  {
    id: "dunkel-premium",
    label: "Dunkel-Premium",
    description: "Anthrazit mit Champagner-Gold für Premium-Privatträger.",
    colors: { primary: "#18181B", accent: "#D4A24C", gradientFrom: "#27272A", gradientTo: "#D4A24C" },
    typography: { headline: "Fraunces", body: "Geist" },
  },
];

export function presetById(id: string): BrandPreset | undefined {
  return PRESETS.find((p) => p.id === id);
}
