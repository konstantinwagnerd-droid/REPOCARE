"use client";

import { useEffect, useState, useCallback } from "react";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { SubscriptionManager } from "@/components/notifications/SubscriptionManager";
import type { Notification, NotificationChannel, NotificationEvent, NotificationPreferences } from "@/lib/notifications/types";
import { templates } from "@/lib/notifications/templates";

type Filter = "all" | "unread" | "critical";

function groupByDay(items: Notification[]): Array<{ day: string; items: Notification[] }> {
  const map = new Map<string, Notification[]>();
  for (const n of items) {
    const d = new Date(n.createdAt);
    const key = d.toLocaleDateString("de-AT", { weekday: "long", day: "2-digit", month: "long" });
    const arr = map.get(key) ?? [];
    arr.push(n);
    map.set(key, arr);
  }
  return [...map.entries()].map(([day, items]) => ({ day, items }));
}

export function InboxClient() {
  const [items, setItems] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [tab, setTab] = useState<"inbox" | "settings">("inbox");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications/inbox?filter=${filter}`, { cache: "no-store" });
      if (res.ok) setItems(((await res.json()) as { items: Notification[] }).items);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/notifications/preferences/save");
      if (res.ok) {
        const data = (await res.json()) as { prefs: NotificationPreferences };
        setPrefs(data.prefs);
      }
    })();
  }, []);

  async function onMarkRead(id: string) {
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    load();
  }

  async function onDelete(id: string) {
    // Demo: we use same mark-read; actual delete not exposed to keep API surface small
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    setItems((it) => it.filter((n) => n.id !== id));
  }

  async function savePrefs(next: NotificationPreferences) {
    setPrefs(next);
    await fetch("/api/notifications/preferences/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(next),
    });
  }

  const groups = groupByDay(items);

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1 text-sm">
        <button
          onClick={() => setTab("inbox")}
          className={`flex-1 rounded-lg px-3 py-2 font-medium ${tab === "inbox" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
        >
          Inbox
        </button>
        <button
          onClick={() => setTab("settings")}
          className={`flex-1 rounded-lg px-3 py-2 font-medium ${tab === "settings" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
        >
          Einstellungen
        </button>
      </div>

      {tab === "inbox" ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "unread", "critical"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  filter === f ? "bg-primary text-primary-foreground" : "border border-border bg-background hover:bg-secondary"
                }`}
              >
                {f === "all" ? "Alle" : f === "unread" ? "Ungelesen" : "Kritisch"}
              </button>
            ))}
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
              className="ml-auto rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-secondary"
            >
              Alle gelesen
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Lade …</div>
          ) : groups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              Keine Benachrichtigungen in dieser Ansicht.
            </div>
          ) : (
            groups.map((g) => (
              <section key={g.day} className="space-y-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.day}</h2>
                <div className="space-y-2">
                  {g.items.map((n) => (
                    <NotificationCard key={n.id} notification={n} onMarkRead={onMarkRead} onDelete={onDelete} />
                  ))}
                </div>
              </section>
            ))
          )}
        </>
      ) : prefs ? (
        <SettingsPanel prefs={prefs} onSave={savePrefs} />
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">Lade Einstellungen …</div>
      )}
    </div>
  );
}

function SettingsPanel({
  prefs,
  onSave,
}: {
  prefs: NotificationPreferences;
  onSave: (p: NotificationPreferences) => void;
}) {
  return (
    <div className="space-y-6">
      <SubscriptionManager />

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="font-serif text-base font-semibold">Channels</h2>
        <p className="mt-1 text-sm text-muted-foreground">Wähle, auf welchen Kanälen du Benachrichtigungen erhalten möchtest.</p>
        <ul className="mt-3 space-y-2">
          {(["in-app", "email", "push", "sms-stub"] as NotificationChannel[]).map((ch) => (
            <li key={ch} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2">
              <span className="text-sm capitalize">{ch.replace("-stub", " (Prod)")}</span>
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={prefs.channels[ch] !== false}
                  onChange={(e) =>
                    onSave({ ...prefs, channels: { ...prefs.channels, [ch]: e.target.checked } })
                  }
                  className="h-4 w-4 rounded border-border"
                />
                aktiv
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="font-serif text-base font-semibold">Ereignisse</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pro Event einzeln an- oder abschalten.</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {templates.map((t) => (
            <li key={t.event} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2">
              <span className="truncate text-sm">{t.event}</span>
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={prefs.events[t.event as NotificationEvent] !== false}
                  onChange={(e) =>
                    onSave({
                      ...prefs,
                      events: { ...prefs.events, [t.event]: e.target.checked },
                    })
                  }
                  className="h-4 w-4 rounded border-border"
                />
                aktiv
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="font-serif text-base font-semibold">Nachtruhe</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pausiert Push-Benachrichtigungen im angegebenen Zeitraum. Kritische Ereignisse kommen dennoch durch.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.quietHours.enabled}
              onChange={(e) =>
                onSave({ ...prefs, quietHours: { ...prefs.quietHours, enabled: e.target.checked } })
              }
              className="h-4 w-4 rounded border-border"
            />
            aktiv
          </label>
          <label className="inline-flex items-center gap-2">
            von
            <input
              type="time"
              value={prefs.quietHours.from}
              onChange={(e) =>
                onSave({ ...prefs, quietHours: { ...prefs.quietHours, from: e.target.value } })
              }
              className="rounded-md border border-border bg-background px-2 py-1"
            />
          </label>
          <label className="inline-flex items-center gap-2">
            bis
            <input
              type="time"
              value={prefs.quietHours.to}
              onChange={(e) =>
                onSave({ ...prefs, quietHours: { ...prefs.quietHours, to: e.target.value } })
              }
              className="rounded-md border border-border bg-background px-2 py-1"
            />
          </label>
        </div>
      </section>
    </div>
  );
}
