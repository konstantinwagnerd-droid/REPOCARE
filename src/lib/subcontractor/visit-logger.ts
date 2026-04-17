/**
 * Visit-Logger: protokolliert Subunternehmer-Besuche.
 */

import type { SubVisit } from "./types";

export function createVisit(input: {
  tenantId: string;
  subcontractorId: string;
  residentId: string;
  residentName?: string;
  visitedAt?: string;
  durationMinutes?: number;
  report?: string;
  handoverNote?: string;
  billingCodes?: SubVisit["billingCodes"];
}): SubVisit {
  return {
    id: `sv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tenantId: input.tenantId,
    subcontractorId: input.subcontractorId,
    residentId: input.residentId,
    residentName: input.residentName,
    visitedAt: input.visitedAt ?? new Date().toISOString(),
    durationMinutes: input.durationMinutes,
    report: input.report,
    handoverNote: input.handoverNote,
    billingCodes: input.billingCodes,
    status: input.report ? "abgeschlossen" : "entwurf",
    createdAt: new Date().toISOString(),
  };
}

export function exportBillingCsv(visits: SubVisit[]): string {
  const lines = ["Datum;Bewohner;Code;Leistung;Betrag"];
  for (const v of visits) {
    for (const b of v.billingCodes ?? []) {
      lines.push(
        [
          v.visitedAt.slice(0, 10),
          (v.residentName ?? v.residentId).replace(/;/g, ","),
          b.code,
          b.label.replace(/;/g, ","),
          b.amount.toFixed(2),
        ].join(";"),
      );
    }
  }
  return lines.join("\n");
}

/** Typische GOAe-Positionen (oesterreichisch) als Vorschlag. */
export const BILLING_SUGGESTIONS: Record<string, Array<{ code: string; label: string; amount: number }>> = {
  arzt: [
    { code: "1", label: "Ordination", amount: 28.6 },
    { code: "2", label: "Hausbesuch", amount: 52.1 },
    { code: "70", label: "Verordnung", amount: 9.8 },
  ],
  physiotherapie: [
    { code: "PT-1", label: "Einzeltherapie 30 Min", amount: 45.0 },
    { code: "PT-2", label: "Einzeltherapie 45 Min", amount: 62.0 },
  ],
  ergotherapie: [
    { code: "ET-1", label: "Einzelbehandlung", amount: 55.0 },
  ],
  logopaedie: [
    { code: "LP-1", label: "Einzelbehandlung 45 Min", amount: 58.0 },
  ],
  seelsorge: [],
  ernaehrungsberatung: [
    { code: "EB-1", label: "Beratung 45 Min", amount: 65.0 },
  ],
  podologie: [
    { code: "PD-1", label: "Pflegebehandlung", amount: 35.0 },
  ],
  friseur: [],
  musiktherapie: [
    { code: "MT-1", label: "Gruppenstunde", amount: 40.0 },
  ],
  sonstige: [],
};
