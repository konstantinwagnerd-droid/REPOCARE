"use client";

import { useEffect, useState } from "react";
import { Send, ClipboardList, BarChart3 } from "lucide-react";
import type { NotificationTemplate, DeliveryStat } from "@/lib/notifications/types";

export function AdminNotificationsClient({ templates }: { templates: NotificationTemplate[] }) {
  const [tab, setTab] = useState<"templates" | "rules" | "test" | "stats">("templates");

  return (
    <div className="space-y-6">
      <div className="grid gap-2 rounded-xl border border-border bg-muted/30 p-1 text-sm sm:grid-cols-4">
        {(
          [
            { k: "templates", l: "Templates", i: ClipboardList },
            { k: "rules", l: "Regeln", i: ClipboardList },
            { k: "test", l: "Test", i: Send },
            { k: "stats", l: "Statistik", i: BarChart3 },
          ] as const
        ).map(({ k, l, i: Icon }) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 font-medium transition-colors ${
              tab === k ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" /> {l}
          </button>
        ))}
      </div>
      {tab === "templates" && <TemplatesList templates={templates} />}
      {tab === "rules" && <RulesEditor templates={templates} />}
      {tab === "test" && <TestSender templates={templates} />}
      {tab === "stats" && <StatsView />}
    </div>
  );
}

function TemplatesList({ templates }: { templates: NotificationTemplate[] }) {
  return (
    <div className="rounded-xl border border-border bg-background">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Event</th>
            <th className="px-4 py-3">Kind</th>
            <th className="px-4 py-3">Titel</th>
            <th className="px-4 py-3">Empfänger</th>
            <th className="px-4 py-3">Channels</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {templates.map((t) => (
            <tr key={t.event}>
              <td className="px-4 py-3 font-mono text-xs">{t.event}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    t.kind === "critical"
                      ? "bg-destructive/10 text-destructive"
                      : t.kind === "warning"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
                        : t.kind === "success"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                          : "bg-primary/10 text-primary"
                  }`}
                >
                  {t.kind}
                </span>
              </td>
              <td className="px-4 py-3">{t.title}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{t.recipients.join(", ")}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{t.defaultChannels.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RulesEditor({ templates }: { templates: NotificationTemplate[] }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Pro Event: welche Rollen werden benachrichtigt, auf welchen Channels. Regeln werden pro Einrichtung in den In-Memory-Store geschrieben
        (Demo). Produktionsspeicher ist die Datenbank.
      </p>
      {templates.map((t) => (
        <div key={t.event} className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs">{t.event}</div>
            <div className="flex gap-1">
              {["in-app", "email", "push", "sms-stub"].map((c) => (
                <label key={c} className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 px-2 py-1 text-xs">
                  <input type="checkbox" defaultChecked={t.defaultChannels.includes(c as never)} className="h-3.5 w-3.5" />
                  {c}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Empfänger-Rollen: {t.recipients.join(", ")}</div>
        </div>
      ))}
    </div>
  );
}

function TestSender({ templates }: { templates: NotificationTemplate[] }) {
  const [event, setEvent] = useState(templates[0]?.event ?? "incident.reported");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/notifications/test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ event }),
      });
      const data = (await res.json()) as { ok?: boolean; unread?: number; error?: string };
      setMsg(res.ok ? `Gesendet. Dein Unread-Count: ${data.unread}.` : (data.error ?? "Fehler."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <label className="block text-sm font-medium">Event</label>
      <select
        value={event}
        onChange={(e) => setEvent(e.target.value as typeof event)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      >
        {templates.map((t) => (
          <option key={t.event} value={t.event}>
            {t.event} — {t.kind}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={send}
        disabled={busy}
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <Send className="h-4 w-4" /> Test senden
      </button>
      {msg && <div className="mt-3 rounded-lg bg-muted/40 p-3 text-sm">{msg}</div>}
    </div>
  );
}

function StatsView() {
  const [stats, setStats] = useState<DeliveryStat[]>([]);
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/notifications/test");
      if (res.ok) setStats(((await res.json()) as { stats: DeliveryStat[] }).stats);
    })();
  }, []);
  const totalDelivered = stats.reduce((a, s) => a + s.delivered, 0);
  const totalFailed = stats.reduce((a, s) => a + s.failed, 0);
  const rate = totalDelivered + totalFailed > 0 ? Math.round((totalDelivered / (totalDelivered + totalFailed)) * 1000) / 10 : 100;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <KPI label="Zugestellt (7d)" value={totalDelivered.toString()} />
        <KPI label="Fehlgeschlagen (7d)" value={totalFailed.toString()} />
        <KPI label="Zustellungsrate" value={`${rate}%`} />
      </div>
      <div className="rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Tag</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">OK</th>
              <th className="px-4 py-3">Fehler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stats.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Noch keine Zustellungen heute. Sende einen Test im Tab „Test“.
                </td>
              </tr>
            ) : (
              stats.map((s, i) => (
                <tr key={`${s.day}-${s.event}-${s.channel}-${i}`}>
                  <td className="px-4 py-3">{s.day}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.event}</td>
                  <td className="px-4 py-3">{s.channel}</td>
                  <td className="px-4 py-3 text-emerald-600">{s.delivered}</td>
                  <td className="px-4 py-3 text-destructive">{s.failed}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-serif text-3xl font-semibold">{value}</div>
    </div>
  );
}
