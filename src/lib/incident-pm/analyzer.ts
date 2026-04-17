/**
 * Analyzer — schlaegt Timeline aus Audit-Log-Auszug rund um Incident-Zeitpunkt vor.
 *
 * Blameless: verwendet Rollen statt Namen, wo die Rolle bekannt ist.
 */

import type { TimelineEntry } from "./types";

export interface AuditRowLike {
  id: string;
  at: Date | string;
  actorRole?: string;
  actorName?: string;
  action: string;
  target?: string;
  outcome?: string;
}

export interface AnalyzeOptions {
  /** Stunden-Fenster vor/nach Incident, Default 2h. */
  windowHours?: number;
}

/**
 * Filtert Audit-Eintraege auf das Zeitfenster +/-X Stunden um occurredAt
 * und konvertiert in TimelineEntries.
 */
export function suggestTimelineFromAudit(
  auditRows: AuditRowLike[],
  incidentAt: Date | string,
  opts: AnalyzeOptions = {},
): TimelineEntry[] {
  const center = new Date(incidentAt).getTime();
  const hours = opts.windowHours ?? 2;
  const win = hours * 3_600_000;

  return auditRows
    .filter((r) => {
      const t = new Date(r.at).getTime();
      return t >= center - win && t <= center + win;
    })
    .map((r) => ({
      id: `tl-${r.id}`,
      at: typeof r.at === "string" ? r.at : r.at.toISOString(),
      actor: r.actorRole || "Rolle unbekannt",
      action: r.target ? `${r.action} (${r.target})` : r.action,
      outcome: r.outcome,
      sourceAuditId: r.id,
    }))
    .sort((a, b) => a.at.localeCompare(b.at));
}

/**
 * Validator: warnt wenn Namen in "What Went Wrong" auftauchen.
 * Heuristik: suchen nach typischen Namensmustern (Titel + grossgeschriebenes Wort).
 */
export function detectNameMentions(texts: string[]): string[] {
  const patterns = [
    /\b(Herr|Frau|Dr\.?|Prof\.?)\s+([A-ZAE-Z][a-zae-z]+)/g,
    /\b([A-ZAE-Z][a-zae-z]+)\s+([A-ZAE-Z][a-zae-z]+(?:\s+[A-ZAE-Z][a-zae-z]+)?)\b/g,
  ];
  const hits: string[] = [];
  for (const t of texts) {
    for (const p of patterns) {
      const matches = t.match(p);
      if (matches) hits.push(...matches);
    }
  }
  // Whitelist: Rollen, die vorkommen duerfen
  const roleWhitelist = [
    "PDL",
    "WBL",
    "Nachtwache",
    "Schichtleitung",
    "Praxisanleiter",
    "Ethikberater",
    "Qualitaetsbeauftragte",
    "Arzneimittel",
    "Sturzbeauftragte",
    "Hygienebeauftragte",
    "Demenz",
    "Palliativ",
    "Wundexpert",
    "Team",
    "Schicht",
    "Station",
    "MDK",
  ];
  return Array.from(new Set(hits)).filter(
    (h) => !roleWhitelist.some((w) => h.toLowerCase().includes(w.toLowerCase())),
  );
}
