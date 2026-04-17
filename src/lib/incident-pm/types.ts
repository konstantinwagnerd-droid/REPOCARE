/**
 * Incident-Postmortem-Tool — Typen
 *
 * Strukturierter Post-Mortem-Bericht analog DevOps-Culture. Blameless.
 * Wird oft vom MDK angefragt.
 */

export type PostMortemStatus = "offen" | "in_bearbeitung" | "abgeschlossen" | "lessons_learned";

export type ContributingFactorCategory = "mensch" | "system" | "organisation" | "umgebung";

export interface ContributingFactor {
  category: ContributingFactorCategory;
  description: string;
}

export interface TimelineEntry {
  id: string;
  at: string; // ISO
  actor: string; // Rolle statt Name (blameless!)
  action: string;
  outcome?: string;
  sourceAuditId?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  owner: string; // Rolle / Prozess — keine Person
  dueDate?: string;
  status: "offen" | "in_arbeit" | "erledigt" | "verworfen";
  createdAt: string;
  note?: string;
}

export interface SignOff {
  role: string;
  userName?: string;
  signedAt: string;
  notes?: string;
}

export interface PostMortem {
  id: string;
  tenantId: string;
  incidentId: string;
  title: string;
  templateKey: string;
  status: PostMortemStatus;
  timeline: TimelineEntry[];
  contributingFactors: ContributingFactor[];
  whatWentWell: string[];
  whatWentWrong: string[];
  actionItems: ActionItem[];
  signOffs: SignOff[];
  learningScore?: number; // 0..100
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface IncidentListItem {
  id: string;
  tenantId: string;
  residentId?: string;
  residentName?: string;
  occurredAt: string;
  severity: "niedrig" | "mittel" | "hoch" | "kritisch";
  title: string;
  description?: string;
  postMortemStatus?: PostMortemStatus;
  postMortemId?: string;
}
