"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyRound, Plus, Receipt, Activity, Ban, Copy, PlayCircle, Zap } from "lucide-react";
import type { ApiKey, Invoice, Plan, PlanTier, UsageBucket } from "@/lib/billing/types";

type Props = {
  initialKeys: ApiKey[];
  initialUsage: UsageBucket[];
  initialInvoices: Invoice[];
  plans: Plan[];
};

function fmtInt(n: number): string { return n.toLocaleString("de-AT"); }
function fmtEUR(n: number): string { return n.toLocaleString("de-AT", { style: "currency", currency: "EUR" }); }

export function BillingClient({ initialKeys, initialUsage, initialInvoices, plans }: Props) {
  const [keys, setKeys] = useState(initialKeys);
  const [usage, setUsage] = useState(initialUsage);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [newLabel, setNewLabel] = useState("");
  const [newPlan, setNewPlan] = useState<PlanTier>("starter");
  const [busy, setBusy] = useState(false);
  const [meterStatus, setMeterStatus] = useState<string>("");

  const usageByDay = useMemo(() => {
    const m = new Map<string, number>();
    for (const b of usage) m.set(b.day, (m.get(b.day) ?? 0) + b.count);
    return Array.from(m.entries()).sort();
  }, [usage]);
  const maxDay = Math.max(1, ...usageByDay.map(([, v]) => v));
  const totalMonth = usage.reduce((a, b) => a + b.count, 0);
  const totalErrors = usage.reduce((a, b) => a + b.errors, 0);

  async function createKey() {
    if (!newLabel.trim()) return;
    setBusy(true);
    const res = await fetch("/api/billing/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel, planId: newPlan }),
    });
    if (res.ok) {
      const { key } = await res.json();
      setKeys((prev) => [key, ...prev]);
      setNewLabel("");
    }
    setBusy(false);
  }

  async function changePlan(id: string, planId: PlanTier) {
    const res = await fetch(`/api/billing/keys/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    if (res.ok) { const { key } = await res.json(); setKeys((prev) => prev.map((k) => (k.id === id ? key : k))); }
  }

  async function revoke(id: string) {
    const res = await fetch(`/api/billing/keys/${id}`, { method: "DELETE" });
    if (res.ok) setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, revoked: true } : k)));
  }

  async function simulateMeter(apiKey: string) {
    setMeterStatus("Sende Request …");
    const r = await fetch("/api/billing/meter", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ endpoint: "/api/public/residents", method: "GET" }),
    });
    const j = await r.json();
    setMeterStatus(`${r.status} · Remaining ${j.rateLimit?.remaining ?? "?"} · Latenz ${j.request?.latencyMs ?? "?"} ms`);
    // Usage reload
    const u = await fetch("/api/billing/usage?days=30").then((x) => x.json());
    setUsage(u.buckets);
  }

  async function generateInvoice(apiKeyId: string) {
    const ym = new Date().toISOString().slice(0, 7);
    const r = await fetch("/api/billing/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKeyId, periodYm: ym }),
    });
    if (r.ok) { const { invoice } = await r.json(); setInvoices((p) => [invoice, ...p]); }
  }

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">API-Monetization</h1>
        <p className="mt-1 text-muted-foreground">
          API-Keys, Usage-Metering (RFC-8594) und Rechnungen für Drittsysteme (KIS, Apotheke, Arzt-Software).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={<KeyRound className="h-5 w-5" />} label="Aktive API-Keys" value={fmtInt(keys.filter((k) => !k.revoked).length)} tone="text-primary bg-primary/10" />
        <StatCard icon={<Activity className="h-5 w-5" />} label="Requests (30 Tage)" value={fmtInt(totalMonth)} tone="text-accent bg-accent/10" />
        <StatCard icon={<Zap className="h-5 w-5" />} label="Fehlerrate" value={`${((totalErrors / Math.max(1, totalMonth)) * 100).toFixed(2)} %`} tone="text-amber-700 bg-amber-100" />
        <StatCard icon={<Receipt className="h-5 w-5" />} label="Umsatz (Invoices)" value={fmtEUR(invoices.reduce((a, i) => a + i.totalEUR, 0))} tone="text-emerald-700 bg-emerald-100" />
      </div>

      <Tabs defaultValue="keys">
        <TabsList>
          <TabsTrigger value="keys">API-Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="plans">Pläne</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="mt-6 space-y-4">
          <Card>
            <CardHeader><CardTitle>Neuen API-Key erstellen</CardTitle></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-[2fr,1fr,auto]">
              <div>
                <Label htmlFor="label">Bezeichnung</Label>
                <Input id="label" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="z. B. KIS Apotheke Wien-Meidling" />
              </div>
              <div>
                <Label htmlFor="plan">Plan</Label>
                <select id="plan" value={newPlan} onChange={(e) => setNewPlan(e.target.value as PlanTier)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                  {plans.map((p) => (<option key={p.id} value={p.id}>{p.name} — {fmtEUR(p.monthlyPriceEUR)}</option>))}
                </select>
              </div>
              <div className="flex items-end"><Button disabled={busy || !newLabel.trim()} onClick={createKey}><Plus className="mr-2 h-4 w-4" />Erstellen</Button></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>API-Keys ({keys.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {keys.map((k) => (
                <div key={k.id} className="flex flex-col gap-3 rounded-xl border border-border p-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold">{k.label}{k.revoked && <Badge variant="danger">Revoked</Badge>}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <code className="rounded bg-muted px-2 py-0.5 font-mono">{k.key}</code>
                      <button onClick={() => navigator.clipboard.writeText(k.key)} className="rounded p-1 hover:bg-secondary" aria-label="API-Key kopieren"><Copy className="h-3 w-3" /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={k.planId} disabled={k.revoked} onChange={(e) => changePlan(k.id, e.target.value as PlanTier)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
                      {plans.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                    </select>
                    <Button size="sm" variant="outline" disabled={k.revoked} onClick={() => simulateMeter(k.key)}><PlayCircle className="mr-1 h-4 w-4" />Test-Request</Button>
                    <Button size="sm" variant="outline" onClick={() => generateInvoice(k.id)}><Receipt className="mr-1 h-4 w-4" />Rechnung</Button>
                    {!k.revoked && <Button size="sm" variant="destructive" onClick={() => revoke(k.id)}><Ban className="mr-1 h-4 w-4" />Sperren</Button>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {meterStatus && (
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm">
              <strong>Live-Meter:</strong> {meterStatus}
            </div>
          )}
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Usage (30 Tage)</CardTitle></CardHeader>
            <CardContent>
              <div className="flex h-64 items-end gap-1">
                {usageByDay.map(([day, count]) => (
                  <div key={day} className="group flex flex-1 flex-col items-center justify-end" title={`${day}: ${fmtInt(count)}`}>
                    <div className="w-full rounded-t bg-primary transition-colors hover:bg-accent" style={{ height: `${(count / maxDay) * 100}%`, minHeight: "2px" }} />
                    <span className="mt-1 text-[9px] text-muted-foreground">{day.slice(-2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                <span>Gesamt: {fmtInt(totalMonth)} Requests</span>
                <span>Peak-Tag: {fmtInt(maxDay)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((p) => (
              <Card key={p.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {p.name}
                    <Badge variant="outline">{fmtEUR(p.monthlyPriceEUR)}/Mon</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <ul className="space-y-2 text-sm">
                    {p.features.map((f) => (<li key={f} className="flex gap-2"><span className="text-primary">✓</span>{f}</li>))}
                  </ul>
                  <div className="text-xs text-muted-foreground">
                    Rate-Limit: {fmtInt(p.rateLimitRpm)} req/min · Overage: {fmtEUR(p.overagePerThousandEUR)} / 1.000
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Rechnungen ({invoices.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {invoices.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Rechnungen. Klicke bei einem API-Key auf „Rechnung".</p>}
              {invoices.map((inv) => (
                <div key={inv.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{inv.id}</div>
                      <div className="text-xs text-muted-foreground">{inv.periodStart} → {inv.periodEnd} · Plan {inv.planId}</div>
                    </div>
                    <Badge variant={inv.status === "paid" ? "success" : "default"}>{inv.status}</Badge>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm md:grid-cols-4">
                    <div><span className="text-muted-foreground">Requests:</span> {fmtInt(inv.usedRequests)} / {fmtInt(inv.includedRequests)}</div>
                    <div><span className="text-muted-foreground">Overage:</span> {fmtInt(inv.overageRequests)}</div>
                    <div><span className="text-muted-foreground">Grundgebühr:</span> {fmtEUR(inv.baseFeeEUR)}</div>
                    <div className="font-semibold"><span className="text-muted-foreground">Total:</span> {fmtEUR(inv.totalEUR)}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>{icon}</span>
        <div>
          <div className="font-serif text-2xl font-semibold">{value}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
