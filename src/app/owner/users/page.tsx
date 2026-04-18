import { safeQuery } from "../_lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Row { id: string; email: string; full_name: string; role: string; tenant: string; created_at: string; verified: boolean }

async function load(): Promise<Row[]> {
  return safeQuery<Row[]>(async (sql) => sql<Row[]>`
    SELECT u.id::text, u.email, u.full_name, u.role::text as role, t.name as tenant,
           u.created_at::text, (u.email_verified IS NOT NULL) as verified
    FROM users u JOIN tenants t ON t.id = u.tenant_id
    ORDER BY u.created_at DESC
  `, []);
}

export default async function UsersPage() {
  const rows = await load();
  const byRole = rows.reduce<Record<string, number>>((a, r) => { a[r.role] = (a[r.role] ?? 0) + 1; return a; }, {});
  return (
    <div className="space-y-4 p-6 lg:p-10">
      <header className="flex items-end justify-between">
        <div><h1 className="font-serif text-3xl font-semibold tracking-tight">Alle Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quer über alle Mandanten ({rows.length} total).</p></div>
        <div className="flex gap-2 text-xs">{Object.entries(byRole).map(([k, v]) => <span key={k} className="rounded-full bg-stone-100 px-3 py-1 dark:bg-stone-800">{k}: {v}</span>)}</div>
      </header>
      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left">
            <tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Rolle</th><th className="px-3 py-2">Einrichtung</th><th className="px-3 py-2">Verified</th><th className="px-3 py-2">Erstellt</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium">{r.full_name}</td>
                <td className="px-3 py-2 text-xs">{r.email}</td>
                <td className="px-3 py-2"><span className={`rounded px-2 py-0.5 text-xs ${r.role === "owner" ? "bg-black text-white" : "bg-stone-100 dark:bg-stone-800"}`}>{r.role}</span></td>
                <td className="px-3 py-2 text-xs">{r.tenant}</td>
                <td className="px-3 py-2">{r.verified ? "✓" : "—"}</td>
                <td className="px-3 py-2 text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("de-AT")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
