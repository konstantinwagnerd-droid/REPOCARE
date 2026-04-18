/**
 * Handover-Summary v2 — 8-12h Schicht → strukturierter Übergabebericht.
 * Format: SBAR (Situation, Background, Assessment, Recommendation).
 */
import type { LLMRequest } from "../types";

export const HANDOVER_SUMMARY_V2_KEY = "handover-summary-v2";

const HANDOVER_SYSTEM_V2 = `Du bist ein Pflegeschicht-Leiter und erstellst SBAR-Schichtübergabe.

FORMAT (SBAR):
- S (Situation): Aktueller Zustand, akute Ereignisse der Schicht.
- B (Background): Relevante Diagnosen, Pflegegrad, Vorgeschichte (nur was relevant ist).
- A (Assessment): Eigene Einschätzung. Was steht im Raum? Was ist auffällig?
- R (Recommendation): Was muss die nächste Schicht TUN? Konkret, priorisiert.

REGELN:
- Keine Halluzination. Fakten aus Input only.
- Priorisierung: kritisch → hoch → routine.
- Knapp, konkret, handlungsorientiert. Keine Füllsätze.
- Bewohner-Name nur wenn gegeben (sonst "Bew.").

JSON-Schema:
{
  "shift_meta": {"from": "HH:MM", "to": "HH:MM", "date": "YYYY-MM-DD"},
  "critical_items": [{"resident": "...", "issue": "...", "action_required": "..."}],
  "routine_items": [{"resident": "...", "note": "..."}],
  "sbar": {
    "situation": "...",
    "background": "...",
    "assessment": "...",
    "recommendation": "..."
  },
  "pending_tasks": ["..."],
  "new_admissions": [],
  "discharges": []
}`;

export function buildHandoverSummaryV2(params: {
  shiftFrom: string;
  shiftTo: string;
  date: string;
  reports: Array<{ resident: string; shift: string; content: string; aiStructured?: unknown }>;
  incidents?: Array<{ resident: string; type: string; severity: string; description: string }>;
  openCarePlans?: Array<{ resident: string; title: string; status: string }>;
}): LLMRequest {
  const rpt = params.reports.map((r, i) => `[${i + 1}] ${r.resident} (${r.shift}): ${r.content.slice(0, 800)}`).join("\n\n");
  const inc = params.incidents?.length
    ? "\n\nVorkommnisse:\n" + params.incidents.map((i) => `- ${i.resident}: ${i.type} [${i.severity}] ${i.description}`).join("\n")
    : "";
  const cp = params.openCarePlans?.length
    ? "\n\nOffene Maßnahmen:\n" + params.openCarePlans.map((c) => `- ${c.resident}: ${c.title} [${c.status}]`).join("\n")
    : "";

  return {
    system: HANDOVER_SYSTEM_V2,
    promptKey: HANDOVER_SUMMARY_V2_KEY,
    temperature: 0.3,
    maxTokens: 2000,
    jsonMode: true,
    messages: [
      {
        role: "user",
        content: `Schicht: ${params.shiftFrom}-${params.shiftTo} am ${params.date}\n\nBerichte:\n${rpt}${inc}${cp}\n\nErstelle SBAR-Übergabe (JSON).`,
      },
    ],
  };
}
