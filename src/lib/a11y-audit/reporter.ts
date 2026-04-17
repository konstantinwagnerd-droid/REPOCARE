import type { AuditResult } from "./types";

export function toMarkdown(result: AuditResult): string {
  const lines: string[] = [];
  lines.push(`# A11y Audit Report`);
  lines.push(``);
  lines.push(`- **Timestamp:** ${result.timestamp}`);
  lines.push(`- **Files scanned:** ${result.filesScanned}`);
  lines.push(`- **Rules evaluated:** ${result.rulesEvaluated}`);
  lines.push(`- **Duration:** ${result.durationMs} ms`);
  lines.push(`- **Pass rate:** ${(result.summary.passRate * 100).toFixed(1)}%`);
  lines.push(``);
  lines.push(`## Summary`);
  lines.push(``);
  lines.push(`| Severity | Count |`);
  lines.push(`|----------|------:|`);
  lines.push(`| Critical | ${result.summary.critical} |`);
  lines.push(`| Serious  | ${result.summary.serious} |`);
  lines.push(`| Moderate | ${result.summary.moderate} |`);
  lines.push(`| Minor    | ${result.summary.minor} |`);
  lines.push(`| **Total**| **${result.summary.total}** |`);
  lines.push(``);
  if (result.violations.length) {
    lines.push(`## Violations`);
    lines.push(``);
    for (const v of result.violations.slice(0, 200)) {
      lines.push(`### ${v.title} (${v.ruleId}, WCAG ${v.wcag} ${v.level})`);
      lines.push(`- **File:** \`${v.file}:${v.line}\``);
      lines.push(`- **Severity:** ${v.severity}`);
      lines.push(`- **Message:** ${v.message}`);
      lines.push(`- **Recommendation:** ${v.recommendation}`);
      lines.push(`- **Fix effort:** ${v.fixEffort}`);
      lines.push(``);
    }
    if (result.violations.length > 200) lines.push(`_... and ${result.violations.length - 200} more._`);
  } else {
    lines.push(`No violations detected.`);
  }
  return lines.join("\n");
}

export function toHtml(result: AuditResult): string {
  const rows = result.violations.slice(0, 500).map((v) => `
    <tr>
      <td class="sev sev-${v.severity}">${v.severity}</td>
      <td>${v.ruleId}<br><small>WCAG ${v.wcag} ${v.level}</small></td>
      <td><code>${escapeHtml(v.file)}:${v.line}</code></td>
      <td>${escapeHtml(v.message)}</td>
      <td>${escapeHtml(v.recommendation)}</td>
      <td>${v.fixEffort}</td>
    </tr>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>A11y Audit Report</title>
<style>
body{font-family:system-ui,sans-serif;max-width:1200px;margin:2rem auto;padding:0 1rem;color:#111}
h1{font-size:2rem}.summary{display:grid;grid-template-columns:repeat(5,1fr);gap:1rem;margin:2rem 0}
.card{border:1px solid #e5e7eb;border-radius:8px;padding:1rem}.card b{font-size:1.5rem;display:block}
table{width:100%;border-collapse:collapse;font-size:.9rem}th,td{border:1px solid #e5e7eb;padding:.5rem;text-align:left;vertical-align:top}
th{background:#f9fafb}.sev{font-weight:600;text-transform:capitalize}
.sev-critical{color:#991b1b}.sev-serious{color:#c2410c}.sev-moderate{color:#a16207}.sev-minor{color:#475569}
</style></head><body>
<h1>A11y Audit Report</h1>
<p>${result.timestamp} · ${result.filesScanned} files · ${result.rulesEvaluated} rules · ${result.durationMs} ms</p>
<div class="summary">
  <div class="card"><b>${result.summary.total}</b>Total</div>
  <div class="card"><b style="color:#991b1b">${result.summary.critical}</b>Critical</div>
  <div class="card"><b style="color:#c2410c">${result.summary.serious}</b>Serious</div>
  <div class="card"><b style="color:#a16207">${result.summary.moderate}</b>Moderate</div>
  <div class="card"><b style="color:#475569">${result.summary.minor}</b>Minor</div>
</div>
<table><thead><tr><th>Severity</th><th>Rule</th><th>File</th><th>Message</th><th>Recommendation</th><th>Effort</th></tr></thead>
<tbody>${rows}</tbody></table></body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
