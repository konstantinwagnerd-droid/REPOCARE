/**
 * Filter-Logik fuer Journey-Events.
 */

import type { JourneyEvent, JourneyFilter, JourneySeverity } from "./types";

const IMPORTANT_SEVERITIES: JourneySeverity[] = ["medium", "high", "critical"];

export function filterEvents(events: JourneyEvent[], f: JourneyFilter | undefined): JourneyEvent[] {
  if (!f) return events;
  return events.filter((e) => {
    if (f.from && e.occurredAt < f.from) return false;
    if (f.to && e.occurredAt > f.to) return false;
    if (f.types && f.types.length > 0 && !f.types.includes(e.type)) return false;
    if (f.severities && f.severities.length > 0 && !f.severities.includes(e.severity)) return false;
    if (f.onlyImportant && !IMPORTANT_SEVERITIES.includes(e.severity)) return false;
    return true;
  });
}

/** Gruppiert Events nach Zoom-Level (year/month/week/day) fuer die Timeline. */
export function groupByZoom(
  events: JourneyEvent[],
  zoom: "day" | "week" | "month" | "year",
): Array<{ key: string; label: string; events: JourneyEvent[] }> {
  const map = new Map<string, { label: string; events: JourneyEvent[] }>();
  for (const e of events) {
    const d = new Date(e.occurredAt);
    let key: string;
    let label: string;
    switch (zoom) {
      case "day":
        key = e.occurredAt.slice(0, 10);
        label = d.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
        break;
      case "week": {
        const w = getIsoWeek(d);
        key = `${d.getFullYear()}-W${String(w).padStart(2, "0")}`;
        label = `KW ${w} / ${d.getFullYear()}`;
        break;
      }
      case "month":
        key = e.occurredAt.slice(0, 7);
        label = d.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
        break;
      case "year":
        key = e.occurredAt.slice(0, 4);
        label = String(d.getFullYear());
        break;
    }
    const entry = map.get(key) ?? { label, events: [] };
    entry.events.push(e);
    map.set(key, entry);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, v]) => ({ key, label: v.label, events: v.events }));
}

function getIsoWeek(d: Date): number {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const diff = (target.getTime() - firstThursday.getTime()) / 86_400_000;
  return 1 + Math.round((diff - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
}
