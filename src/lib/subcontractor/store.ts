/**
 * In-Memory-Store fuer Subunternehmer, Consents, Visits, Audit.
 */

import type { ConsentScope, Subcontractor, SubAuditEntry, SubVisit } from "./types";
import { grantConsent } from "./consent";

type Store = {
  subs: Map<string, Subcontractor>;
  scopes: Map<string, ConsentScope>;
  visits: Map<string, SubVisit>;
  audit: SubAuditEntry[];
};

const g = globalThis as unknown as { __careai_sub?: Store };

function seed(): Store {
  const store: Store = { subs: new Map(), scopes: new Map(), visits: new Map(), audit: [] };
  const t = "demo-tenant";
  const now = new Date().toISOString();
  const demoSubs: Subcontractor[] = [
    {
      id: "sub-1",
      tenantId: t,
      name: "Dr. Maria Schneider",
      email: "schneider@hausarzt-wien.at",
      company: "Praxis Schneider",
      profession: "arzt",
      professionalId: "AT-12345",
      active: true,
      invitedAt: now,
      acceptedAt: now,
    },
    {
      id: "sub-2",
      tenantId: t,
      name: "Thomas Berger",
      email: "berger@physio-berger.at",
      company: "Physio Berger",
      profession: "physiotherapie",
      active: true,
      invitedAt: now,
      acceptedAt: now,
    },
    {
      id: "sub-3",
      tenantId: t,
      name: "Pfarrer Josef Huber",
      email: "seelsorge@pfarre-wien.at",
      profession: "seelsorge",
      active: true,
      invitedAt: now,
      acceptedAt: now,
    },
  ];
  for (const s of demoSubs) store.subs.set(s.id, s);

  const demoConsents = [
    grantConsent({
      tenantId: t,
      subcontractorId: "sub-1",
      residentId: "res-demo-1",
      residentName: "Erika Mustermann",
      categories: ["vitals", "medikation", "diagnosen", "berichte"],
      grantedByName: "Erika Mustermann",
      grantedByRelation: "selbst",
    }),
    grantConsent({
      tenantId: t,
      subcontractorId: "sub-2",
      residentId: "res-demo-1",
      residentName: "Erika Mustermann",
      categories: ["vitals", "berichte"],
      grantedByName: "Erika Mustermann",
      grantedByRelation: "selbst",
    }),
    grantConsent({
      tenantId: t,
      subcontractorId: "sub-3",
      residentId: "res-demo-2",
      residentName: "Hans Beispiel",
      categories: ["berichte"],
      grantedByName: "Inge Beispiel",
      grantedByRelation: "Ehefrau",
    }),
  ];
  for (const s of demoConsents) store.scopes.set(s.id, s);

  return store;
}

function getStore(): Store {
  if (!g.__careai_sub) g.__careai_sub = seed();
  return g.__careai_sub;
}

// Subs
export function listSubs(tenantId: string): Subcontractor[] {
  return Array.from(getStore().subs.values()).filter((s) => s.tenantId === tenantId || tenantId === "*");
}
export function getSub(id: string): Subcontractor | undefined {
  return getStore().subs.get(id);
}
export function getSubByEmail(email: string): Subcontractor | undefined {
  return Array.from(getStore().subs.values()).find((s) => s.email.toLowerCase() === email.toLowerCase());
}
export function saveSub(s: Subcontractor): void {
  getStore().subs.set(s.id, s);
}

// Scopes
export function listScopes(tenantId: string): ConsentScope[] {
  return Array.from(getStore().scopes.values()).filter((s) => s.tenantId === tenantId || tenantId === "*");
}
export function scopesFor(subcontractorId: string): ConsentScope[] {
  return Array.from(getStore().scopes.values()).filter((s) => s.subcontractorId === subcontractorId);
}
export function saveScope(s: ConsentScope): void {
  getStore().scopes.set(s.id, s);
}

// Visits
export function listVisits(subcontractorId: string): SubVisit[] {
  return Array.from(getStore().visits.values()).filter((v) => v.subcontractorId === subcontractorId);
}
export function saveVisit(v: SubVisit): void {
  getStore().visits.set(v.id, v);
}

// Audit
export function logAudit(e: SubAuditEntry): void {
  getStore().audit.push(e);
}
export function listAudit(tenantId: string): SubAuditEntry[] {
  return getStore().audit.filter((a) => a.tenantId === tenantId || tenantId === "*");
}
