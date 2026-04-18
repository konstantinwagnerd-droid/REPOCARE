import { safeQuery } from "../_lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Table { table: string; rows: number }
async function load(): Promise<Table[]> {
  return safeQuery<Table[]>(async (sql) => {
    const tables = await sql<{ table_name: string }[]>`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `;
    const result: Table[] = [];
    for (const t of tables) {
      try {
        const c = (await sql.unsafe(`SELECT COUNT(*)::int as c FROM "${t.table_name}"`)) as unknown as Array<{ c: number }>;
        result.push({ table: t.table_name, rows: c[0]?.c ?? 0 });
      } catch {
        result.push({ table: t.table_name, rows: -1 });
      }
    }
    return result;
  }, []);
}

export default async function DatabasePage() {
  const rows = await load();
  return (
    <div className="space-y-4 p-6 lg:p-10">
      <header><h1 className="font-serif text-3xl font-semibold tracking-tight">Datenbank-Inspektor</h1>
      <p className="mt-1 text-sm text-muted-foreground">Read-only Übersicht aller Tabellen mit Zeilenanzahl.</p></header>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <div key={r.table} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
            <code className="text-sm">{r.table}</code>
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{r.rows >= 0 ? r.rows.toLocaleString("de-AT") : "—"}</span>
          </div>
        ))}
        {rows.length === 0 && <div className="col-span-full rounded-xl border border-dashed p-12 text-center text-muted-foreground">Datenbank nicht erreichbar oder leer. Erst /api/setup?token=... aufrufen.</div>}
      </div>
      <div className="rounded-lg border border-border bg-muted/20 p-4 text-xs text-muted-foreground">
        Für komplexere SQL-Queries direkt im Supabase SQL-Editor: <a href="https://supabase.com/dashboard/project/ppytkpauuitcfvfwrtvq/sql/new" target="_blank" rel="noopener" className="text-primary hover:underline">Supabase Editor öffnen</a>.
      </div>
    </div>
  );
}
