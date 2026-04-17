/**
 * Journey Aggregator — sammelt Events aus allen Quellen.
 *
 * Nimmt Rohdaten aus der bestehenden DB-Schicht (wird vom Caller gereicht, um
 * die journey-Lib unabhaengig von src/db/ zu halten) und produziert eine
 * einheitliche Liste von JourneyEvents, chronologisch sortiert.
 */

import type { JourneyAggregateInput, JourneyEvent, JourneySeverity } from "./types";
import { EVENT_ICONS } from "./types";

const toIso = (d: Date | string): string => (typeof d === "string" ? d : d.toISOString());

const severityFromIncident = (s: string): JourneySeverity => {
  if (s === "kritisch") return "critical";
  if (s === "hoch") return "high";
  if (s === "mittel") return "medium";
  if (s === "niedrig") return "low";
  return "info";
};

const VITAL_THRESHOLDS: Record<string, { low?: number; high?: number }> = {
  puls: { low: 40, high: 120 },
  blutdruck_systolisch: { low: 90, high: 180 },
  blutdruck_diastolisch: { low: 50, high: 110 },
  temperatur: { low: 35, high: 38.5 },
  sauerstoffsaettigung: { low: 90 },
  atemfrequenz: { low: 8, high: 25 },
};

const isVitalOutlier = (type: string, value: number): boolean => {
  const t = VITAL_THRESHOLDS[type];
  if (!t) return false;
  if (t.low !== undefined && value < t.low) return true;
  if (t.high !== undefined && value > t.high) return true;
  return false;
};

const mk = (e: Omit<JourneyEvent, "iconKey"> & { iconKey?: string }): JourneyEvent => ({
  ...e,
  iconKey: e.iconKey ?? EVENT_ICONS[e.type],
});

export function aggregateJourney(input: JourneyAggregateInput): JourneyEvent[] {
  const events: JourneyEvent[] = [];
  const { resident } = input;

  // 1. Aufnahme
  events.push(
    mk({
      id: `aufnahme-${resident.id}`,
      residentId: resident.id,
      type: "aufnahme",
      occurredAt: toIso(resident.admissionDate),
      source: "residents",
      sourceId: resident.id,
      severity: "info",
      title: "Aufnahme in die Einrichtung",
      description: `${resident.fullName} wurde mit Pflegegrad ${resident.pflegegrad} aufgenommen.`,
    }),
  );

  // 2. SIS-Assessments
  for (const s of input.sisAssessments ?? []) {
    events.push(
      mk({
        id: `sis-${s.id}`,
        residentId: resident.id,
        type: "sis_assessment",
        occurredAt: toIso(s.createdAt),
        source: "sis_assessments",
        sourceId: s.id,
        severity: "info",
        title: "SIS-Assessment erstellt",
        description: s.summary ?? "Strukturierte Informationssammlung durchgefuehrt.",
      }),
    );
  }

  // 3. Massnahmen-Aenderungen
  for (const c of input.carePlans ?? []) {
    events.push(
      mk({
        id: `plan-${c.id}`,
        residentId: resident.id,
        type: "massnahme_aenderung",
        occurredAt: toIso(c.updatedAt ?? c.createdAt),
        source: "care_plans",
        sourceId: c.id,
        severity: "info",
        title: `Massnahme: ${c.title}`,
        description: c.status ? `Status: ${c.status}` : "Massnahme aktualisiert.",
      }),
    );
  }

  // 4. Pflegeberichte (nur "wichtige" oder erstes pro Woche)
  const reportsByWeek = new Map<string, typeof input.careReports extends (infer U)[] | undefined ? U : never>();
  for (const r of input.careReports ?? []) {
    if (r.important) {
      events.push(
        mk({
          id: `report-${r.id}`,
          residentId: resident.id,
          type: "pflegebericht",
          occurredAt: toIso(r.createdAt),
          source: "care_reports",
          sourceId: r.id,
          severity: "medium",
          title: "Pflegebericht (wichtig)",
          description: r.content.slice(0, 240),
        }),
      );
    } else {
      const wk = toIso(r.createdAt).slice(0, 7); // year-month als grobe Gruppierung
      if (!reportsByWeek.has(wk)) {
        reportsByWeek.set(wk, r as never);
        events.push(
          mk({
            id: `report-${r.id}`,
            residentId: resident.id,
            type: "pflegebericht",
            occurredAt: toIso(r.createdAt),
            source: "care_reports",
            sourceId: r.id,
            severity: "info",
            title: "Pflegebericht",
            description: r.content.slice(0, 180),
          }),
        );
      }
    }
  }

  // 5. Incidents
  for (const i of input.incidents ?? []) {
    events.push(
      mk({
        id: `incident-${i.id}`,
        residentId: resident.id,
        type: "incident",
        occurredAt: toIso(i.occurredAt),
        source: "incidents",
        sourceId: i.id,
        severity: severityFromIncident(i.severity),
        title: i.title,
        description: i.description ?? "Vorfall dokumentiert.",
      }),
    );
  }

  // 6. Wunden (open/closed)
  for (const w of input.wounds ?? []) {
    events.push(
      mk({
        id: `wound-open-${w.id}`,
        residentId: resident.id,
        type: "wunde_open",
        occurredAt: toIso(w.createdAt),
        source: "wounds",
        sourceId: w.id,
        severity: "medium",
        title: `Wunde eroeffnet: ${w.location}`,
        description: w.stage ? `Stadium ${w.stage}` : "Neue Wunde dokumentiert.",
      }),
    );
    if (w.closedAt) {
      events.push(
        mk({
          id: `wound-closed-${w.id}`,
          residentId: resident.id,
          type: "wunde_closed",
          occurredAt: toIso(w.closedAt),
          source: "wounds",
          sourceId: w.id,
          severity: "low",
          title: `Wunde verheilt: ${w.location}`,
          description: "Wundversorgung abgeschlossen.",
        }),
      );
    }
  }

  // 7. Medikation
  for (const m of input.medications ?? []) {
    const label =
      m.action === "start" ? "Medikation begonnen" : m.action === "stop" ? "Medikation abgesetzt" : "Dosis-Anpassung";
    events.push(
      mk({
        id: `med-${m.id}-${m.action ?? "set"}`,
        residentId: resident.id,
        type: "medikation_aenderung",
        occurredAt: toIso(m.createdAt),
        source: "medications",
        sourceId: m.id,
        severity: "low",
        title: `${label}: ${m.name}`,
        description: `Wirkstoff/Praeparat ${m.name}.`,
      }),
    );
  }

  // 8. Pflegegrad
  for (const p of input.pflegegradHistory ?? []) {
    const up = p.to > p.from;
    events.push(
      mk({
        id: `pg-${toIso(p.changedAt)}`,
        residentId: resident.id,
        type: "pflegegrad_aenderung",
        occurredAt: toIso(p.changedAt),
        source: "residents",
        severity: up ? "medium" : "info",
        title: `Pflegegrad ${p.from} -> ${p.to}`,
        description: up ? "Pflegebedarf gestiegen." : "Pflegebedarf angepasst.",
        enrichedContext: `Aenderung um ${p.to - p.from} Stufen`,
      }),
    );
  }

  // 9. Vital-Ausreisser
  for (const v of input.vitalSigns ?? []) {
    if (v.flagged || isVitalOutlier(v.type, v.value)) {
      events.push(
        mk({
          id: `vital-${v.id}`,
          residentId: resident.id,
          type: "vital_ausreisser",
          occurredAt: toIso(v.recordedAt),
          source: "vital_signs",
          sourceId: v.id,
          severity: "medium",
          title: `Auffaelliger Vital-Wert: ${v.type}`,
          description: `Messwert ${v.value} liegt ausserhalb des Referenzbereichs.`,
        }),
      );
    }
  }

  // 10. Arzt-Besuche
  for (const d of input.doctorVisits ?? []) {
    events.push(
      mk({
        id: `doc-${d.id}`,
        residentId: resident.id,
        type: "arzt_besuch",
        occurredAt: toIso(d.visitedAt),
        source: "doctor_visits",
        sourceId: d.id,
        severity: "info",
        title: `Arzt-Besuch: ${d.doctor}`,
        description: d.note ?? "Konsultation durchgefuehrt.",
      }),
    );
  }

  // 11. Angehoerigen-Kontakte
  for (const f of input.familyContacts ?? []) {
    events.push(
      mk({
        id: `fam-${f.id}`,
        residentId: resident.id,
        type: "angehoerigen_kontakt",
        occurredAt: toIso(f.contactedAt),
        source: "family_contacts",
        sourceId: f.id,
        severity: "info",
        title: `Kontakt mit ${f.contactName}`,
        description: f.topic ?? "Angehoerigen-Gespraech gefuehrt.",
      }),
    );
  }

  // chronologisch (aelteste zuerst — Timeline liest top-down)
  events.sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  return events;
}
