/**
 * Access-Control fuer Subunternehmer-Rolle "external".
 *
 * Minimal-invasiv: pruefen ausschliesslich ueber Consent-Scope, nicht ueber
 * Rollen-Hierarchie. Ein:e Externe:r sieht NUR das, was ein konkreter
 * Consent erlaubt.
 */

import type { ConsentScope, DataCategory, SubAuditEntry } from "./types";
import { checkConsent } from "./consent";

export interface FilteredResidentView {
  residentId: string;
  residentName?: string;
  allowedCategories: DataCategory[];
  data: Partial<Record<DataCategory, unknown>>;
}

export interface AccessCheck {
  allowed: boolean;
  reason?: string;
  auditEntry: SubAuditEntry;
}

export function guardAccess(
  scopes: ConsentScope[],
  input: {
    tenantId: string;
    subcontractorId: string;
    residentId: string;
    category: DataCategory;
    action: string;
  },
): AccessCheck {
  const res = checkConsent(scopes, input);
  const entry: SubAuditEntry = {
    id: `sa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tenantId: input.tenantId,
    subcontractorId: input.subcontractorId,
    at: new Date().toISOString(),
    action: input.action,
    residentId: input.residentId,
    dataCategory: input.category,
    success: res.allowed,
  };
  return { allowed: res.allowed, reason: res.reason, auditEntry: entry };
}

/** Filtert ein Resident-Objekt auf erlaubte Kategorien. */
export function filterResidentView(
  scopes: ConsentScope[],
  subcontractorId: string,
  raw: {
    residentId: string;
    residentName?: string;
    vitals?: unknown;
    medikation?: unknown;
    wunden?: unknown;
    berichte?: unknown;
    diagnosen?: unknown;
    sis?: unknown;
  },
): FilteredResidentView {
  const allowedCategories: DataCategory[] = [];
  const data: FilteredResidentView["data"] = {};
  const cats: DataCategory[] = ["vitals", "medikation", "wunden", "berichte", "diagnosen", "sis"];
  for (const c of cats) {
    const r = checkConsent(scopes, { subcontractorId, residentId: raw.residentId, category: c });
    if (r.allowed) {
      allowedCategories.push(c);
      data[c] = raw[c];
    }
  }
  return { residentId: raw.residentId, residentName: raw.residentName, allowedCategories, data };
}
