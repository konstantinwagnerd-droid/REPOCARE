export const WEBHOOK_EVENTS = [
  "resident.admitted",
  "resident.discharged",
  "report.created",
  "report.signed",
  "incident.reported",
  "medication.administered",
  "wound.updated",
  "vital.recorded",
  "handover.completed",
  "user.created",
  "audit.flagged",
] as const;

export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number];

export const EVENT_DESCRIPTIONS: Record<WebhookEvent, string> = {
  "resident.admitted": "Neue Bewohner:in aufgenommen",
  "resident.discharged": "Bewohner:in entlassen",
  "report.created": "Pflegebericht erstellt",
  "report.signed": "Pflegebericht digital signiert",
  "incident.reported": "Vorfall gemeldet",
  "medication.administered": "Medikamentengabe dokumentiert",
  "wound.updated": "Wunddokumentation aktualisiert",
  "vital.recorded": "Vitalzeichen erfasst",
  "handover.completed": "Übergabe abgeschlossen",
  "user.created": "Neue Nutzer:in angelegt",
  "audit.flagged": "Audit-Warnung ausgelöst",
};

export type WebhookStatus = "active" | "disabled" | "failing";

export interface Webhook {
  id: string;
  tenantId: string;
  name: string;
  url: string;
  secret: string;
  events: WebhookEvent[];
  headers: Record<string, string>;
  status: WebhookStatus;
  createdAt: Date;
  lastDeliveryAt: Date | null;
  successCount: number;
  failureCount: number;
}

export type DeliveryStatus = "success" | "failed" | "pending" | "retrying";

export interface DeliveryLog {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  url: string;
  payload: unknown;
  status: DeliveryStatus;
  statusCode: number | null;
  responseBody: string | null;
  attemptCount: number;
  durationMs: number;
  error: string | null;
  createdAt: Date;
  nextRetryAt: Date | null;
}

export interface WebhookPayload<T = unknown> {
  id: string;
  event: WebhookEvent;
  createdAt: string;
  tenantId: string;
  data: T;
}
