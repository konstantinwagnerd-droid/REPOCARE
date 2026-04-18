import { safeQuery } from "../_lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Row { id: string; kind: string; filename: string; tenant: string; user_email: string | null; created_at: string }

async function load(): Promise<Row[]> {
  return safeQuery<Row[]>(async (sql) => sql<Row[]>`
    SELECT e.id::text, e.kind, e.filename, t.name as tenant, u.email as user_email, e.created_at::text
    FROM export_records e JOIN tenants t ON t.id = e.tenant_id
    LEFT JOIN users u ON u.id = e.user_id
    ORDER BY e.created_at DESC LIMIT 200
  `, []);
}

export default async function FilesPage() {
  const rows = await load();
  return (
    <div className="space-y-4 p-6 lg:p-10">
      <header><h1 className="font-serif text-3xl font-semibold tracking-tight">Dateien & Exports</h1>
      <p className="mt-1 text-sm text-muted-foreground">Letzte 200 generierte PDFs / ZIPs / Reports über alle Mandanten.</p></header>
      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left">
            <tr><th className="px-3 py-2">Zeit</th><th className="px-3 py-2">Typ</th><th className="px-3 py-2">Datei</th><th className="px-3 py-2">Einrichtung</th><th className="px-3 py-2">User</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">Noch keine Exports.</td></tr> : rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2 text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleString("de-AT")}</td>
                <td className="px-3 py-2"><span className="rounded bg-stone-100 px-2 py-0.5 text-xs dark:bg-stone-800">{r.kind}</span></td>
                <td className="px-3 py-2 font-mono text-xs">{r.filename}</td>
                <td className="px-3 py-2 text-xs">{r.tenant}</td>
                <td className="px-3 py-2 text-xs">{r.user_email ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
