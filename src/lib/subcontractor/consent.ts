/**
 * Consent-Modell: pro Bewohner:in definiert, welcher Subunternehmer welche
 * Datenkategorien in welchem Zeitraum einsehen darf (DSGVO Art. 28 / Art. 9).
 */

import type { ConsentScope, DataCategory } from "./types";

export interface ConsentCheckResult {
  allowed: boolean;
  reason?: string;
  scope?: ConsentScope;
}

export function checkConsent(
  scopes: ConsentScope[],
  input: { subcontractorId: string; residentId: string; category: DataCategory; now?: Date },
): ConsentCheckResult {
  const now = input.now ?? new Date();
  const match = scopes.find(
    (s) =>
      s.subcontractorId === input.subcontractorId &&
      s.residentId === input.residentId &&
      !s.revokedAt &&
      s.categories.includes(input.category),
  );
  if (!match) return { allowed: false, reason: "Kein Consent vorhanden" };
  if (new Date(match.validFrom) > now)
    return { allowed: false, reason: "Consent noch nicht gueltig", scope: match };
  if (match.validUntil && new Date(match.validUntil) < now)
    return { allowed: false, reason: "Consent abgelaufen", scope: match };
  return { allowed: true, scope: match };
}

export function grantConsent(input: {
  tenantId: string;
  subcontractorId: string;
  residentId: string;
  residentName?: string;
  categories: DataCategory[];
  validFrom?: string;
  validUntil?: string;
  grantedByName: string;
  grantedByRelation?: string;
  note?: string;
}): ConsentScope {
  return {
    id: `cs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tenantId: input.tenantId,
    subcontractorId: input.subcontractorId,
    residentId: input.residentId,
    residentName: input.residentName,
    categories: input.categories,
    validFrom: input.validFrom ?? new Date().toISOString(),
    validUntil: input.validUntil,
    grantedByName: input.grantedByName,
    grantedByRelation: input.grantedByRelation,
    note: input.note,
  };
}

export function revokeConsent(scope: ConsentScope, reason?: string): ConsentScope {
  return { ...scope, revokedAt: new Date().toISOString(), note: reason ?? scope.note };
}

export function allowedResidentsFor(
  scopes: ConsentScope[],
  subcontractorId: string,
): Array<{ residentId: string; residentName?: string; categories: DataCategory[] }> {
  const now = Date.now();
  const map = new Map<string, { residentId: string; residentName?: string; categories: Set<DataCategory> }>();
  for (const s of scopes) {
    if (s.subcontractorId !== subcontractorId) continue;
    if (s.revokedAt) continue;
    if (new Date(s.validFrom).getTime() > now) continue;
    if (s.validUntil && new Date(s.validUntil).getTime() < now) continue;
    const e = map.get(s.residentId) ?? { residentId: s.residentId, residentName: s.residentName, categories: new Set<DataCategory>() };
    s.categories.forEach((c) => e.categories.add(c));
    map.set(s.residentId, e);
  }
  return Array.from(map.values()).map((e) => ({
    residentId: e.residentId,
    residentName: e.residentName,
    categories: Array.from(e.categories),
  }));
}
