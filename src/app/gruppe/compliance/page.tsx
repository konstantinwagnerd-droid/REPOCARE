import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, FileWarning, Scale } from "lucide-react";
import { resolveActiveGroup, currentMonth } from "../_lib/context";
import { snapshotsForGroup } from "@/lib/multi-tenant/seed";

export default async function ComplianceRollup({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const sp = (await searchParams) ?? {};
  const group = resolveActiveGroup(sp.gruppe);
  const month = currentMonth();
  const snaps = snapshotsForGroup(group, month);
  const snapMap = new Map(snaps.map((s) => [s.facilityId, s]));

  const totalOpen = snaps.reduce((s, x) => s + x.mdCheckOpenFindings, 0);
  const totalDsgvo = snaps.reduce((s, x) => s + x.dsgvoRequestsOpen, 0);
  const avgCompliance = snaps.reduce((s, x) => s + x.complianceQuotePct, 0) / snaps.length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Compliance-Rollup</h1>
        <p className="mt-1 text-sm text-muted-foreground">MD-Prüfstände, offene Befunde und DSGVO-Löschanfragen über die gesamte Gruppe.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><ShieldCheck className="h-5 w-5" /></span>
            <div>
              <div className="text-2xl font-semibold">{avgCompliance.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Ø Compliance-Quote</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><FileWarning className="h-5 w-5" /></span>
            <div>
              <div className="text-2xl font-semibold">{totalOpen}</div>
              <div className="text-xs text-muted-foreground">Offene MD-Befunde</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><Scale className="h-5 w-5" /></span>
            <div>
              <div className="text-2xl font-semibold">{totalDsgvo}</div>
              <div className="text-xs text-muted-foreground">Offene DSGVO-Anfragen</div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader><CardTitle className="font-serif">Compliance pro Einrichtung</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Einrichtung</th>
                  <th className="px-4 py-3">Letzter Audit</th>
                  <th className="px-4 py-3">Compliance-Quote</th>
                  <th className="px-4 py-3 text-right">Offene MD-Befunde</th>
                  <th className="px-4 py-3 text-right">DSGVO offen</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {group.facilities.map((f) => {
                  const s = snapMap.get(f.id)!;
                  return (
                    <tr key={f.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{f.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{f.lastAuditAt ?? "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={s.complianceQuotePct} className="h-2 w-40" />
                          <span className="text-xs tabular-nums text-muted-foreground">{s.complianceQuotePct.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{s.mdCheckOpenFindings}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{s.dsgvoRequestsOpen}</td>
                      <td className="px-4 py-3">
                        {s.complianceQuotePct >= 92 ? <Badge variant="success">stark</Badge>
                          : s.complianceQuotePct >= 82 ? <Badge variant="warning">mittel</Badge>
                          : <Badge variant="danger">handeln</Badge>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
