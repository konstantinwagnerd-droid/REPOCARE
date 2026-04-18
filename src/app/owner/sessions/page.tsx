import { safeQuery } from "../_lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Row {
  user_id: string; email: string; full_name: string; role: string;
  tenant_name: string; last_action: string; ip: string | null; user_agent: string | null;
  events_last_hour: number;
}

async function load(): Promise<Row[]> {
  return safeQuery<Row[]>(async (sql) => {
    return sql<Row[]>`
      SELECT a.user_id::text, u.email, u.full_name, u.role::text, t.name as tenant_name,
             MAX(a.created_at)::text as last_action, MAX(a.ip) as ip, MAX(a.user_agent) as user_agent,
             COUNT(*)::int as events_last_hour
      FROM audit_log a
      JOIN users u ON u.id = a.user_id
      JOIN tenants t ON t.id = u.tenant_id
      WHERE a.created_at >= NOW() - INTERVAL '1 hour'
      GROUP BY a.user_id, u.email, u.full_name, u.role, t.name
      ORDER BY MAX(a.created_at) DESC
      LIMIT 100
    `;
  }, []);
}

const isDemoEmail = (e: string) => e.endsWith("@careai.demo");

export default async function SessionsPage() {
  const rows = await load();
  return (
    <div className="space-y-4 p-6 lg:p-10">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Live-Sessions</h1>
        <p className="mt-1 text-sm text-muted-foreground">User mit Aktivität in den letzten 60 Minuten.</p>
      </header>
      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">User</th>
              <th className="px-3 py-2 font-medium">Rolle</th>
              <th className="px-3 py-2 font-medium">Einrichtung</th>
              <th className="px-3 py-2 font-medium">IP / UA</th>
              <th className="px-3 py-2 font-medium">Letzte Aktion</th>
              <th className="px-3 py-2 font-medium">Events 1h</th>
              <th className="px-3 py-2 font-medium">Typ</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">Keine aktive Session.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.user_id} className="border-b border-border last:border-0">
                <td className="px-3 py-2"><div className="font-medium">{r.full_name}</div><div className="text-xs text-muted-foreground">{r.email}</div></td>
                <td className="px-3 py-2"><span className="rounded bg-stone-100 px-2 py-0.5 text-xs dark:bg-stone-800">{r.role}</span></td>
                <td className="px-3 py-2 text-xs">{r.tenant_name}</td>
                <td className="px-3 py-2 text-xs"><div>{r.ip ?? "—"}</div><div className="max-w-xs truncate text-muted-foreground">{r.user_agent ?? "—"}</div></td>
                <td className="px-3 py-2 text-xs whitespace-nowrap">{new Date(r.last_action).toLocaleString("de-AT")}</td>
                <td className="px-3 py-2 text-center">{r.events_last_hour}</td>
                <td className="px-3 py-2">
                  {isDemoEmail(r.email)
                    ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">DEMO</span>
                    : <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200">REAL</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
