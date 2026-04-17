/**
 * Gradient-Presets — radial, linear, mesh, animiert.
 * Nutzung als className (Tailwind-kompatible arbitrary values) oder als style.
 */
import { brand } from "./tokens";

export const gradients = {
  heroMesh: `
    radial-gradient(at 20% 10%, ${brand.primary[100]} 0px, transparent 50%),
    radial-gradient(at 80% 0%, ${brand.accent[100]} 0px, transparent 45%),
    radial-gradient(at 50% 90%, ${brand.primary[50]} 0px, transparent 55%)
  `,
  heroMeshDark: `
    radial-gradient(at 20% 10%, ${brand.primary[900]}55 0px, transparent 50%),
    radial-gradient(at 80% 0%, ${brand.accent[900]}40 0px, transparent 45%),
    radial-gradient(at 50% 90%, ${brand.primary[800]}44 0px, transparent 55%)
  `,
  brandLinear: `linear-gradient(135deg, ${brand.primary[700]} 0%, ${brand.primary[900]} 100%)`,
  accentLinear: `linear-gradient(135deg, ${brand.accent[500]} 0%, ${brand.accent[700]} 100%)`,
  surfaceSoft: `linear-gradient(180deg, ${brand.primary[50]}66 0%, transparent 100%)`,
  premiumCard: `linear-gradient(135deg, ${brand.primary[50]} 0%, ${brand.primary[100]} 40%, ${brand.accent[50]} 100%)`,
  auroraTop: `linear-gradient(180deg, ${brand.primary[50]}99 0%, transparent 60%)`,
  radialGlow: (color: string) => `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
} as const;

export const gradientClasses = {
  brand: "bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900",
  brandSoft: "bg-gradient-to-br from-primary-50 via-background to-accent-50/40",
  accent: "bg-gradient-to-br from-accent-500 to-accent-700",
  surface: "bg-gradient-to-b from-primary-50/60 via-background to-background",
  premium: "bg-gradient-to-br from-primary-50 via-primary-100 to-accent-50",
} as const;
