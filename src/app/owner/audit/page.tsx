import { safeQuery } from "../_lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Row { id: string; tenant: string; user_email: string | null; entity_type: string; action: string; created_at: string; ip: string | null }

async function load(): Promise<Row[]> {
  return safeQuery<Row[]>(async (sql) => sql<Row[]>`
    SELECT a.id::text, t.name as tenant, u.email as user_email,
           a.entity_type, a.action, a.created_at::text, a.ip
    FROM audit_log a JOIN tenants t ON t.id = a.tenant_id
    LEFT JOIN users u ON u.id = a.user_id
    ORDER BY a.created_at DESC LIMIT 500
  `, []);
}

const tone = (a: string) => a === "delete" ? "text-rose-600 dark:text-rose-300" : a === "update" ? "text-amber-600 dark:text-amber-300" : a === "login" ? "text-sky-600 dark:text-sky-300" : "text-muted-foreground";

export default async function AuditPage() {
  const rows = await load();
  return (
    <div className="space-y-4 p-6 lg:p-10">
      <header><h1 className="font-serif text-3xl font-semibold tracking-tight">Audit-Log (global)</h1>
      <p className="mt-1 text-sm text-muted-foreground">Letzte 500 Events über alle Mandanten.</p></header>
      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left">
            <tr><th className="px-3 py-2">Zeit</th><th className="px-3 py-2">Einrichtung</th><th className="px-3 py-2">User</th><th className="px-3 py-2">Aktion</th><th className="px-3 py-2">Entität</th><th className="px-3 py-2">IP</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2 text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleString("de-AT")}</td>
                <td className="px-3 py-2 text-xs">{r.tenant}</td>
                <td className="px-3 py-2 text-xs">{r.user_email ?? "system"}</td>
                <td className={`px-3 py-2 text-xs font-medium ${tone(r.action)}`}>{r.action}</td>
                <td className="px-3 py-2 text-xs">{r.entity_type}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{r.ip ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
