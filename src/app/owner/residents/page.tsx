import { safeQuery } from "../_lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Row { id: string; full_name: string; pflegegrad: number | null; room: string | null; station: string | null; tenant: string; reports: number; admission_date: string | null }

async function load(): Promise<Row[]> {
  return safeQuery<Row[]>(async (sql) => sql<Row[]>`
    SELECT r.id::text, r.full_name, r.pflegegrad, r.room, r.station, t.name as tenant,
           (SELECT COUNT(*)::int FROM care_reports c WHERE c.resident_id = r.id) as reports,
           r.admission_date::text
    FROM residents r JOIN tenants t ON t.id = r.tenant_id
    WHERE r.deleted_at IS NULL ORDER BY r.full_name
  `, []);
}

export default async function ResidentsPage() {
  const rows = await load();
  return (
    <div className="space-y-4 p-6 lg:p-10">
      <header><h1 className="font-serif text-3xl font-semibold tracking-tight">Alle Bewohner:innen</h1>
      <p className="mt-1 text-sm text-muted-foreground">{rows.length} aktiv über alle Einrichtungen.</p></header>
      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left">
            <tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Einrichtung</th><th className="px-3 py-2">Station / Zimmer</th><th className="px-3 py-2">PG</th><th className="px-3 py-2">Berichte</th><th className="px-3 py-2">Aufnahme</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium">{r.full_name}</td>
                <td className="px-3 py-2 text-xs">{r.tenant}</td>
                <td className="px-3 py-2 text-xs">{r.station ?? "—"} / {r.room ?? "—"}</td>
                <td className="px-3 py-2"><span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">PG {r.pflegegrad ?? "?"}</span></td>
                <td className="px-3 py-2 text-center">{r.reports}</td>
                <td className="px-3 py-2 text-xs">{r.admission_date ? new Date(r.admission_date).toLocaleDateString("de-AT") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
