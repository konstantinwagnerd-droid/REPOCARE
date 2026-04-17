"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, LogIn, LogOut, Shield, History } from "lucide-react";
import type { ImpersonationSession } from "@/lib/impersonation/types";

type UserRow = { id: string; name: string; email: string; role: string };

type Props = {
  adminId: string;
  users: UserRow[];
  history: ImpersonationSession[];
  current: ImpersonationSession | null;
};

function fmtDateTime(ts: number): string { return new Date(ts).toLocaleString("de-AT"); }
function fmtDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function ImpersonationClient({ users, history, current }: Props) {
  const [filter, setFilter] = useState("");
  const [reason, setReason] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(filter.toLowerCase()) || u.email.toLowerCase().includes(filter.toLowerCase()) || u.role.includes(filter.toLowerCase()),
  );

  async function start() {
    if (!selectedId || reason.length < 5) { setErr("Bitte User auswählen und Grund (≥5 Zeichen) angeben."); return; }
    setBusy(true); setErr(null);
    const r = await fetch("/api/impersonation/start", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: selectedId, reason }),
    });
    if (!r.ok) { const j = await r.json().catch(() => ({})); setErr(j.error ?? "Fehler"); setBusy(false); return; }
    window.location.href = "/app";
  }

  async function stop() {
    await fetch("/api/impersonation/stop", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight flex items-center gap-3">
          <Shield className="h-8 w-8 text-accent" />Impersonation
        </h1>
        <p className="mt-1 text-muted-foreground">
          Als User einloggen, um Support zu leisten. Alle Aktionen werden im Audit-Log erfasst (entityType: impersonation).
        </p>
      </div>

      {current && (
        <Card className="border-accent bg-accent/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-accent">Aktuell aktiv</div>
              <div className="font-serif text-xl font-semibold">Eingeloggt als {current.targetName} ({current.targetRole})</div>
              <div className="text-sm text-muted-foreground">Grund: &bdquo;{current.reason}&ldquo; · Seit {fmtDateTime(current.startedAt)}</div>
            </div>
            <Button variant="destructive" onClick={stop}><LogOut className="mr-2 h-4 w-4" />Impersonation beenden</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5" />User auswählen</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Suchen nach Name, E-Mail oder Rolle …" value={filter} onChange={(e) => setFilter(e.target.value)} />
            <div className="max-h-96 space-y-1 overflow-y-auto pr-1">
              {filtered.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedId(u.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors ${selectedId === u.id ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"}`}
                >
                  <div>
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </div>
                  <Badge variant="outline">{u.role}</Badge>
                </button>
              ))}
              {filtered.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Keine User gefunden.</p>}
            </div>
            <div>
              <Label htmlFor="reason">Grund (min 5 Zeichen, Pflicht für Audit-Log) *</Label>
              <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="z. B. Ticket #4821 — User sieht Dienstplan nicht" />
            </div>
            {err && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">{err}</div>}
            <Button onClick={start} disabled={busy || !selectedId || reason.length < 5} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />Als ausgewählten User einloggen
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Verlauf ({history.length})</CardTitle></CardHeader>
          <CardContent className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
            {history.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Impersonation-Sessions.</p>}
            {history.map((h) => (
              <div key={h.id} className="rounded-xl border border-border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{h.adminName} → {h.targetName}</div>
                  <Badge variant={h.active ? "success" : "outline"}>{h.active ? "aktiv" : "beendet"}</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {fmtDateTime(h.startedAt)}{h.endedAt ? ` · ${fmtDuration(h.endedAt - h.startedAt)}` : " · läuft"}
                </div>
                <div className="mt-1 text-xs italic">&bdquo;{h.reason}&ldquo;</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
