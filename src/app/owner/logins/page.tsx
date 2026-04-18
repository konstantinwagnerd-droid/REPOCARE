import { safeQuery } from "../_lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Row { id: string; email: string; full_name: string; role: string; tenant: string; ip: string | null; user_agent: string | null; created_at: string }

async function load(): Promise<Row[]> {
  return safeQuery<Row[]>(async (sql) => sql<Row[]>`
    SELECT a.id::text, u.email, u.full_name, u.role::text as role, t.name as tenant, a.ip, a.user_agent, a.created_at::text
    FROM audit_log a JOIN users u ON u.id = a.user_id JOIN tenants t ON t.id = u.tenant_id
    WHERE a.action = 'login'
    ORDER BY a.created_at DESC LIMIT 200
  `, []);
}

export default async function LoginsPage() {
  const rows = await load();
  return (
    <div className="space-y-4 p-6 lg:p-10">
      <header><h1 className="font-serif text-3xl font-semibold tracking-tight">Login-Historie</h1>
      <p className="mt-1 text-sm text-muted-foreground">Letzte 200 Login-Events. Demo-Accounts gelb markiert.</p></header>
      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left">
            <tr><th className="px-3 py-2">Zeit</th><th className="px-3 py-2">User</th><th className="px-3 py-2">Rolle</th><th className="px-3 py-2">Einrichtung</th><th className="px-3 py-2">IP</th><th className="px-3 py-2">User-Agent</th><th className="px-3 py-2">Typ</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={`border-b border-border last:border-0 ${r.email.endsWith("@careai.demo") ? "bg-amber-50/50 dark:bg-amber-950/20" : ""}`}>
                <td className="px-3 py-2 text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleString("de-AT")}</td>
                <td className="px-3 py-2"><div className="font-medium">{r.full_name}</div><div className="text-xs text-muted-foreground">{r.email}</div></td>
                <td className="px-3 py-2 text-xs">{r.role}</td>
                <td className="px-3 py-2 text-xs">{r.tenant}</td>
                <td className="px-3 py-2 text-xs">{r.ip ?? "—"}</td>
                <td className="px-3 py-2 text-xs max-w-xs truncate text-muted-foreground">{r.user_agent ?? "—"}</td>
                <td className="px-3 py-2 text-xs">{r.email.endsWith("@careai.demo") ? "DEMO" : "REAL"}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">Noch keine Logins.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
