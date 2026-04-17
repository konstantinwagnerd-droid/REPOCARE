"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plug, Plus, PlayCircle, RefreshCcw, BookOpen, Activity, CheckCircle2, XCircle, Power, Copy } from "lucide-react";
import { WEBHOOK_EVENTS, EVENT_DESCRIPTIONS, type Webhook, type DeliveryLog, type WebhookEvent } from "@/lib/webhooks/types";
import { formatDateTime, timeAgo } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  initialWebhooks: Webhook[];
  initialLogs: DeliveryLog[];
  stats: { total: number; success: number; failed: number; avgDurationMs: number };
};

export function WebhooksClient({ initialWebhooks, initialLogs, stats }: Props) {
  const [webhooks, setWebhooks] = useState(initialWebhooks);
  const [logs, setLogs] = useState(initialLogs);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  async function refreshLogs() {
    const res = await fetch("/api/webhooks/admin/logs");
    const json = await res.json();
    setLogs(json.logs ?? []);
  }

  async function toggleStatus(id: string) {
    const res = await fetch(`/api/webhooks/admin/${id}/toggle`, { method: "POST" });
    const json = await res.json();
    if (json.webhook) {
      setWebhooks((prev) => prev.map((w) => (w.id === id ? json.webhook : w)));
      toast.success(`Webhook ${json.webhook.status === "active" ? "aktiviert" : "deaktiviert"}`);
    }
  }

  async function testWebhook(id: string) {
    toast.info("Test-Event wird gesendet …");
    await fetch("/api/webhooks/admin/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTimeout(refreshLogs, 500);
    toast.success("Test-Event im Delivery-Log");
  }

  async function retry(id: string) {
    await fetch(`/api/webhooks/admin/${id}/retry`, { method: "POST" });
    setTimeout(refreshLogs, 300);
    toast.success("Re-Dispatch ausgelöst");
  }

  const successRate = useMemo(() => {
    if (stats.total === 0) return 100;
    return Math.round((stats.success / stats.total) * 100);
  }, [stats]);

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Webhooks</h1>
          <p className="mt-1 text-muted-foreground">
            Events aus CareAI an externe Systeme weiterreichen — KIS, Versicherung, Zeiterfassung.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/webhooks/docs">
              <BookOpen className="h-4 w-4" /> API-Dokumentation
            </Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" /> Neuer Webhook
              </Button>
            </DialogTrigger>
            <CreateWebhookDialog
              onClose={() => setOpen(false)}
              onCreated={(wh) => {
                setWebhooks((p) => [...p, wh]);
                setOpen(false);
              }}
            />
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Aktive Webhooks", value: webhooks.filter((w) => w.status === "active").length, icon: Plug, tone: "text-primary bg-primary/10" },
          { label: "Deliveries (total)", value: stats.total, icon: Activity, tone: "text-accent bg-accent/10" },
          { label: "Success-Rate", value: `${successRate}%`, icon: CheckCircle2, tone: "text-emerald-700 bg-emerald-100" },
          { label: "Ø Latenz", value: `${stats.avgDurationMs} ms`, icon: RefreshCcw, tone: "text-amber-700 bg-amber-100" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${k.tone}`}>
                <k.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-serif text-3xl font-semibold">{k.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="endpoints">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints ({webhooks.length})</TabsTrigger>
          <TabsTrigger value="log">Delivery-Log ({logs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints">
          <div className="space-y-3">
            {webhooks.length === 0 && (
              <Card>
                <CardContent className="p-10 text-center text-muted-foreground">
                  Noch keine Webhooks konfiguriert. Legen Sie den ersten Endpoint an.
                </CardContent>
              </Card>
            )}
            {webhooks.map((w) => (
              <Card key={w.id}>
                <CardContent className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg font-semibold">{w.name}</h3>
                      <Badge variant={w.status === "active" ? "success" : w.status === "failing" ? "danger" : "secondary"}>
                        {w.status === "active" ? "aktiv" : w.status === "failing" ? "fehlerhaft" : "deaktiviert"}
                      </Badge>
                    </div>
                    <code className="block truncate rounded-lg bg-muted px-2 py-1 font-mono text-xs">{w.url}</code>
                    <div className="flex flex-wrap gap-1">
                      {w.events.map((e) => (
                        <Badge key={e} variant="outline" className="font-mono text-[10px]">{e}</Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>Erstellt {formatDateTime(w.createdAt)}</span>
                      <span>Letzte Zustellung: {w.lastDeliveryAt ? timeAgo(w.lastDeliveryAt) : "—"}</span>
                      <span className="text-emerald-700">{w.successCount} OK</span>
                      <span className="text-destructive">{w.failureCount} Fehler</span>
                    </div>
                    <SecretRow secret={w.secret} />
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => testWebhook(w.id)} disabled={isPending}>
                      <PlayCircle className="h-4 w-4" /> Testen
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => startTransition(() => toggleStatus(w.id))}>
                      <Power className="h-4 w-4" /> {w.status === "active" ? "Deaktivieren" : "Aktivieren"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="log">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Letzte Zustellungen</CardTitle>
              <Button size="sm" variant="outline" onClick={refreshLogs}>
                <RefreshCcw className="h-4 w-4" /> Aktualisieren
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Zeit</th>
                    <th>Event</th>
                    <th>URL</th>
                    <th>Status</th>
                    <th>Versuche</th>
                    <th>Dauer</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((l) => (
                    <tr key={l.id}>
                      <td className="whitespace-nowrap p-3">{formatDateTime(l.createdAt)}</td>
                      <td><code className="font-mono text-xs">{l.event}</code></td>
                      <td className="max-w-[220px] truncate text-xs text-muted-foreground">{l.url}</td>
                      <td>
                        <Badge variant={l.status === "success" ? "success" : l.status === "failed" ? "danger" : "warning"}>
                          {l.status === "success" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : l.status === "failed" ? (
                            <XCircle className="h-3 w-3" />
                          ) : null}
                          {l.statusCode ?? "—"}
                        </Badge>
                      </td>
                      <td>{l.attemptCount}/5</td>
                      <td>{l.durationMs} ms</td>
                      <td>
                        {l.status !== "success" && (
                          <Button size="sm" variant="ghost" onClick={() => retry(l.id)}>
                            <RefreshCcw className="h-3 w-3" /> Retry
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-muted-foreground">Noch keine Zustellungen.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SecretRow({ secret }: { secret: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground">Secret:</span>
      <code className="rounded bg-muted px-2 py-0.5 font-mono">
        {revealed ? secret : `${secret.slice(0, 10)}••••••••••••••••`}
      </code>
      <button className="text-primary hover:underline" onClick={() => setRevealed((v) => !v)}>
        {revealed ? "Verbergen" : "Anzeigen"}
      </button>
      <button
        className="text-primary hover:underline"
        onClick={() => {
          navigator.clipboard.writeText(secret);
          toast.success("Secret kopiert");
        }}
      >
        <Copy className="inline h-3 w-3" />
      </button>
    </div>
  );
}

function CreateWebhookDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (wh: Webhook) => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://");
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [customHeaderKey, setCustomHeaderKey] = useState("");
  const [customHeaderVal, setCustomHeaderVal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!name || !url || events.length === 0) {
      toast.error("Name, URL und mindestens ein Event sind erforderlich");
      return;
    }
    setSubmitting(true);
    const headers: Record<string, string> = {};
    if (customHeaderKey && customHeaderVal) headers[customHeaderKey] = customHeaderVal;
    const res = await fetch("/api/webhooks/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url, events, headers }),
    });
    const json = await res.json();
    setSubmitting(false);
    if (json.webhook) {
      toast.success("Webhook angelegt");
      onCreated(json.webhook);
    } else {
      toast.error(json.error ?? "Fehler");
    }
  }

  return (
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Neuer Webhook</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="wh-name">Bezeichnung</Label>
          <Input id="wh-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. KIS Produktion" />
        </div>
        <div>
          <Label htmlFor="wh-url">Endpoint-URL (HTTPS)</Label>
          <Input id="wh-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/webhooks" />
        </div>
        <div>
          <Label>Events</Label>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {WEBHOOK_EVENTS.map((ev) => (
              <label key={ev} className="flex items-start gap-2 rounded-lg border border-border p-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={events.includes(ev)}
                  onChange={(e) => {
                    setEvents((prev) => (e.target.checked ? [...prev, ev] : prev.filter((x) => x !== ev)));
                  }}
                />
                <div>
                  <code className="font-mono text-xs">{ev}</code>
                  <div className="text-xs text-muted-foreground">{EVENT_DESCRIPTIONS[ev]}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div>
          <Label>Custom Header (optional)</Label>
          <div className="mt-2 flex gap-2">
            <Input placeholder="X-Header-Name" value={customHeaderKey} onChange={(e) => setCustomHeaderKey(e.target.value)} />
            <Input placeholder="Wert" value={customHeaderVal} onChange={(e) => setCustomHeaderVal(e.target.value)} />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Abbrechen</Button>
        <Button onClick={submit} disabled={submitting}>
          {submitting ? "Speichert …" : "Webhook anlegen"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
