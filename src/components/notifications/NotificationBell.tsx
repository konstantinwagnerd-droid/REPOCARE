"use client";

import { Bell } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Notification } from "@/lib/notifications/types";

export function NotificationBell() {
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/inbox?filter=all", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { items: Notification[]; unreadCount: number };
      setItems(data.items.slice(0, 5));
      setUnread(data.unreadCount);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 15_000);
    return () => clearInterval(t);
  }, [load]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Benachrichtigungen (${unread} ungelesen)`}
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span
            className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 animate-pulse items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
            aria-hidden="true"
          >
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Benachrichtigungen-Vorschau"
          className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-border bg-background shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="font-serif text-sm font-semibold">Benachrichtigungen</div>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/notifications/mark-read", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ all: true }),
                });
                load();
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Alle gelesen
            </button>
          </div>
          <ul className="max-h-80 divide-y divide-border overflow-auto">
            {items.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-muted-foreground">Keine Benachrichtigungen.</li>
            ) : (
              items.map((n) => (
                <li key={n.id} className={`px-4 py-3 text-sm ${!n.readAt ? "bg-muted/40" : ""}`}>
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-1 inline-block h-2 w-2 shrink-0 rounded-full ${
                        n.kind === "critical"
                          ? "bg-destructive"
                          : n.kind === "warning"
                            ? "bg-amber-500"
                            : n.kind === "success"
                              ? "bg-emerald-500"
                              : "bg-primary"
                      }`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{n.title}</div>
                      <div className="line-clamp-2 text-xs text-muted-foreground">{n.body}</div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
          <div className="border-t border-border p-2">
            <Link
              href="/app/notifications"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-primary hover:bg-secondary"
            >
              Alle ansehen
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
