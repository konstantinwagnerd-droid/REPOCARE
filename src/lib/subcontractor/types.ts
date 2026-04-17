/**
 * Subunternehmer-Portal — Typen
 *
 * Externe Dienstleister (Hausarzt, Physio, Seelsorge, Ernaehrung)
 * mit granularem Access-Control pro Bewohner:in.
 */

export type SubProfession =
  | "arzt"
  | "physiotherapie"
  | "ergotherapie"
  | "logopaedie"
  | "seelsorge"
  | "ernaehrungsberatung"
  | "podologie"
  | "friseur"
  | "musiktherapie"
  | "sonstige";

export type DataCategory = "vitals" | "medikation" | "wunden" | "berichte" | "diagnosen" | "sis";

export interface Subcontractor {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  company?: string;
  profession: SubProfession;
  /** Arzt-Nummer (Oesterreich) oder NPI o.ae. */
  professionalId?: string;
  passwordHash?: string; // optional — Magic-Link ist primaer
  magicToken?: string;
  magicTokenExpires?: string;
  active: boolean;
  invitedAt: string;
  acceptedAt?: string;
}

export interface ConsentScope {
  id: string;
  tenantId: string;
  subcontractorId: string;
  residentId: string;
  residentName?: string;
  categories: DataCategory[];
  validFrom: string;
  validUntil?: string;
  /** Eingewilligt durch Bewohner:in / gesetzlicher Vertreter */
  grantedByName: string;
  grantedByRelation?: string;
  revokedAt?: string;
  note?: string;
}

export type VisitStatus = "entwurf" | "abgeschlossen" | "abgerechnet";

export interface SubVisit {
  id: string;
  tenantId: string;
  subcontractorId: string;
  residentId: string;
  residentName?: string;
  visitedAt: string;
  durationMinutes?: number;
  report?: string;
  handoverNote?: string;
  /** Mock-GOAe-Positionen fuer Abrechnung. */
  billingCodes?: Array<{ code: string; label: string; amount: number }>;
  status: VisitStatus;
  createdAt: string;
}

export interface SubAuditEntry {
  id: string;
  tenantId: string;
  subcontractorId: string;
  at: string;
  action: string;
  residentId?: string;
  dataCategory?: DataCategory;
  success: boolean;
}
