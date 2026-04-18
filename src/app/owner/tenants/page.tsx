import { safeQuery } from "../_lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Row { id: string; name: string; address: string | null; plan: string; users: number; residents: number; created_at: string; last_activity: string | null }

async function load(): Promise<Row[]> {
  return safeQuery<Row[]>(async (sql) => sql<Row[]>`
    SELECT t.id::text, t.name, t.address, t.plan::text as plan, t.created_at::text,
           (SELECT COUNT(*)::int FROM users u WHERE u.tenant_id = t.id) as users,
           (SELECT COUNT(*)::int FROM residents r WHERE r.tenant_id = t.id AND r.deleted_at IS NULL) as residents,
           (SELECT MAX(created_at)::text FROM audit_log a WHERE a.tenant_id = t.id) as last_activity
    FROM tenants t ORDER BY t.created_at DESC
  `, []);
}

export default async function TenantsPage() {
  const rows = await load();
  return (
    <div className="space-y-4 p-6 lg:p-10">
      <header><h1 className="font-serif text-3xl font-semibold tracking-tight">Alle Einrichtungen</h1></header>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-background p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-serif text-lg font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.address ?? "—"}</div>
              </div>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">{r.plan}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div><div className="text-xs text-muted-foreground">Users</div><div className="font-medium">{r.users}</div></div>
              <div><div className="text-xs text-muted-foreground">Bewohner:innen</div><div className="font-medium">{r.residents}</div></div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Letzte Aktivität: {r.last_activity ? new Date(r.last_activity).toLocaleString("de-AT") : "—"}
            </div>
          </div>
        ))}
        {rows.length === 0 && <div className="col-span-full rounded-xl border border-dashed p-12 text-center text-muted-foreground">Noch keine Einrichtungen.</div>}
      </div>
    </div>
  );
}
