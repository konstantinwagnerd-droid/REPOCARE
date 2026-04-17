/**
 * White-Label Brand-Builder Typen.
 *
 * Alles in-memory / lokal-persistiert — kein Schema-Change. Eine BrandConfig
 * repräsentiert das Erscheinungsbild eines Mandanten (Tenant / Trägerverbund).
 */

export interface BrandIdentity {
  productName: string; // ersetzt "CareAI"
  tagline: string;
  footerText: string;
  supportEmail: string;
  supportPhone: string;
}

export interface BrandColors {
  primary: string; // HEX
  accent: string; // HEX
  gradientFrom: string;
  gradientTo: string;
}

export interface BrandTypography {
  headline: HeadlineFont;
  body: BodyFont;
}

export type HeadlineFont = "Fraunces" | "Playfair Display" | "EB Garamond" | "Alegreya" | "Instrument Serif";
export type BodyFont = "Geist" | "Inter Tight" | "Manrope" | "DM Sans" | "Atkinson Hyperlegible";

export interface BrandDomain {
  customDomain: string;
  sslStatus: "pending" | "issued" | "failed" | "n/a";
}

export interface BrandAssets {
  logoDataUrl: string | null;
  faviconDataUrl: string | null;
  socialPreviewDataUrl: string | null;
  emailHeaderDataUrl: string | null;
}

export interface BrandConfig {
  id: string;
  tenantId: string;
  identity: BrandIdentity;
  colors: BrandColors;
  typography: BrandTypography;
  domain: BrandDomain;
  assets: BrandAssets;
  updatedAt: string;
}

export interface BrandPreset {
  id: string;
  label: string;
  description: string;
  colors: BrandColors;
  typography: BrandTypography;
}

export interface ContrastCheckResult {
  ratio: number; // 1..21
  wcagAA: boolean; // ≥ 4.5 für Text
  wcagAAA: boolean; // ≥ 7
  note: string;
}
