"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Lead, LeadStatus } from "./data";

const STATUSES: LeadStatus[] = ["neu", "qualifiziert", "demo", "verhandlung", "won", "lost"];

function euro(n: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatus(id: string, status: LeadStatus) {
    setUpdating(id);
    try {
      await fetch(`/api/partner/leads/${id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setUpdating(null);
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Einrichtung</th>
                <th className="px-4 py-3 text-left">Kontakt</th>
                <th className="px-4 py-3 text-left">Plätze</th>
                <th className="px-4 py-3 text-left">Monatswert</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {initialLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Noch keine Leads — das Formular oben ist der Startpunkt.
                  </td>
                </tr>
              )}
              {initialLeads.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium">{l.facilityName}</div>
                    {l.notes && <div className="mt-1 text-xs text-muted-foreground">{l.notes}</div>}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div>{l.contactName}</div>
                    <div className="text-xs text-muted-foreground">{l.email}</div>
                  </td>
                  <td className="px-4 py-3 align-top tabular-nums">{l.places}</td>
                  <td className="px-4 py-3 align-top tabular-nums">{euro(l.estimatedMonthlyValue)}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <select
                        value={l.status}
                        onChange={(e) => updateStatus(l.id, e.target.value as LeadStatus)}
                        disabled={updating === l.id}
                        aria-label={`Status für ${l.facilityName}`}
                        className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{label(s)}</option>
                        ))}
                      </select>
                      {updating === l.id && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function label(s: LeadStatus): string {
  switch (s) {
    case "neu": return "Neu";
    case "qualifiziert": return "Qualifiziert";
    case "demo": return "Demo";
    case "verhandlung": return "Verhandlung";
    case "won": return "Won";
    case "lost": return "Lost";
  }
}
