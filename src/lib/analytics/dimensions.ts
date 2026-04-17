import type { AllowedDimension } from "./types";

/**
 * Allowlist erlaubter Dimensionen. Alles andere wird verworfen.
 * Bewusst KEINE User-IDs, keine Query-Params, keine Freitext-Felder.
 */
export const ALLOWED_DIMENSIONS: readonly AllowedDimension[] = [
  "role",
  "facility",
  "page",
  "feature",
  "metric",
  "errorType",
  "vitalName",
] as const;

export const ALLOWED_ROLES = new Set(["pflege", "pdl", "admin", "arzt", "angehoeriger"]);

/** Normalisiert Page-URL auf ein sicheres Pattern (keine IDs, keine Query). */
export function normalizePage(raw: string): string {
  if (!raw) return "/";
  let path = raw.split("?")[0].split("#")[0];
  if (!path.startsWith("/")) path = `/${path}`;
  // Ersetze offensichtliche IDs (cuid, uuid, numerische IDs, alles was lang+mixed ist)
  path = path.replace(/\/[0-9a-fA-F]{8,}/g, "/:id");
  path = path.replace(/\/\d{3,}/g, "/:id");
  // Max 6 Segmente
  const segs = path.split("/").slice(0, 7);
  return segs.join("/") || "/";
}

export function sanitizeFeature(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  if (!/^[a-z0-9.-]{1,64}$/i.test(raw)) return undefined;
  return raw.toLowerCase();
}

export function sanitizeRole(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const r = raw.toLowerCase();
  return ALLOWED_ROLES.has(r) ? r : undefined;
}

export function sanitizeFacility(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  if (!/^[a-z0-9-]{1,32}$/i.test(raw)) return undefined;
  return raw.toLowerCase();
}
