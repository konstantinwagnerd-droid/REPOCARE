/**
 * Expertise-Badges / Qualifikationen — Typen
 */

export type BadgeCategory = "qualifikation" | "expertise" | "weiterbildung" | "zertifikat" | "rolle";
export type BadgeLevel = "basis" | "erweitert" | "expert";

export interface BadgeDef {
  key: string;
  name: string;
  category: BadgeCategory;
  level: BadgeLevel;
  description: string;
  /** Gueltigkeitsdauer in Monaten (null = unbegrenzt). */
  validityMonths: number | null;
  /** Erfordert Nachweis-Dokument? */
  requiresProof: boolean;
  /** Synchronisiert aus LMS? */
  fromLms: boolean;
  /** Icon-Key (Lucide). */
  iconKey: string;
  /** Farb-Token. */
  color: string;
}

export type BadgeAssignmentStatus = "beantragt" | "verifiziert" | "abgelaufen" | "widerrufen";

export interface BadgeAssignment {
  id: string;
  tenantId: string;
  userId: string;
  userName?: string;
  badgeKey: string;
  status: BadgeAssignmentStatus;
  issuedAt: string;
  expiresAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  proofUrl?: string;
  note?: string;
}
