/**
 * Notification-Center – Types
 * Zentrale Typen für In-App-Benachrichtigungen, Web-Push, E-Mail-Stubs.
 */

export type NotificationKind = "info" | "warning" | "critical" | "success";

export type NotificationChannel = "in-app" | "email" | "push" | "sms-stub";

export type NotificationAudienceScope = "user" | "role" | "tenant" | "all";

export interface NotificationAudience {
  scope: NotificationAudienceScope;
  /** userId (scope=user), role (scope=role) oder tenantId (scope=tenant). */
  value?: string;
}

export type NotificationEvent =
  | "incident.reported"
  | "medication.administered"
  | "wound.worsened"
  | "vital.out-of-range"
  | "care-plan.updated"
  | "report.signed"
  | "handover.completed"
  | "family-message.received"
  | "export.ready"
  | "backup.failed"
  | "audit.anomaly"
  | "quality.benchmark-hit"
  | "shift.understaffed"
  | "schedule.published"
  | "training.due";

export interface NotificationTemplate {
  event: NotificationEvent;
  kind: NotificationKind;
  title: string;
  body: string;
  defaultChannels: NotificationChannel[];
  /** Empfängerrollen. */
  recipients: string[];
  /** Erlaubte Variablen im Titel/Body ({name} Syntax). */
  variables: string[];
}

export interface Notification {
  id: string;
  userId: string;
  tenantId: string;
  event: NotificationEvent;
  kind: NotificationKind;
  title: string;
  body: string;
  channels: NotificationChannel[];
  createdAt: number;
  readAt?: number;
  href?: string;
  meta?: Record<string, string | number>;
}

export interface NotificationPreferences {
  userId: string;
  /** Pro Event: aktiv (true/false). */
  events: Partial<Record<NotificationEvent, boolean>>;
  /** Pro Channel: aktiv (true/false). */
  channels: Partial<Record<NotificationChannel, boolean>>;
  quietHours: { enabled: boolean; from: string; to: string };
}

export interface PushSubscription {
  userId: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  createdAt: number;
}

export interface DeliveryStat {
  event: NotificationEvent;
  channel: NotificationChannel;
  delivered: number;
  failed: number;
  day: string; // YYYY-MM-DD
}
