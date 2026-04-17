"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flag, Play, Pause, Edit, Save, X, Percent, Users as UsersIcon, Target, FlaskConical } from "lucide-react";
import type { FeatureFlag, Role, TargetingRule } from "@/lib/feature-flags/types";

type Props = { initialFlags: FeatureFlag[] };

const ROLES: Role[] = ["admin", "pdl", "pflegekraft", "angehoeriger"];

export function FeatureFlagsClient({ initialFlags }: Props) {
  const [flags, setFlags] = useState(initialFlags);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<FeatureFlag | null>(null);
  const [filter, setFilter] = useState("");
  const [previewFlag, setPreviewFlag] = useState<string | null>(null);
  const [previewCtx, setPreviewCtx] = useState<{ role: Role; userId: string; tenantId: string }>({ role: "pflegekraft", userId: "user-123", tenantId: "tenant-demo" });
  const [previewResult, setPreviewResult] = useState<string>("");

  const filtered = useMemo(
    () => flags.filter((f) => f.key.includes(filter.toLowerCase()) || f.name.toLowerCase().includes(filter.toLowerCase()) || f.tags.some((t) => t.includes(filter.toLowerCase()))),
    [flags, filter],
  );

  const enabledCount = flags.filter((f) => f.enabled).length;
  const experimentCount = flags.filter((f) => f.tags.includes("experiment") || f.tags.includes("ab-test")).length;

  async function toggle(key: string, enabled: boolean) {
    const f = flags.find((x) => x.key === key);
    if (!f) return;
    const updated: FeatureFlag = { ...f, enabled };
    const r = await fetch("/api/feature-flags", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    if (r.ok) setFlags((prev) => prev.map((x) => (x.key === key ? updated : x)));
  }

  async function save() {
    if (!draft) return;
    const r = await fetch("/api/feature-flags", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
    if (r.ok) {
      setFlags((prev) => prev.map((x) => (x.key === draft.key ? draft : x)));
      setEditing(null); setDraft(null);
    }
  }

  async function preview(flagKey: string) {
    setPreviewFlag(flagKey);
    const r = await fetch("/api/feature-flags/evaluate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: flagKey, context: previewCtx }),
    });
    const j = await r.json();
    setPreviewResult(`${JSON.stringify(j.result.value)} (${j.result.reason}${j.result.matchedRuleId ? ` · ${j.result.matchedRuleId}` : ""})`);
  }

  function startEdit(f: FeatureFlag) { setEditing(f.key); setDraft(JSON.parse(JSON.stringify(f))); }

  function updateDraftRule(idx: number, patch: Partial<TargetingRule>) {
    if (!draft) return;
    const rules = [...draft.rules]; rules[idx] = { ...rules[idx], ...patch };
    setDraft({ ...draft, rules });
  }

  function addRule() {
    if (!draft) return;
    setDraft({ ...draft, rules: [...draft.rules, { id: `r${draft.rules.length + 1}`, description: "Neue Regel", enabled: true }] });
  }

  function removeRule(idx: number) {
    if (!draft) return;
    setDraft({ ...draft, rules: draft.rules.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Feature-Flags</h1>
        <p className="mt-1 text-muted-foreground">Progressive Rollouts, A/B-Tests und Tenant-Targeting für Produktions-Features.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon={<Flag className="h-5 w-5" />} label="Gesamt" value={flags.length} />
        <Stat icon={<Play className="h-5 w-5" />} label="Aktiv" value={enabledCount} tone="text-emerald-700 bg-emerald-100" />
        <Stat icon={<FlaskConical className="h-5 w-5" />} label="Experimente" value={experimentCount} tone="text-accent bg-accent/10" />
        <Stat icon={<Target className="h-5 w-5" />} label="Mit Targeting" value={flags.filter((f) => f.rules.length > 0).length} tone="text-amber-700 bg-amber-100" />
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Input placeholder="Suchen nach Key, Name oder Tag …" value={filter} onChange={(e) => setFilter(e.target.value)} className="md:max-w-sm" />
      </div>

      <div className="grid gap-4">
        {filtered.map((f) => {
          const isEditing = editing === f.key;
          const d = isEditing ? draft : f;
          if (!d) return null;
          return (
            <Card key={f.key}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="flex flex-wrap items-center gap-2">
                      <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm">{f.key}</code>
                      <Badge variant={f.enabled ? "success" : "outline"}>{f.enabled ? "aktiv" : "deaktiviert"}</Badge>
                      <Badge variant="outline">{f.kind}</Badge>
                      {f.tags.map((t) => (<Badge key={t} variant="outline">{t}</Badge>))}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{f.description} · Owner: {f.owner}</p>
                  </div>
                  <div className="flex gap-2">
                    {!isEditing && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => preview(f.key)}><Target className="mr-1 h-4 w-4" />Evaluieren</Button>
                        <Button size="sm" variant="outline" onClick={() => toggle(f.key, !f.enabled)}>
                          {f.enabled ? <><Pause className="mr-1 h-4 w-4" />Pausieren</> : <><Play className="mr-1 h-4 w-4" />Aktivieren</>}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => startEdit(f)}><Edit className="mr-1 h-4 w-4" />Targeting</Button>
                      </>
                    )}
                    {isEditing && (
                      <>
                        <Button size="sm" onClick={save}><Save className="mr-1 h-4 w-4" />Speichern</Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditing(null); setDraft(null); }}><X className="mr-1 h-4 w-4" />Abbrechen</Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {d.rules.length === 0 && !isEditing && <p className="text-sm text-muted-foreground">Keine Targeting-Regeln — Default-Wert: <code>{String(f.defaultValue)}</code></p>}
                {d.rules.map((r, idx) => (
                  <div key={r.id} className="rounded-xl border border-border p-3">
                    {!isEditing ? (
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 text-sm">
                          <div className="font-semibold">{r.description}</div>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {r.roles?.map((x) => <Badge key={x} variant="outline"><UsersIcon className="mr-1 h-3 w-3" />{x}</Badge>)}
                            {r.tenantIds?.map((x) => <Badge key={x} variant="outline">tenant:{x}</Badge>)}
                            {r.emailContains && <Badge variant="outline">email ~ &quot;{r.emailContains}&quot;</Badge>}
                            {typeof r.rolloutPercent === "number" && <Badge variant="outline"><Percent className="mr-1 h-3 w-3" />{r.rolloutPercent}% Rollout</Badge>}
                            {r.variant && <Badge variant="outline">variant: {r.variant}</Badge>}
                          </div>
                        </div>
                        <Badge variant={r.enabled ? "success" : "outline"}>{r.enabled ? "aktiv" : "aus"}</Badge>
                      </div>
                    ) : (
                      <div className="grid gap-2 md:grid-cols-2">
                        <div>
                          <Label>Beschreibung</Label>
                          <Input value={r.description} onChange={(e) => updateDraftRule(idx, { description: e.target.value })} />
                        </div>
                        <div>
                          <Label>Rollout %</Label>
                          <Input type="number" min={0} max={100} value={r.rolloutPercent ?? ""} onChange={(e) => updateDraftRule(idx, { rolloutPercent: e.target.value ? Number(e.target.value) : undefined })} />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Rollen (mehrfach mit Strg/Cmd)</Label>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {ROLES.map((role) => {
                              const active = r.roles?.includes(role);
                              return (
                                <button key={role} type="button" onClick={() => {
                                  const rs = new Set(r.roles ?? []);
                                  if (active) rs.delete(role); else rs.add(role);
                                  updateDraftRule(idx, { roles: rs.size ? Array.from(rs) : undefined });
                                }} className={`rounded-full border px-3 py-1 text-xs ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{role}</button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <Label>Tenant-IDs (komma-getrennt)</Label>
                          <Input value={(r.tenantIds ?? []).join(",")} onChange={(e) => updateDraftRule(idx, { tenantIds: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
                        </div>
                        <div>
                          <Label>E-Mail enthält</Label>
                          <Input value={r.emailContains ?? ""} onChange={(e) => updateDraftRule(idx, { emailContains: e.target.value || undefined })} />
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id={`en-${idx}`} checked={r.enabled} onChange={(e) => updateDraftRule(idx, { enabled: e.target.checked })} />
                          <Label htmlFor={`en-${idx}`}>Regel aktiv</Label>
                          <Button size="sm" variant="destructive" className="ml-auto" onClick={() => removeRule(idx)}>Regel löschen</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isEditing && <Button size="sm" variant="outline" onClick={addRule}>+ Neue Regel</Button>}

                {previewFlag === f.key && previewResult && (
                  <div className="mt-3 rounded-xl border border-dashed border-primary bg-primary/5 p-3">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <strong className="text-sm">Evaluate mit Kontext:</strong>
                      <select value={previewCtx.role} onChange={(e) => setPreviewCtx((p) => ({ ...p, role: e.target.value as Role }))} className="rounded border border-border bg-background px-2 py-1 text-xs">
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <Input value={previewCtx.userId} onChange={(e) => setPreviewCtx((p) => ({ ...p, userId: e.target.value }))} className="h-7 max-w-[160px]" />
                      <Button size="sm" onClick={() => preview(f.key)}>Erneut</Button>
                    </div>
                    <code className="text-sm">Result: <strong>{previewResult}</strong></code>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, tone = "text-primary bg-primary/10" }: { icon: React.ReactNode; label: string; value: number; tone?: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>{icon}</span>
        <div>
          <div className="font-serif text-3xl font-semibold">{value}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
