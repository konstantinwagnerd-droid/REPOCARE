"use client";

import { AlertTriangle, CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import type { Notification } from "@/lib/notifications/types";

const iconMap = {
  info: Info,
  warning: AlertCircle,
  critical: AlertTriangle,
  success: CheckCircle2,
} as const;

const colorMap = {
  info: "text-primary border-primary/20 bg-primary/5",
  warning: "text-amber-700 dark:text-amber-400 border-amber-300/40 bg-amber-50 dark:bg-amber-950/20",
  critical: "text-destructive border-destructive/30 bg-destructive/5",
  success: "text-emerald-700 dark:text-emerald-400 border-emerald-300/40 bg-emerald-50 dark:bg-emerald-950/20",
} as const;

export function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const Icon = iconMap[notification.kind];
  const cls = colorMap[notification.kind];
  const unread = !notification.readAt;

  return (
    <article
      aria-labelledby={`n-${notification.id}-title`}
      className={`flex gap-3 rounded-xl border p-4 transition-colors ${cls} ${unread ? "ring-2 ring-primary/10" : ""}`}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 id={`n-${notification.id}-title`} className="truncate text-sm font-semibold text-foreground">
            {notification.title}
          </h3>
          <time className="shrink-0 text-xs text-muted-foreground" dateTime={new Date(notification.createdAt).toISOString()}>
            {new Date(notification.createdAt).toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })}
          </time>
        </div>
        <p className="mt-1 text-sm text-foreground/80">{notification.body}</p>
        <div className="mt-2 flex items-center gap-2 text-xs">
          {unread && onMarkRead && (
            <button
              type="button"
              onClick={() => onMarkRead(notification.id)}
              className="rounded-md border border-border bg-background px-2 py-1 font-medium hover:bg-secondary"
            >
              Als gelesen markieren
            </button>
          )}
          {notification.href && (
            <a
              href={notification.href}
              className="rounded-md border border-border bg-background px-2 py-1 font-medium hover:bg-secondary"
            >
              Öffnen
            </a>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              aria-label="Löschen"
              className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
