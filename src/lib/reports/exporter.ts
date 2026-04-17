import type { Dashboard } from "./types";
import { getProvider } from "./data-providers";

/**
 * Minimal dependency-free HTML → printable template for a dashboard.
 * The browser renders this as PDF via window.print() or via the print API route.
 */
export function renderDashboardHtml(dashboard: Dashboard): string {
  const rows = dashboard.widgets
    .map((w) => {
      const provider = getProvider(w.providerId);
      const data = provider?.getData(w.config.timeframe);
      const value = data ? `${data.current}${data.unit ?? ""}` : "—";
      const delta = data?.delta ?? 0;
      const deltaClass = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
      return `
        <div class="widget">
          <div class="label">${escape(w.title)}</div>
          <div class="value">${escape(String(value))}</div>
          <div class="delta ${deltaClass}">${delta > 0 ? "+" : ""}${delta}</div>
          <div class="sub">${escape(provider?.label ?? "")}</div>
        </div>`;
    })
    .join("");
  return `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><title>${escape(dashboard.name)}</title>
<style>
  @page { size: A3 landscape; margin: 12mm; }
  body { font-family: 'Geist', sans-serif; color: #0c1524; }
  h1 { font-family: 'Fraunces', serif; font-size: 28pt; margin: 0 0 4pt; }
  .meta { color: #667; font-size: 10pt; margin-bottom: 16pt; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10pt; }
  .widget { border: 1px solid #dde; border-radius: 10pt; padding: 10pt 14pt; background: #fff; }
  .label { font-size: 9pt; text-transform: uppercase; letter-spacing: .08em; color: #667; }
  .value { font-family: 'Fraunces', serif; font-size: 26pt; font-weight: 600; margin-top: 4pt; }
  .delta { font-size: 10pt; font-weight: 600; }
  .delta.up { color: #0a7a3c; }
  .delta.down { color: #b8152e; }
  .delta.flat { color: #667; }
  .sub { font-size: 9pt; color: #667; margin-top: 2pt; }
  footer { margin-top: 20pt; font-size: 9pt; color: #667; text-align: right; }
</style></head><body>
<h1>${escape(dashboard.name)}</h1>
<div class="meta">${escape(dashboard.description ?? "")} · Exportiert ${new Date().toLocaleString("de-AT")}</div>
<div class="grid">${rows}</div>
<footer>CareAI Dashboard Export · Tenant ${escape(dashboard.tenantId)}</footer>
</body></html>`;
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
