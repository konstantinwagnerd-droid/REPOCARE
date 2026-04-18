"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Resident { id: string; fullName: string; room: string; }
interface PastConf { id: string; date: string; residentIds: string[]; summary: string | null; }

interface Participant { name: string; role: string; }
interface AgendaItem { title: string; notes?: string; }
interface ActionItem { residentId: string; action: string; owner: string; dueDate: string; criteria: string; }

const PHASES = [
  { key: "prep", title: "1. Vorbereitung", minutes: 0, desc: "Bewohner:innen waehlen, Teilnehmer einladen, Agenda sammeln" },
  { key: "opening", title: "2. Eroeffnung", minutes: 3, desc: "Zweck bestaetigen, Anwesenheit pruefen" },
  { key: "case", title: "3. Fall-Vorstellung", minutes: 10, desc: "Ueberblick pro Bewohner:in" },
  { key: "discussion", title: "4. Diskussion", minutes: 20, desc: "Was laeuft gut? Was ist problematisch? Was ist neu?" },
  { key: "actions", title: "5. Massnahmen", minutes: 10, desc: "SMART-Ziele definieren" },
  { key: "closing", title: "6. Abschluss", minutes: 2, desc: "Zusammenfassung, Protokoll, naechster Termin" },
] as const;

export function FallbesprechungClient({ residents, pastConferences }: { residents: Resident[]; pastConferences: PastConf[]; }) {
  const [phase, setPhase] = useState(0);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([
    { name: "", role: "PDL" },
    { name: "", role: "Bezugspflege" },
  ]);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([{ title: "" }]);
  const [notes, setNotes] = useState("");
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [summary, setSummary] = useState("");
  const [createAsPlans, setCreateAsPlans] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const tStart = useRef<number>(Date.now());

  // Timer pro Phase
  useEffect(() => {
    tStart.current = Date.now();
    setElapsed(0);
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - tStart.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Autosave notes draft (localStorage)
  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem("careai_fb_draft") : null;
    if (raw) {
      try {
        const d = JSON.parse(raw);
        if (d.notes) setNotes(d.notes);
        if (d.agendaItems) setAgendaItems(d.agendaItems);
        if (d.selectedResidents) setSelectedResidents(d.selectedResidents);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("careai_fb_draft", JSON.stringify({ notes, agendaItems, selectedResidents }));
  }, [notes, agendaItems, selectedResidents]);

  const totalMinutes = PHASES.reduce((s, p) => s + p.minutes, 0);
  const current = PHASES[phase];
  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  function toggleResident(id: string) {
    setSelectedResidents((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  }

  function addAgendaItem() {
    setAgendaItems([...agendaItems, { title: "" }]);
  }

  function addActionItem() {
    setActionItems([...actionItems, { residentId: selectedResidents[0] ?? "", action: "", owner: "", dueDate: "", criteria: "" }]);
  }

  function autoSummary() {
    const resNames = selectedResidents.map((id) => residents.find((r) => r.id === id)?.fullName).filter(Boolean).join(", ");
    const actionsCount = actionItems.filter((a) => a.action).length;
    setSummary(
      `Fallbesprechung am ${new Date(date).toLocaleString("de-AT")}. ` +
      `Bewohner:innen: ${resNames || "—"}. ` +
      `${participants.filter((p) => p.name).length} Teilnehmer. ` +
      `${actionsCount} Massnahme${actionsCount === 1 ? "" : "n"} vereinbart.` +
      (notes ? `\n\nKernpunkte:\n${notes.slice(0, 400)}` : ""),
    );
  }

  async function saveConference() {
    try {
      const res = await fetch("/api/fallbesprechung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          durationMinutes: Math.round((Date.now() - tStart.current) / 60000),
          participants: participants.filter((p) => p.name),
          residentIds: selectedResidents,
          agendaItems: agendaItems.filter((a) => a.title),
          notes,
          actionItems: actionItems.filter((a) => a.action),
          summary,
          createActionsAsCarePlans: createAsPlans,
        }),
      });
      if (res.ok) {
        toast.success("Fallbesprechung gespeichert");
        if (typeof window !== "undefined") window.localStorage.removeItem("careai_fb_draft");
      } else {
        const j = await res.json();
        toast.error(j.error ?? "Fehler beim Speichern");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler");
    }
  }

  function downloadProtocol() {
    const txt = buildProtocolText({ date, participants, selectedResidents, residents, agendaItems, notes, actionItems, summary });
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fallbesprechung-${new Date(date).toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Phase-Header + Timer */}
      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Phase {phase + 1} / {PHASES.length}</div>
            <div className="font-serif text-xl font-semibold">{current.title}</div>
            <div className="text-xs text-muted-foreground">{current.desc}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-2xl tabular-nums">{formatTime(elapsed)}</div>
            <div className="text-xs text-muted-foreground">Richtwert: {current.minutes} Min · Gesamt {totalMinutes} Min</div>
          </div>
        </CardContent>
      </Card>

      {/* Phase-Content */}
      {phase === 0 && (
        <Card>
          <CardHeader><CardTitle>Vorbereitung</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Termin</Label>
              <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Bewohner:innen (1–3)</Label>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {residents.map((r) => {
                  const sel = selectedResidents.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleResident(r.id)}
                      className={`flex items-center justify-between rounded-lg border p-2 text-sm text-start ${sel ? "border-primary bg-primary/10" : "hover:bg-muted"}`}
                    >
                      <span>{r.fullName}</span>
                      <span className="text-xs text-muted-foreground">Zi. {r.room}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>Teilnehmer</Label>
              {participants.map((p, i) => (
                <div key={i} className="mt-2 grid grid-cols-2 gap-2">
                  <Input placeholder="Name" value={p.name} onChange={(e) => {
                    const next = [...participants]; next[i] = { ...p, name: e.target.value }; setParticipants(next);
                  }} />
                  <Input placeholder="Rolle" value={p.role} onChange={(e) => {
                    const next = [...participants]; next[i] = { ...p, role: e.target.value }; setParticipants(next);
                  }} />
                </div>
              ))}
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setParticipants([...participants, { name: "", role: "" }])}>+ Teilnehmer</Button>
            </div>
            <div>
              <Label>Agenda</Label>
              {agendaItems.map((a, i) => (
                <Input key={i} className="mt-2" placeholder="Punkt..." value={a.title} onChange={(e) => {
                  const next = [...agendaItems]; next[i] = { ...a, title: e.target.value }; setAgendaItems(next);
                }} />
              ))}
              <Button variant="ghost" size="sm" className="mt-2" onClick={addAgendaItem}>+ Agenda-Punkt</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === 1 && (
        <Card>
          <CardHeader><CardTitle>Eroeffnung</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">Zweck der Besprechung: strukturierte Fall-Reflexion, Abstimmung Massnahmen, Qualitaetssicherung.</p>
            <div className="rounded-lg border p-3">
              <div className="text-xs font-semibold">Teilnehmer anwesend:</div>
              <ul className="mt-2 space-y-1 text-sm">
                {participants.filter((p) => p.name).map((p, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>{p.name} · {p.role}</span>
                    <Badge variant="success">anwesend</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === 2 && (
        <Card>
          <CardHeader><CardTitle>Fall-Vorstellung</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {selectedResidents.length === 0 && <p className="text-sm text-muted-foreground">Keine Bewohner:innen ausgewaehlt. Zurueck zu Phase 1.</p>}
            {selectedResidents.map((id) => {
              const r = residents.find((x) => x.id === id);
              if (!r) return null;
              return (
                <div key={id} className="rounded-lg border p-3">
                  <div className="font-semibold">{r.fullName}</div>
                  <div className="text-xs text-muted-foreground">Zimmer {r.room}</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Aktuelle Situation, letzte Aenderungen, offene Fragen — PDL gibt Ueberblick.
                    Details zu Risk-Scores, AMTS-Flags und offenen Massnahmen siehe Bewohner-Akte.
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {phase === 3 && (
        <Card>
          <CardHeader><CardTitle>Diskussion</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground md:grid-cols-3">
              <div className="rounded border p-2">Was laeuft gut?</div>
              <div className="rounded border p-2">Was ist problematisch?</div>
              <div className="rounded border p-2">Was ist neu seit letzter Besprechung?</div>
            </div>
            <Label>Live-Notizen (Autosave)</Label>
            <Textarea rows={12} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Schluesselpunkte der Diskussion..." />
          </CardContent>
        </Card>
      )}

      {phase === 4 && (
        <Card>
          <CardHeader><CardTitle>Massnahmen (SMART)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {actionItems.map((a, i) => (
              <div key={i} className="rounded-lg border p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Bewohner:in</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={a.residentId}
                      onChange={(e) => { const n = [...actionItems]; n[i] = { ...a, residentId: e.target.value }; setActionItems(n); }}
                    >
                      {selectedResidents.map((id) => (
                        <option key={id} value={id}>{residents.find((r) => r.id === id)?.fullName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Frist</Label>
                    <Input type="date" value={a.dueDate} onChange={(e) => { const n = [...actionItems]; n[i] = { ...a, dueDate: e.target.value }; setActionItems(n); }} />
                  </div>
                </div>
                <div>
                  <Label>Massnahme</Label>
                  <Input value={a.action} onChange={(e) => { const n = [...actionItems]; n[i] = { ...a, action: e.target.value }; setActionItems(n); }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Verantwortlich</Label>
                    <Input value={a.owner} onChange={(e) => { const n = [...actionItems]; n[i] = { ...a, owner: e.target.value }; setActionItems(n); }} />
                  </div>
                  <div>
                    <Label>Erfolgskriterium</Label>
                    <Input value={a.criteria} onChange={(e) => { const n = [...actionItems]; n[i] = { ...a, criteria: e.target.value }; setActionItems(n); }} />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={addActionItem}>+ Massnahme</Button>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={createAsPlans} onChange={(e) => setCreateAsPlans(e.target.checked)} />
              Massnahmen automatisch als Pflegeplan-Eintraege anlegen
            </label>
          </CardContent>
        </Card>
      )}

      {phase === 5 && (
        <Card>
          <CardHeader><CardTitle>Abschluss</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Zusammenfassung</Label>
              <Button size="sm" variant="ghost" onClick={autoSummary}>Auto-generieren</Button>
            </div>
            <Textarea rows={8} value={summary} onChange={(e) => setSummary(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={saveConference}>Speichern</Button>
              <Button variant="outline" onClick={downloadProtocol}>Protokoll (TXT) herunterladen</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              DSGVO: Protokoll enthaelt personenbezogene Daten. Aufbewahrung gemaess §10 SGB XI bzw. §5 GuKG.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={phase === 0} onClick={() => setPhase((p) => Math.max(0, p - 1))}>Zurueck</Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setPhase((p) => Math.min(PHASES.length - 1, p + 1))}>Ueberspringen</Button>
          <Button disabled={phase === PHASES.length - 1} onClick={() => setPhase((p) => Math.min(PHASES.length - 1, p + 1))}>Weiter</Button>
        </div>
      </div>

      {/* Vergangene Besprechungen */}
      {pastConferences.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Letzte Besprechungen</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {pastConferences.map((c) => (
                <li key={c.id} className="flex items-start justify-between rounded-lg border p-2">
                  <div>
                    <div className="font-medium">{new Date(c.date).toLocaleDateString("de-AT")}</div>
                    <div className="text-xs text-muted-foreground">{c.residentIds.length} Bewohner:innen</div>
                    {c.summary && <div className="mt-1 text-xs">{c.summary.slice(0, 160)}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function buildProtocolText(opts: {
  date: string;
  participants: Participant[];
  selectedResidents: string[];
  residents: Resident[];
  agendaItems: AgendaItem[];
  notes: string;
  actionItems: ActionItem[];
  summary: string;
}): string {
  const lines: string[] = [];
  lines.push("FALLBESPRECHUNG — CareAI");
  lines.push("=".repeat(60));
  lines.push(`Datum: ${new Date(opts.date).toLocaleString("de-AT")}`);
  lines.push("");
  lines.push("TEILNEHMER");
  for (const p of opts.participants) if (p.name) lines.push(`  • ${p.name} (${p.role})`);
  lines.push("");
  lines.push("BEWOHNER:INNEN");
  for (const id of opts.selectedResidents) {
    const r = opts.residents.find((x) => x.id === id);
    if (r) lines.push(`  • ${r.fullName} (Zi. ${r.room})`);
  }
  lines.push("");
  lines.push("AGENDA");
  opts.agendaItems.filter((a) => a.title).forEach((a, i) => lines.push(`  ${i + 1}. ${a.title}`));
  lines.push("");
  lines.push("NOTIZEN");
  lines.push(opts.notes || "—");
  lines.push("");
  lines.push("MASSNAHMEN");
  for (const a of opts.actionItems) {
    if (!a.action) continue;
    const r = opts.residents.find((x) => x.id === a.residentId);
    lines.push(`  • ${r?.fullName ?? "—"}: ${a.action}`);
    lines.push(`    Verantwortlich: ${a.owner} · Frist: ${a.dueDate} · Erfolg: ${a.criteria}`);
  }
  lines.push("");
  lines.push("ZUSAMMENFASSUNG");
  lines.push(opts.summary || "—");
  lines.push("");
  lines.push("Signatur: ____________________   Datum: _________");
  lines.push("");
  lines.push("-- DSGVO-Hinweis --");
  lines.push("Dieses Dokument enthaelt besondere Kategorien personenbezogener Daten (Art. 9 DSGVO).");
  lines.push("Aufbewahrung gemaess §10 SGB XI / §5 GuKG. Zugriff nur autorisiertes Fachpersonal.");
  return lines.join("\n");
}
