/**
 * Resident-Journey-Timeline — Typen
 *
 * Chronologische Sicht auf alle relevanten Ereignisse im Leben eines:r
 * Bewohner:in — von der Aufnahme bis heute. Grundlage fuer MD-Pruefung,
 * Familien-Gespraeche und Pflege-Reflexion.
 */

export type JourneyEventType =
  | "aufnahme"
  | "sis_assessment"
  | "massnahme_aenderung"
  | "pflegebericht"
  | "incident"
  | "wunde_open"
  | "wunde_closed"
  | "medikation_aenderung"
  | "pflegegrad_aenderung"
  | "vital_ausreisser"
  | "arzt_besuch"
  | "angehoerigen_kontakt";

export type JourneySeverity = "info" | "low" | "medium" | "high" | "critical";

export interface JourneyEvent {
  id: string;
  residentId: string;
  type: JourneyEventType;
  occurredAt: string; // ISO
  source: string; // z.B. "sis_assessments", "incidents", "vital_signs"
  sourceId?: string;
  severity: JourneySeverity;
  title: string;
  description: string;
  /** verknuepfte Entitaeten: IDs und Typen */
  relatedEntities?: Array<{ type: string; id: string; label?: string }>;
  /** zusaetzlicher Kontext aus enricher (z.B. "Pflegegrad von 2 -> 3") */
  enrichedContext?: string;
  /** Story-Mode-Text */
  storyText?: string;
  /** Icon-Key (Lucide-Name), optional */
  iconKey?: string;
}

export interface JourneyFilter {
  from?: string; // ISO
  to?: string; // ISO
  types?: JourneyEventType[];
  severities?: JourneySeverity[];
  onlyImportant?: boolean;
}

export type ZoomLevel = "day" | "week" | "month" | "year";

export interface JourneyAggregateInput {
  resident: {
    id: string;
    fullName: string;
    admissionDate: Date | string;
    pflegegrad: number;
  };
  sisAssessments?: Array<{ id: string; createdAt: Date | string; summary?: string | null }>;
  carePlans?: Array<{
    id: string;
    createdAt: Date | string;
    title: string;
    status?: string;
    updatedAt?: Date | string | null;
  }>;
  careReports?: Array<{
    id: string;
    createdAt: Date | string;
    content: string;
    important?: boolean | null;
  }>;
  vitalSigns?: Array<{
    id: string;
    type: string;
    value: number;
    recordedAt: Date | string;
    flagged?: boolean | null;
  }>;
  medications?: Array<{
    id: string;
    createdAt: Date | string;
    name: string;
    action?: "start" | "stop" | "dose_change";
  }>;
  wounds?: Array<{
    id: string;
    createdAt: Date | string;
    closedAt?: Date | string | null;
    location: string;
    stage?: string;
  }>;
  incidents?: Array<{
    id: string;
    occurredAt: Date | string;
    severity: string;
    title: string;
    description?: string | null;
  }>;
  pflegegradHistory?: Array<{ from: number; to: number; changedAt: Date | string }>;
  doctorVisits?: Array<{
    id: string;
    visitedAt: Date | string;
    doctor: string;
    note?: string | null;
  }>;
  familyContacts?: Array<{
    id: string;
    contactedAt: Date | string;
    contactName: string;
    topic?: string | null;
  }>;
}

export const EVENT_LABELS: Record<JourneyEventType, string> = {
  aufnahme: "Aufnahme",
  sis_assessment: "SIS-Assessment",
  massnahme_aenderung: "Massnahme geaendert",
  pflegebericht: "Pflegebericht",
  incident: "Vorfall",
  wunde_open: "Wunde eroeffnet",
  wunde_closed: "Wunde verheilt",
  medikation_aenderung: "Medikation geaendert",
  pflegegrad_aenderung: "Pflegegrad geaendert",
  vital_ausreisser: "Vital-Ausreisser",
  arzt_besuch: "Arzt-Besuch",
  angehoerigen_kontakt: "Angehoerigen-Kontakt",
};

export const EVENT_ICONS: Record<JourneyEventType, string> = {
  aufnahme: "Home",
  sis_assessment: "ClipboardList",
  massnahme_aenderung: "FileText",
  pflegebericht: "FileText",
  incident: "AlertTriangle",
  wunde_open: "Bandage",
  wunde_closed: "BandageCheck",
  medikation_aenderung: "Pill",
  pflegegrad_aenderung: "Award",
  vital_ausreisser: "Activity",
  arzt_besuch: "Stethoscope",
  angehoerigen_kontakt: "Users",
};

export const SEVERITY_COLOR: Record<JourneySeverity, string> = {
  info: "bg-sky-100 text-sky-900 border-sky-200",
  low: "bg-emerald-100 text-emerald-900 border-emerald-200",
  medium: "bg-amber-100 text-amber-900 border-amber-200",
  high: "bg-orange-100 text-orange-900 border-orange-200",
  critical: "bg-rose-100 text-rose-900 border-rose-200",
};
