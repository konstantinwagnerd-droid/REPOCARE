import type { NotificationTemplate, NotificationEvent } from "./types";

/**
 * 15 vorgefertigte Templates – eine pro Event.
 * Variablen werden zur Laufzeit via render() ersetzt.
 */
export const templates: NotificationTemplate[] = [
  {
    event: "incident.reported",
    kind: "critical",
    title: "Vorfall gemeldet: {resident}",
    body: "Ein Vorfall ({type}) wurde um {time} von {reporter} gemeldet.",
    defaultChannels: ["in-app", "push", "email"],
    recipients: ["pdl", "hausarzt"],
    variables: ["resident", "type", "time", "reporter"],
  },
  {
    event: "medication.administered",
    kind: "info",
    title: "Medikation verabreicht",
    body: "{medication} wurde {resident} um {time} verabreicht.",
    defaultChannels: ["in-app"],
    recipients: ["responsible-nurse"],
    variables: ["medication", "resident", "time"],
  },
  {
    event: "wound.worsened",
    kind: "warning",
    title: "Wunde verschlechtert: {resident}",
    body: "Wundstatus an {location}: {prev} -> {now}. Bitte prüfen.",
    defaultChannels: ["in-app", "push"],
    recipients: ["pdl"],
    variables: ["resident", "location", "prev", "now"],
  },
  {
    event: "vital.out-of-range",
    kind: "warning",
    title: "Vitalwert auffällig: {resident}",
    body: "{vital} = {value} (Grenze: {limit}). Schicht: {shift}.",
    defaultChannels: ["in-app", "push"],
    recipients: ["shift-lead"],
    variables: ["resident", "vital", "value", "limit", "shift"],
  },
  {
    event: "care-plan.updated",
    kind: "info",
    title: "Pflegeplan aktualisiert: {resident}",
    body: "{author} hat den Pflegeplan geändert. Bereich: {section}.",
    defaultChannels: ["in-app"],
    recipients: ["team"],
    variables: ["resident", "author", "section"],
  },
  {
    event: "report.signed",
    kind: "info",
    title: "Bericht signiert",
    body: "{report} wurde von {signer} am {date} signiert.",
    defaultChannels: ["in-app"],
    recipients: ["audit"],
    variables: ["report", "signer", "date"],
  },
  {
    event: "handover.completed",
    kind: "info",
    title: "Übergabe abgeschlossen",
    body: "Schicht {shift} übergeben an {next}. {count} Einträge.",
    defaultChannels: ["in-app"],
    recipients: ["next-shift"],
    variables: ["shift", "next", "count"],
  },
  {
    event: "family-message.received",
    kind: "info",
    title: "Nachricht von Angehörigen",
    body: "{sender} zu {resident}: \"{preview}\"",
    defaultChannels: ["in-app"],
    recipients: ["bezugspflege"],
    variables: ["sender", "resident", "preview"],
  },
  {
    event: "export.ready",
    kind: "success",
    title: "Export bereit",
    body: "Dein Export \"{label}\" ({size}) steht zum Download bereit.",
    defaultChannels: ["in-app", "email"],
    recipients: ["requester"],
    variables: ["label", "size"],
  },
  {
    event: "backup.failed",
    kind: "critical",
    title: "Backup fehlgeschlagen",
    body: "Backup \"{name}\" um {time} abgebrochen: {reason}.",
    defaultChannels: ["in-app", "email", "push"],
    recipients: ["admin"],
    variables: ["name", "time", "reason"],
  },
  {
    event: "audit.anomaly",
    kind: "critical",
    title: "Audit-Anomalie erkannt",
    body: "Typ: {kind}. Schweregrad: {severity}. User: {user}.",
    defaultChannels: ["in-app", "email"],
    recipients: ["admin"],
    variables: ["kind", "severity", "user"],
  },
  {
    event: "quality.benchmark-hit",
    kind: "success",
    title: "Benchmark erreicht: {metric}",
    body: "{metric} liegt bei {value} – über dem Ziel von {target}.",
    defaultChannels: ["in-app"],
    recipients: ["pdl"],
    variables: ["metric", "value", "target"],
  },
  {
    event: "shift.understaffed",
    kind: "warning",
    title: "Schicht unterbesetzt: {shift}",
    body: "Nur {present} von {needed} MA eingeplant für {date}.",
    defaultChannels: ["in-app", "push"],
    recipients: ["pdl"],
    variables: ["shift", "present", "needed", "date"],
  },
  {
    event: "schedule.published",
    kind: "info",
    title: "Dienstplan veröffentlicht",
    body: "Neuer Plan für KW {week}. Deine Schichten: {mine}.",
    defaultChannels: ["in-app", "email"],
    recipients: ["affected-staff"],
    variables: ["week", "mine"],
  },
  {
    event: "training.due",
    kind: "warning",
    title: "Schulung fällig: {topic}",
    body: "Pflichtfortbildung \"{topic}\" bis {deadline}.",
    defaultChannels: ["in-app", "email"],
    recipients: ["affected-staff"],
    variables: ["topic", "deadline"],
  },
];

export function getTemplate(event: NotificationEvent): NotificationTemplate | undefined {
  return templates.find((t) => t.event === event);
}

/** Ersetzt {var}-Platzhalter mit bereitgestellten Werten. */
export function render(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    const v = vars[key];
    return v === undefined || v === null ? `{${key}}` : String(v);
  });
}
