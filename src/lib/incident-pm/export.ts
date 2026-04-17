/**
 * Export eines Post-Mortems als printbares HTML.
 */

import type { PostMortem } from "./types";
import { computeLearningScore } from "./score";

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fmt = (iso: string): string =>
  new Date(iso).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" });

export function exportPostMortemHtml(pm: PostMortem): string {
  const score = computeLearningScore(pm.actionItems);
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8" />
<title>Post-Mortem — ${esc(pm.title)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111; padding: 32px; max-width: 860px; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h2 { font-size: 16px; margin: 24px 0 8px; border-bottom: 2px solid #111; padding-bottom: 4px; }
  .banner { background: #f0fdf4; border: 1px solid #86efac; padding: 8px 12px; border-radius: 6px; color: #166534; font-size: 13px; margin-bottom: 18px; }
  .meta { color: #555; font-size: 13px; margin-bottom: 18px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 8px 0 12px; }
  th, td { border-bottom: 1px solid #e5e7eb; padding: 8px; vertical-align: top; text-align: left; }
  th { background: #f9fafb; font-size: 11px; text-transform: uppercase; }
  ul { margin: 4px 0 10px 20px; padding: 0; }
  .factor-mensch { background: #fee2e2; }
  .factor-system { background: #dbeafe; }
  .factor-organisation { background: #fef3c7; }
  .factor-umgebung { background: #ecfccb; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; background: #e0e7ff; color: #3730a3; }
  .score { font-size: 22px; font-weight: bold; }
  @media print { body { padding: 0; } }
</style></head><body>
  <div class="banner"><strong>Blameless:</strong> Dieser Post-Mortem fokussiert das System, nicht Personen. Aktionen werden an Rollen/Prozesse adressiert.</div>
  <h1>Post-Mortem: ${esc(pm.title)}</h1>
  <div class="meta">
    Template: ${esc(pm.templateKey)} · Erstellt ${fmt(pm.createdAt)} · Status: <span class="badge">${esc(pm.status)}</span>
    · Learning-Score: <strong>${score}%</strong>
  </div>

  <h2>1. Timeline</h2>
  <table><thead><tr><th>Zeit</th><th>Akteur (Rolle)</th><th>Aktion</th><th>Ergebnis</th></tr></thead>
    <tbody>${pm.timeline
      .map(
        (t) =>
          `<tr><td>${esc(fmt(t.at))}</td><td>${esc(t.actor)}</td><td>${esc(t.action)}</td><td>${esc(t.outcome ?? "")}</td></tr>`,
      )
      .join("")}</tbody></table>

  <h2>2. Contributing Factors</h2>
  <table><thead><tr><th>Kategorie</th><th>Beschreibung</th></tr></thead>
    <tbody>${pm.contributingFactors
      .map(
        (f) =>
          `<tr class="factor-${esc(f.category)}"><td><strong>${esc(f.category)}</strong></td><td>${esc(f.description)}</td></tr>`,
      )
      .join("")}</tbody></table>

  <h2>3. What Went Well</h2>
  <ul>${pm.whatWentWell.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>

  <h2>4. What Went Wrong</h2>
  <ul>${pm.whatWentWrong.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>

  <h2>5. Action Items</h2>
  <table><thead><tr><th>Titel</th><th>Owner (Rolle)</th><th>Faellig</th><th>Status</th></tr></thead>
    <tbody>${pm.actionItems
      .map(
        (a) =>
          `<tr><td>${esc(a.title)}</td><td>${esc(a.owner)}</td><td>${esc(a.dueDate ?? "—")}</td><td>${esc(a.status)}</td></tr>`,
      )
      .join("")}</tbody></table>

  <h2>6. Sign-Off</h2>
  <table><thead><tr><th>Rolle</th><th>Name</th><th>Unterzeichnet</th></tr></thead>
    <tbody>${pm.signOffs
      .map((s) => `<tr><td>${esc(s.role)}</td><td>${esc(s.userName ?? "")}</td><td>${esc(fmt(s.signedAt))}</td></tr>`)
      .join("")}</tbody></table>
</body></html>`;
}
