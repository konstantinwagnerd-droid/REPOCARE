/**
 * Enricher — fuegt Kontext aus benachbarten Events hinzu.
 *
 * Beispiele:
 *   - Zwei Pflegegrad-Events: "Pflegegrad von 2 auf 3 erhoeht"
 *   - Incident + darauffolgende Massnahme: "Nach Sturz wurde Sturzprophylaxe ergaenzt"
 *   - Wunde eroeffnet + geschlossen: Dauer berechnen
 */

import type { JourneyEvent } from "./types";

const DAY_MS = 86_400_000;

export function enrichEvents(events: JourneyEvent[]): JourneyEvent[] {
  const enriched = events.map((e) => ({ ...e }));

  // 1. Wunden-Heildauer
  const woundsOpen = enriched.filter((e) => e.type === "wunde_open");
  const woundsClosed = enriched.filter((e) => e.type === "wunde_closed");
  for (const closed of woundsClosed) {
    const open = woundsOpen.find((o) => o.sourceId === closed.sourceId);
    if (open) {
      const days = Math.round(
        (new Date(closed.occurredAt).getTime() - new Date(open.occurredAt).getTime()) / DAY_MS,
      );
      closed.enrichedContext = `Heildauer: ${days} Tage`;
    }
  }

  // 2. Pflegegrad-Verlauf: aufeinanderfolgende Events erhalten Trend-Context
  const pgEvents = enriched.filter((e) => e.type === "pflegegrad_aenderung");
  for (let i = 1; i < pgEvents.length; i++) {
    const prev = pgEvents[i - 1];
    const curr = pgEvents[i];
    curr.enrichedContext = `${curr.enrichedContext ?? ""} · letzte Aenderung ${prev.occurredAt.slice(0, 10)}`.trim();
  }

  // 3. Incident + unmittelbar folgende Massnahme (innerhalb 7 Tagen)
  for (const inc of enriched.filter((e) => e.type === "incident")) {
    const after = enriched.find(
      (e) =>
        e.type === "massnahme_aenderung" &&
        new Date(e.occurredAt).getTime() > new Date(inc.occurredAt).getTime() &&
        new Date(e.occurredAt).getTime() - new Date(inc.occurredAt).getTime() < 7 * DAY_MS,
    );
    if (after) {
      after.enrichedContext =
        `${after.enrichedContext ?? ""} · Reaktion auf Vorfall "${inc.title}"`.trim();
    }
  }

  // 4. Story-Texte generieren
  for (const e of enriched) {
    e.storyText = buildStoryText(e);
  }

  return enriched;
}

function buildStoryText(e: JourneyEvent): string {
  const date = formatStoryDate(e.occurredAt);
  switch (e.type) {
    case "aufnahme":
      return `${date} wurde der:die Bewohner:in in die Einrichtung aufgenommen. ${e.description}`;
    case "sis_assessment":
      return `${date} wurde eine strukturierte Informationssammlung erstellt. ${e.description}`;
    case "incident":
      return `${date} kam es zu einem Vorfall: ${e.title}. ${e.description}`;
    case "wunde_open":
      return `${date} wurde eine neue Wunde eroeffnet (${e.title}). ${e.description}`;
    case "wunde_closed":
      return `${date} konnte die Wundbehandlung erfolgreich abgeschlossen werden. ${e.enrichedContext ?? ""}`.trim();
    case "medikation_aenderung":
      return `${date} gab es eine Aenderung in der Medikation: ${e.title}.`;
    case "pflegegrad_aenderung":
      return `${date} wurde der Pflegegrad angepasst: ${e.title}. ${e.enrichedContext ?? ""}`.trim();
    case "vital_ausreisser":
      return `${date} wurde ein auffaelliger Vital-Wert dokumentiert. ${e.description}`;
    case "arzt_besuch":
      return `${date} fand ein Arzt-Besuch statt. ${e.description}`;
    case "angehoerigen_kontakt":
      return `${date} gab es einen Kontakt mit Angehoerigen. ${e.description}`;
    case "pflegebericht":
      return `${date} wurde ein Pflegebericht geschrieben: ${e.description}`;
    case "massnahme_aenderung":
      return `${date} wurde eine Pflege-Massnahme angepasst: ${e.title}. ${e.enrichedContext ?? ""}`.trim();
    default:
      return `${date}: ${e.title}. ${e.description}`;
  }
}

function formatStoryDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "Januar",
    "Februar",
    "Maerz",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  return `Im ${months[d.getMonth()]} ${d.getFullYear()}`;
}
