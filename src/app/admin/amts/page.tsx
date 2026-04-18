/**
 * /admin/amts — Einrichtungsweite AMTS-Übersicht.
 *
 * Zeigt:
 * - Top-10 Bewohner mit höchstem AMTS-Risiko
 * - Monatsbericht Abweichungen (für QM)
 */
import Link from "next/link";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "AMTS-Übersicht · CareAI" };
export const dynamic = "force-dynamic";

type TopRow = { resident_id: string; full_name: string; total_flags: number; high_count: number; priscus_count: number; forta_d_count: number; interaction_hoch_count: number };
type MonthRow = { flag_type: string; severity: string; count: number };

async function fetchAmtsData() {
  try {
    const topRes = await db.execute(sql`
      SELECT r.id::text AS resident_id, r.full_name,
             COUNT(*)::int AS total_flags,
             COUNT(*) FILTER (WHERE f.severity = 'hoch')::int AS high_count,
             COUNT(*) FILTER (WHERE f.flag_type = 'priscus')::int AS priscus_count,
             COUNT(*) FILTER (WHERE f.flag_type = 'forta-d')::int AS forta_d_count,
             COUNT(*) FILTER (WHERE f.flag_type = 'interaction' AND f.severity = 'hoch')::int AS interaction_hoch_count
      FROM amts_flags f
      JOIN residents r ON r.id = f.resident_id
      WHERE f.acknowledged_at IS NULL
      GROUP BY r.id, r.full_name
      ORDER BY high_count DESC, total_flags DESC
      LIMIT 10
    `);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const top = (Array.isArray(topRes) ? topRes : (topRes as any).rows ?? []) as TopRow[];

    const monthRes = await db.execute(sql`
      SELECT flag_type, severity, COUNT(*)::int AS count
      FROM amts_flags
      WHERE created_at >= date_trunc('month', now())
      GROUP BY flag_type, severity
      ORDER BY count DESC
    `);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const month = (Array.isArray(monthRes) ? monthRes : (monthRes as any).rows ?? []) as MonthRow[];

    return { top, month, error: null };
  } catch (e) {
    return { top: [] as TopRow[], month: [] as MonthRow[], error: String(e) };
  }
}

function severityBadge(sev: string) {
  const cls = sev === "hoch" ? "bg-rose-100 text-rose-900" : sev === "mittel" ? "bg-amber-100 text-amber-900" : "bg-stone-100 text-stone-800";
  return <Badge className={cls}>{sev}</Badge>;
}

export default async function AmtsAdminPage() {
  const { top, month, error } = await fetchAmtsData();

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">AMTS-Übersicht</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Arzneimittel-Therapie-Sicherheit. Quellen: PRISCUS 2.0, FORTA 2023, ABDA, Beers 2023.
        </p>
      </header>

      {error ? (
        <Card>
          <CardContent className="p-6 text-sm text-amber-700">
            Tabelle <code>amts_flags</code> noch nicht vorhanden oder Fehler: {error}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader><CardTitle>Top-10 Bewohner mit AMTS-Risiko</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left">Bewohner</th>
                <th className="p-3 text-right">Gesamt</th>
                <th className="p-3 text-right">Hoch</th>
                <th className="p-3 text-right">PRISCUS</th>
                <th className="p-3 text-right">FORTA-D</th>
                <th className="p-3 text-right">Interaktion hoch</th>
                <th className="p-3 text-left">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {top.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Noch keine AMTS-Flags.</td></tr>
              ) : top.map((r) => (
                <tr key={r.resident_id} className="border-t">
                  <td className="p-3 font-medium">{r.full_name}</td>
                  <td className="p-3 text-right">{r.total_flags}</td>
                  <td className="p-3 text-right">
                    {r.high_count > 0 ? <Badge className="bg-rose-100 text-rose-900">{r.high_count}</Badge> : r.high_count}
                  </td>
                  <td className="p-3 text-right">{r.priscus_count}</td>
                  <td className="p-3 text-right">{r.forta_d_count}</td>
                  <td className="p-3 text-right">{r.interaction_hoch_count}</td>
                  <td className="p-3">
                    <Link href={`/app/residents/${r.resident_id}`} className="text-sm text-primary hover:underline">Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Monatsbericht — AMTS-Abweichungen</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left">Flag-Typ</th>
                <th className="p-3 text-left">Schweregrad</th>
                <th className="p-3 text-right">Anzahl</th>
              </tr>
            </thead>
            <tbody>
              {month.length === 0 ? (
                <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">Keine Daten diesen Monat.</td></tr>
              ) : month.map((m, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3 font-mono">{m.flag_type}</td>
                  <td className="p-3">{severityBadge(m.severity)}</td>
                  <td className="p-3 text-right">{Number(m.count).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="flex gap-2 flex-wrap text-xs">
        <Badge variant="outline">PRISCUS 2.0 (DE, 2023)</Badge>
        <Badge variant="outline">FORTA 2023</Badge>
        <Badge variant="outline">ABDA-Interaktionen</Badge>
        <Badge variant="outline">Beers Criteria 2023 (AGS)</Badge>
      </div>
    </div>
  );
}
