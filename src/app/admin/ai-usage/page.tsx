/**
 * /admin/ai-usage — LLM-Usage-Dashboard.
 *
 * Zeigt:
 * - Monats-Budget-Gauge (verbraucht / EUR)
 * - Pro Request-Typ: Anzahl, Ø Tokens, Ø Kosten
 * - Tabs "Failed" und "Top-Costly-Users"
 */
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const metadata = { title: "AI-Usage · CareAI" };
export const dynamic = "force-dynamic";

type UsageRow = {
  request_type: string;
  model: string;
  count: number;
  avg_tokens: number;
  avg_cost_cents: number;
  total_cost_cents: number;
};

type FailedRow = { request_type: string; error_message: string | null; created_at: Date; model: string };
type UserRow = { user_id: string | null; total_cents: number; count: number };

async function fetchUsageData() {
  const budgetEur = parseFloat(process.env.LLM_COST_BUDGET_EUR_PER_MONTH ?? "500");
  try {
    const spentRes = await db.execute(sql`
      SELECT COALESCE(SUM(cost_eur_cents), 0) AS spent_cents
      FROM billing_llm_usage
      WHERE created_at >= date_trunc('month', now())
        AND status IN ('success','cached')
    `);
    // drizzle postgres returns { rows } or array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows0 = (Array.isArray(spentRes) ? spentRes : (spentRes as any).rows ?? []) as Array<{ spent_cents?: number | string }>;
    const spentCents = Number(rows0[0]?.spent_cents ?? 0);

    const byTypeRes = await db.execute(sql`
      SELECT request_type, model,
             COUNT(*)::int AS count,
             AVG(prompt_tokens + completion_tokens)::int AS avg_tokens,
             AVG(cost_eur_cents)::int AS avg_cost_cents,
             SUM(cost_eur_cents)::int AS total_cost_cents
      FROM billing_llm_usage
      WHERE created_at >= date_trunc('month', now())
      GROUP BY request_type, model
      ORDER BY total_cost_cents DESC NULLS LAST
    `);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const byType = (Array.isArray(byTypeRes) ? byTypeRes : (byTypeRes as any).rows ?? []) as UsageRow[];

    const failedRes = await db.execute(sql`
      SELECT request_type, error_message, created_at, model
      FROM billing_llm_usage
      WHERE status = 'error'
        AND created_at >= date_trunc('month', now())
      ORDER BY created_at DESC
      LIMIT 50
    `);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const failed = (Array.isArray(failedRes) ? failedRes : (failedRes as any).rows ?? []) as FailedRow[];

    const byUserRes = await db.execute(sql`
      SELECT user_id::text AS user_id,
             SUM(cost_eur_cents)::int AS total_cents,
             COUNT(*)::int AS count
      FROM billing_llm_usage
      WHERE created_at >= date_trunc('month', now())
        AND user_id IS NOT NULL
      GROUP BY user_id
      ORDER BY total_cents DESC
      LIMIT 10
    `);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const byUser = (Array.isArray(byUserRes) ? byUserRes : (byUserRes as any).rows ?? []) as UserRow[];

    return { budgetEur, spentEur: spentCents / 100, byType, failed, byUser, error: null };
  } catch (e) {
    return { budgetEur, spentEur: 0, byType: [] as UsageRow[], failed: [] as FailedRow[], byUser: [] as UserRow[], error: String(e) };
  }
}

export default async function AiUsagePage() {
  const { budgetEur, spentEur, byType, failed, byUser, error } = await fetchUsageData();
  const pct = budgetEur > 0 ? Math.min(100, (spentEur / budgetEur) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">KI-Nutzung &amp; Kosten</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Claude 4.7 / LLM-Nutzung dieser Einrichtung. Monatsbudget: {budgetEur.toFixed(2)} EUR.
        </p>
      </header>

      {error ? (
        <Card>
          <CardContent className="p-6 text-sm text-amber-700">
            Tabelle <code>billing_llm_usage</code> noch nicht vorhanden oder Fehler: {error}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader><CardTitle>Monatsbudget</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{spentEur.toFixed(2)} EUR verbraucht</span>
            <span className="text-muted-foreground">{budgetEur.toFixed(2)} EUR Budget · {pct.toFixed(0)}%</span>
          </div>
          <Progress value={pct} />
          {pct > 80 ? (
            <div className="text-sm text-rose-700">Warnung: &gt;80 % des Monatsbudgets aufgebraucht.</div>
          ) : null}
        </CardContent>
      </Card>

      <Tabs defaultValue="by-type">
        <TabsList>
          <TabsTrigger value="by-type">Pro Request-Typ</TabsTrigger>
          <TabsTrigger value="failed">Fehlgeschlagen ({failed.length})</TabsTrigger>
          <TabsTrigger value="by-user">Top-Users</TabsTrigger>
        </TabsList>
        <TabsContent value="by-type">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">Request-Typ</th>
                    <th className="p-3 text-left">Modell</th>
                    <th className="p-3 text-right">Anzahl</th>
                    <th className="p-3 text-right">Ø Tokens</th>
                    <th className="p-3 text-right">Ø Kosten</th>
                    <th className="p-3 text-right">Summe</th>
                  </tr>
                </thead>
                <tbody>
                  {byType.length === 0 ? (
                    <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Noch keine Daten diesen Monat.</td></tr>
                  ) : byType.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3 font-mono">{r.request_type}</td>
                      <td className="p-3 text-xs text-muted-foreground">{r.model}</td>
                      <td className="p-3 text-right">{Number(r.count).toLocaleString()}</td>
                      <td className="p-3 text-right">{Number(r.avg_tokens).toLocaleString()}</td>
                      <td className="p-3 text-right">{(Number(r.avg_cost_cents) / 100).toFixed(4)} €</td>
                      <td className="p-3 text-right font-medium">{(Number(r.total_cost_cents) / 100).toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="failed">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">Zeit</th>
                    <th className="p-3 text-left">Typ</th>
                    <th className="p-3 text-left">Modell</th>
                    <th className="p-3 text-left">Fehler</th>
                  </tr>
                </thead>
                <tbody>
                  {failed.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Keine Fehler diesen Monat.</td></tr>
                  ) : failed.map((f, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3 text-xs text-muted-foreground">{new Date(f.created_at).toLocaleString("de-AT")}</td>
                      <td className="p-3 font-mono">{f.request_type}</td>
                      <td className="p-3 text-xs">{f.model}</td>
                      <td className="p-3 text-xs">{f.error_message ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="by-user">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">User-ID</th>
                    <th className="p-3 text-right">Requests</th>
                    <th className="p-3 text-right">Kosten</th>
                  </tr>
                </thead>
                <tbody>
                  {byUser.length === 0 ? (
                    <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">Keine Daten.</td></tr>
                  ) : byUser.map((u, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3 font-mono text-xs">{u.user_id}</td>
                      <td className="p-3 text-right">{Number(u.count).toLocaleString()}</td>
                      <td className="p-3 text-right font-medium">{(Number(u.total_cents) / 100).toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground">
        Ambitioniertes Monats-Budget via <code>LLM_COST_BUDGET_EUR_PER_MONTH</code>. Bei Überschreitung werden neue Requests blockiert (budget-exceeded).
      </p>
      <Badge variant="outline">Modell: Claude-4-7-Sonnet · Prompt-Caching aktiv</Badge>
    </div>
  );
}
