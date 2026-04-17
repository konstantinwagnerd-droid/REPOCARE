"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileDown, Shield, FileText, Clock } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

type Resident = { id: string; fullName: string; room: string };
type DsgvoRequest = {
  id: string;
  residentId: string;
  type: string;
  status: string;
  requestedBy: string;
  reason: string | null;
  decisionNote: string | null;
  createdAt: Date | string;
  resolvedAt: Date | string | null;
};

const statusLabel: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "secondary" }> = {
  offen: { label: "Offen", variant: "warning" },
  in_pruefung: { label: "In Prüfung", variant: "info" },
  abgelehnt_aufbewahrungspflicht: { label: "Abgelehnt (Aufbewahrungspflicht)", variant: "danger" },
  erledigt: { label: "Erledigt", variant: "success" },
};

export function DsgvoClient({ residents, initialRequests }: { residents: Resident[]; initialRequests: DsgvoRequest[] }) {
  const [selectedId, setSelectedId] = useState<string>(residents[0]?.id ?? "");
  const [requestedBy, setRequestedBy] = useState("Angehöriger");
  const [requests, setRequests] = useState(initialRequests);
  const [pending, start] = useTransition();

  const createAuskunft = async () => {
    if (!selectedId) return;
    start(async () => {
      try {
        const res = await fetch(`/api/exports/dsgvo/auskunft/${selectedId}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestedBy }),
        });
        if (!res.ok) throw new Error(await res.text());
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const cd = res.headers.get("Content-Disposition") ?? "";
        const name = cd.match(/filename="([^"]+)"/)?.[1] ?? "dsgvo-auskunft.zip";
        a.href = url; a.download = name; a.click();
        URL.revokeObjectURL(url);
        toast.success("DSGVO-Auskunft erstellt", { description: "ZIP mit PDF + JSON + Audit-Auszug." });
      } catch (e: unknown) {
        toast.error("Fehler bei Auskunft", { description: (e as Error).message });
      }
    });
  };

  const createLoeschung = async () => {
    if (!selectedId) return;
    start(async () => {
      const res = await fetch("/api/dsgvo/loeschung-anfrage", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residentId: selectedId, type: "loeschung", requestedBy, reason: "Antrag auf Löschung Art. 17 DSGVO" }),
      });
      const json = await res.json();
      if (res.ok) {
        setRequests([json.request, ...requests]);
        toast.success("Löschungsanfrage erfasst", { description: json.note });
      } else {
        toast.error("Fehler", { description: json.error });
      }
    });
  };

  const updateStatus = async (requestId: string, status: string) => {
    const res = await fetch("/api/dsgvo/loeschung-anfrage", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status, decisionNote: status === "abgelehnt_aufbewahrungspflicht" ? "Aufbewahrungspflicht 10 Jahre nach GuKG § 5 / SGB XI" : undefined }),
    });
    if (res.ok) {
      const json = await res.json();
      setRequests(requests.map((r) => r.id === requestId ? json.request : r));
      toast.success("Status aktualisiert");
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Neue DSGVO-Anfrage</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Bewohner:in</label>
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                {residents.map((r) => <option key={r.id} value={r.id}>{r.fullName} — Zimmer {r.room}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Antragsteller:in</label>
              <Input value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} placeholder="Name" className="mt-1" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={createAuskunft} disabled={pending || !selectedId} variant="accent">
              <FileDown className="h-4 w-4" /> Auskunft (Art. 15) erstellen
            </Button>
            <Button onClick={createLoeschung} disabled={pending || !selectedId} variant="outline">
              <FileText className="h-4 w-4" /> Löschungsanfrage (Art. 17)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Anfrage-Historie</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr><th className="p-3">Datum</th><th>Bewohner:in</th><th>Typ</th><th>Antragsteller:in</th><th>Status</th><th>Aktion</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Keine Anfragen.</td></tr>}
              {requests.map((r) => {
                const resident = residents.find((x) => x.id === r.residentId);
                const s = statusLabel[r.status] ?? { label: r.status, variant: "secondary" as const };
                return (
                  <tr key={r.id}>
                    <td className="p-3 whitespace-nowrap">{formatDateTime(r.createdAt)}</td>
                    <td>{resident?.fullName ?? "—"}</td>
                    <td><Badge variant="outline">{r.type}</Badge></td>
                    <td>{r.requestedBy}</td>
                    <td><Badge variant={s.variant}>{s.label}</Badge></td>
                    <td className="space-x-2">
                      {r.status === "offen" && (
                        <>
                          <button onClick={() => updateStatus(r.id, "in_pruefung")} className="text-xs text-primary hover:underline">Prüfen</button>
                          <button onClick={() => updateStatus(r.id, "abgelehnt_aufbewahrungspflicht")} className="text-xs text-destructive hover:underline">Ablehnen</button>
                        </>
                      )}
                      {r.status === "in_pruefung" && (
                        <button onClick={() => updateStatus(r.id, "erledigt")} className="text-xs text-emerald-700 hover:underline">Erledigen</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
