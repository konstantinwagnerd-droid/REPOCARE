import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { computeControllingMetrics, BENCHMARKS_DACH } from "@/lib/controlling/metrics";

export const runtime = "nodejs";

function fmtEur(cents: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}
function fmtPct(v: number): string {
  return `${(v * 100).toFixed(1)} %`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user.role;
  if (role !== "admin" && role !== "pdl") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const m = await computeControllingMetrics(session.user.tenantId);
  const now = new Date();
  const monthName = now.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Monatsbericht Kosten-Controlling — ${monthName}</title>
<style>
  @page { size: A4; margin: 18mm; }
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #111; line-height: 1.5; }
  h1 { font-size: 24pt; margin: 0 0 6pt; }
  h2 { font-size: 14pt; margin: 18pt 0 8pt; border-bottom: 1px solid #ccc; padding-bottom: 4pt; }
  .sub { color: #666; margin-bottom: 18pt; }
  table { width: 100%; border-collapse: collapse; margin: 8pt 0; }
  th, td { text-align: left; padding: 6pt 8pt; border-bottom: 1px solid #eee; font-size: 10pt; }
  th { background: #f5f5f5; font-weight: 600; }
  .kpi-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10pt; margin: 10pt 0; }
  .kpi { border: 1px solid #e5e5e5; padding: 10pt; border-radius: 6pt; }
  .kpi-label { color: #666; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.5pt; }
  .kpi-value { font-size: 18pt; font-weight: 700; margin-top: 3pt; }
  .footer { margin-top: 24pt; font-size: 8pt; color: #666; border-top: 1px solid #ccc; padding-top: 8pt; }
  .print-hint { padding: 8pt; background: #fff3cd; border-radius: 4pt; margin-bottom: 16pt; font-size: 9pt; }
  @media print { .print-hint { display: none; } }
</style>
</head>
<body>
<div class="print-hint">Drucken mit Strg+P / ⌘+P → "Als PDF speichern" für Geschäftsleitung-tauglichen Bericht.</div>

<h1>Monatsbericht Kosten-Controlling</h1>
<div class="sub">${monthName} · erstellt am ${now.toLocaleDateString("de-DE")} · PDL-Dashboard</div>

<h2>Kennzahlen auf einen Blick</h2>
<div class="kpi-grid">
  <div class="kpi"><div class="kpi-label">Belegungsquote</div><div class="kpi-value">${fmtPct(m.belegungsquote)}</div><div>${m.aktiveBewohner} / ${m.maxKapazitaet} Plätze</div></div>
  <div class="kpi"><div class="kpi-label">Personalkosten</div><div class="kpi-value">${fmtEur(m.personalkostenMonatCents)}</div></div>
  <div class="kpi"><div class="kpi-label">Umsatz gesamt</div><div class="kpi-value">${fmtEur(m.umsatzGesamtMonatCents)}</div></div>
  <div class="kpi"><div class="kpi-label">Fix-Kosten</div><div class="kpi-value">${fmtEur(m.fixkostenMonatCents)}</div></div>
  <div class="kpi"><div class="kpi-label">Deckungsbeitrag</div><div class="kpi-value" style="color:${m.deckungsbeitragMonatCents >= 0 ? "#059669" : "#dc2626"}">${fmtEur(m.deckungsbeitragMonatCents)}</div></div>
  <div class="kpi"><div class="kpi-label">Überstunden-Quote</div><div class="kpi-value">${fmtPct(m.ueberstundenQuote)}</div></div>
</div>

<h2>Pflegegrad-Mix</h2>
<table>
  <thead><tr><th>Pflegegrad</th><th>Anzahl</th><th>% der Bewohner</th></tr></thead>
  <tbody>
    ${[1, 2, 3, 4, 5]
      .map((g) => {
        const c = m.pflegegradMix[g] ?? 0;
        const pct = m.aktiveBewohner > 0 ? (c / m.aktiveBewohner) * 100 : 0;
        return `<tr><td>PG ${g}</td><td>${c}</td><td>${pct.toFixed(1)} %</td></tr>`;
      })
      .join("")}
  </tbody>
</table>

<h2>Schicht-Abdeckung</h2>
<table>
  <thead><tr><th>Schicht</th><th>Ø Pflegekräfte</th></tr></thead>
  <tbody>
    <tr><td>Früh</td><td>${m.pflegekraefteProSchicht.frueh}</td></tr>
    <tr><td>Spät</td><td>${m.pflegekraefteProSchicht.spaet}</td></tr>
    <tr><td>Nacht</td><td>${m.pflegekraefteProSchicht.nacht}</td></tr>
  </tbody>
</table>
<p><strong>Bewohner pro Pflegekraft:</strong> ${m.bewohnerProPflegekraftRatio.toFixed(1)} (Bundesdurchschnitt: ${BENCHMARKS_DACH.bewohnerProPflegekraftTag.median})</p>

<h2>Benchmark vs. DACH-Durchschnitt</h2>
<table>
  <thead><tr><th>Kennzahl</th><th>Unser Wert</th><th>Median DACH</th><th>Top 25%</th></tr></thead>
  <tbody>
    <tr><td>Belegungsquote</td><td>${fmtPct(m.belegungsquote)}</td><td>${fmtPct(BENCHMARKS_DACH.belegungsquote.median)}</td><td>${fmtPct(BENCHMARKS_DACH.belegungsquote.top25)}</td></tr>
    <tr><td>Personalkosten/Bewohner</td><td>${fmtEur(m.personalkostenMonatCents / Math.max(m.aktiveBewohner, 1))}</td><td>${fmtEur(BENCHMARKS_DACH.personalkostenProBewohnerMonat.median)}</td><td>${fmtEur(BENCHMARKS_DACH.personalkostenProBewohnerMonat.top25)}</td></tr>
    <tr><td>Deckungsbeitrag/Bewohner</td><td>${fmtEur(m.deckungsbeitragMonatCents / Math.max(m.aktiveBewohner, 1))}</td><td>${fmtEur(BENCHMARKS_DACH.deckungsbeitragProBewohnerMonat.median)}</td><td>${fmtEur(BENCHMARKS_DACH.deckungsbeitragProBewohnerMonat.top25)}</td></tr>
    <tr><td>Überstunden-Quote</td><td>${fmtPct(m.ueberstundenQuote)}</td><td>${fmtPct(BENCHMARKS_DACH.ueberstundenQuote.median)}</td><td>${fmtPct(BENCHMARKS_DACH.ueberstundenQuote.top25)}</td></tr>
  </tbody>
</table>

<div class="footer">
  Quellen Benchmark: pflege.de 2025, Caritas Jahresbericht 2024, Destatis Pflegeheime 2023, Statistik Austria 2024.<br>
  CareAI Kosten-Controlling · automatisch erstellt · vertraulich · nur für interne Verwendung.
</div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="Monatsbericht-Controlling-${now.toISOString().slice(0, 7)}.html"`,
      "Cache-Control": "private, no-store",
    },
  });
}
