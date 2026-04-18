/**
 * Admin-Inbox fuer alle Leads (Demo-Anfragen, Kontakt-Submissions, Downloads).
 * Konstantin sieht hier alle Anfragen — kein Mail-Versand noetig.
 */
import postgres from "postgres";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Lead {
  id: string;
  source: string;
  full_name: string | null;
  organization: string | null;
  role: string | null;
  email: string | null;
  phone: string | null;
  beds: number | null;
  message: string | null;
  locale: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

async function loadLeads(): Promise<Lead[]> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return [];
  const sql = postgres(dbUrl, { max: 1, prepare: false, idle_timeout: 5 });
  try {
    const rows = await sql<Lead[]>`
      SELECT id::text, source, full_name, organization, role, email, phone, beds, message,
             locale, status, notes, created_at::text, updated_at::text
      FROM leads
      ORDER BY created_at DESC
      LIMIT 200
    `;
    return rows;
  } catch {
    return [];
  } finally {
    await sql.end();
  }
}

const SOURCE_LABEL: Record<string, string> = {
  "demo-anfrage": "Demo-Anfrage",
  "kontakt": "Kontaktformular",
  "ressourcen-download": "Whitepaper-Download",
  "presse": "Presse-Kontakt",
  "partner": "Partner-Anfrage",
};

const STATUS_TONE: Record<string, string> = {
  neu: "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
  kontaktiert: "bg-sky-100 text-sky-900 dark:bg-sky-900/30 dark:text-sky-200",
  qualifiziert: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
  abgelehnt: "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-400",
  gewonnen: "bg-primary text-primary-foreground",
};

export default async function LeadsPage() {
  const leads = await loadLeads();
  const grouped = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Alle Demo-Anfragen, Kontakt-Submissions und Whitepaper-Downloads. Live aus der Datenbank.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {Object.entries(grouped).map(([status, count]) => (
            <span key={status} className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_TONE[status] ?? ""}`}>
              {status}: {count}
            </span>
          ))}
        </div>
      </header>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <h2 className="font-serif text-xl">Noch keine Leads</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sobald jemand das Demo-Formular unter <Link href="/demo-anfrage" className="text-primary hover:underline">/demo-anfrage</Link> ausfüllt,
            erscheint die Anfrage hier.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Quelle</th>
                <th className="px-3 py-2 font-medium">Name / Einrichtung</th>
                <th className="px-3 py-2 font-medium">Kontakt</th>
                <th className="px-3 py-2 font-medium">Nachricht</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Datum</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0 align-top">
                  <td className="px-3 py-3">
                    <span className="rounded bg-stone-100 px-2 py-0.5 text-xs dark:bg-stone-800">
                      {SOURCE_LABEL[l.source] ?? l.source}
                    </span>
                    {l.beds ? <div className="mt-1 text-xs text-muted-foreground">{l.beds} Betten</div> : null}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium">{l.full_name ?? "—"}</div>
                    {l.organization ? <div className="text-xs text-muted-foreground">{l.organization}</div> : null}
                    {l.role ? <div className="text-xs text-muted-foreground">{l.role}</div> : null}
                  </td>
                  <td className="px-3 py-3">
                    {l.email ? <div><a href={`mailto:${l.email}`} className="text-primary hover:underline">{l.email}</a></div> : null}
                    {l.phone ? <div className="text-xs text-muted-foreground"><a href={`tel:${l.phone}`}>{l.phone}</a></div> : null}
                  </td>
                  <td className="max-w-md px-3 py-3 text-muted-foreground">
                    {l.message ?? <span className="text-xs italic">keine Nachricht</span>}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_TONE[l.status] ?? ""}`}>{l.status}</span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(l.created_at).toLocaleString("de-AT", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-lg border border-border bg-muted/20 p-4 text-xs text-muted-foreground">
        <strong>Hinweis:</strong> Diese Liste ist die einzige Quelle für Lead-Anfragen.
        CareAI versendet KEINE E-Mails an externe Mail-Provider (kein Gmail, kein Viennamail).
        Optional: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID setzen, dann bekommst du Push-Benachrichtigungen
        bei jedem neuen Lead auf dein Handy.
      </div>
    </div>
  );
}
