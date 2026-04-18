import { safeQuery } from "../_lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Lead {
  id: string; source: string; full_name: string | null; organization: string | null;
  role: string | null; email: string | null; phone: string | null; beds: number | null;
  message: string | null; locale: string | null; status: string;
  created_at: string; updated_at: string;
}

async function load(): Promise<Lead[]> {
  return safeQuery<Lead[]>(async (sql) => sql<Lead[]>`
    SELECT id::text, source, full_name, organization, role, email, phone, beds, message,
           locale, status, created_at::text, updated_at::text
    FROM leads ORDER BY created_at DESC LIMIT 500
  `, []);
}

const TONE: Record<string, string> = {
  neu: "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
  kontaktiert: "bg-sky-100 text-sky-900 dark:bg-sky-900/30 dark:text-sky-200",
  qualifiziert: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
  gewonnen: "bg-primary text-primary-foreground",
};

export default async function OwnerLeadsPage() {
  const rows = await load();
  const grouped = rows.reduce<Record<string, number>>((a, r) => { a[r.status] = (a[r.status] ?? 0) + 1; return a; }, {});
  return (
    <div className="space-y-4 p-6 lg:p-10">
      <header className="flex items-end justify-between">
        <div><h1 className="font-serif text-3xl font-semibold tracking-tight">Leads & Demo-Anfragen</h1>
        <p className="mt-1 text-sm text-muted-foreground">Inkl. ungefiltert Quelle: demo-anfrage / kontakt / presse / partner.</p></div>
        <div className="flex gap-2 text-xs">{Object.entries(grouped).map(([k, v]) => <span key={k} className={`rounded-full px-3 py-1 ${TONE[k] ?? ""}`}>{k}: {v}</span>)}</div>
      </header>
      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left">
            <tr><th className="px-3 py-2">Quelle</th><th className="px-3 py-2">Name / Einrichtung</th><th className="px-3 py-2">Kontakt</th><th className="px-3 py-2">Nachricht</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Datum</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (<tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">Noch keine Anfragen. Sobald jemand /demo-anfrage ausfüllt erscheinen sie hier.</td></tr>) : rows.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0 align-top">
                <td className="px-3 py-3"><span className="rounded bg-stone-100 px-2 py-0.5 text-xs dark:bg-stone-800">{l.source}</span></td>
                <td className="px-3 py-3"><div className="font-medium">{l.full_name ?? "—"}</div>{l.organization && <div className="text-xs text-muted-foreground">{l.organization}</div>}{l.beds && <div className="text-xs text-muted-foreground">{l.beds} Betten</div>}</td>
                <td className="px-3 py-3 text-xs">{l.email && <div><a href={`mailto:${l.email}`} className="text-primary hover:underline">{l.email}</a></div>}{l.phone && <div className="text-muted-foreground"><a href={`tel:${l.phone}`}>{l.phone}</a></div>}</td>
                <td className="max-w-md px-3 py-3 text-muted-foreground">{l.message ?? <span className="text-xs italic">—</span>}</td>
                <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${TONE[l.status] ?? ""}`}>{l.status}</span></td>
                <td className="px-3 py-3 text-xs whitespace-nowrap">{new Date(l.created_at).toLocaleString("de-AT")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
