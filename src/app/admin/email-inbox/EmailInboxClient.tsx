"use client";

import { useState } from "react";

type Row = {
  id: string;
  fromEmail: string;
  fromName: string | null;
  subject: string;
  bodyText: string;
  receivedAt: string;
  classification: "lead" | "application" | "complaint" | "support" | "other";
  confidence: number;
  routedTo: string | null;
};

const classLabel: Record<Row["classification"], { label: string; color: string }> = {
  lead: { label: "Lead", color: "bg-emerald-100 text-emerald-900" },
  application: { label: "Bewerbung", color: "bg-blue-100 text-blue-900" },
  complaint: { label: "Beschwerde", color: "bg-rose-100 text-rose-900" },
  support: { label: "Support", color: "bg-amber-100 text-amber-900" },
  other: { label: "Sonstiges", color: "bg-slate-100 text-slate-900" },
};

export function EmailInboxClient({ rows, activeFilter }: { rows: Row[]; activeFilter: string | null }) {
  const [selected, setSelected] = useState<Row | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function reRoute(id: string) {
    setBusy(id);
    try {
      await fetch(`/api/email/inbound/${id}/reroute`, { method: "POST" });
      window.location.reload();
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <nav className="mb-3 flex flex-wrap gap-2 text-xs">
        <a href="/admin/email-inbox" className={`rounded px-3 py-1 ${!activeFilter ? "bg-slate-900 text-white" : "bg-slate-100"}`}>Alle ({rows.length})</a>
        {(["lead", "application", "complaint", "support", "other"] as const).map((c) => (
          <a key={c} href={`/admin/email-inbox?classification=${c}`} className={`rounded px-3 py-1 ${activeFilter === c ? "bg-slate-900 text-white" : classLabel[c].color}`}>
            {classLabel[c].label}
          </a>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Absender</th>
                <th className="p-3">Betreff</th>
                <th className="p-3">Kategorie</th>
                <th className="p-3">Routed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const cls = classLabel[r.classification];
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`cursor-pointer border-t hover:bg-slate-50 ${selected?.id === r.id ? "bg-emerald-50" : ""}`}
                  >
                    <td className="p-3">
                      <div className="font-medium">{r.fromName ?? r.fromEmail}</div>
                      <div className="text-xs text-slate-500">{r.fromEmail}</div>
                    </td>
                    <td className="p-3 text-sm">{r.subject || "(ohne Betreff)"}</td>
                    <td className="p-3">
                      <span className={`rounded px-2 py-0.5 text-xs ${cls.color}`}>
                        {cls.label} {Math.round(r.confidence * 100)}%
                      </span>
                    </td>
                    <td className="p-3 text-xs">{r.routedTo ?? "-"}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Keine E-Mails.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <aside className="rounded-lg border bg-white p-4 shadow-sm">
          {!selected && <p className="text-sm text-muted-foreground">Waehlen Sie links eine E-Mail aus.</p>}
          {selected && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{selected.subject || "(ohne Betreff)"}</p>
                  <p className="text-xs text-slate-500">
                    Von {selected.fromName ?? selected.fromEmail} ({selected.fromEmail})
                    · {new Date(selected.receivedAt).toLocaleString("de-AT")}
                  </p>
                </div>
                <span className={`rounded px-2 py-0.5 text-xs ${classLabel[selected.classification].color}`}>
                  {classLabel[selected.classification].label}
                </span>
              </div>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs">
                {selected.bodyText || "(kein Text)"}
              </pre>
              <div className="mt-3 flex gap-2">
                <a
                  href={`mailto:${selected.fromEmail}?subject=AW: ${encodeURIComponent(selected.subject)}&body=${encodeURIComponent(
                    `\n\n--- Ursprungsnachricht ---\nVon: ${selected.fromEmail}\nBetreff: ${selected.subject}\n\n${selected.bodyText}`,
                  )}`}
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Antworten (mailto)
                </a>
                <button
                  onClick={() => reRoute(selected.id)}
                  disabled={busy === selected.id}
                  className="rounded-md border px-3 py-1.5 text-xs disabled:opacity-50"
                >
                  {busy === selected.id ? "…" : "Neu klassifizieren"}
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
