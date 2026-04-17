"use client";

interface Row { id: string; name: string; city: string; revenue: number; cost: number; ebitda: number; }
const fmt = (n: number) => new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function FinancialsTable({ rows }: { rows: Row[] }) {
  const exportCsv = () => {
    const lines = ["Einrichtung;Stadt;Umsatz;Kosten;EBITDA;EBITDA-Marge%"];
    for (const r of rows) {
      const marge = r.revenue > 0 ? ((r.ebitda / r.revenue) * 100).toFixed(1) : "0";
      lines.push([r.name, r.city, r.revenue, r.cost, r.ebitda, marge].join(";"));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "finanzen-gruppe.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-end border-b border-border p-3">
        <button onClick={exportCsv} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-secondary">CSV exportieren</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Einrichtung</th>
              <th className="px-4 py-3 text-right">Umsatz</th>
              <th className="px-4 py-3 text-right">Kosten</th>
              <th className="px-4 py-3 text-right">EBITDA</th>
              <th className="px-4 py-3 text-right">Marge</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const marge = r.revenue > 0 ? (r.ebitda / r.revenue) * 100 : 0;
              return (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{r.name}<div className="text-[11px] text-muted-foreground">{r.city}</div></td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmt(r.revenue)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmt(r.cost)}</td>
                  <td className={`px-4 py-3 text-right tabular-nums ${r.ebitda >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{fmt(r.ebitda)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{marge.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
