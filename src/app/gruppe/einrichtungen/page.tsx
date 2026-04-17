import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resolveActiveGroup, currentMonth } from "../_lib/context";
import { snapshotsForGroup } from "@/lib/multi-tenant/seed";
import { FacilityTable } from "@/components/multi-tenant/FacilityTable";

export default async function FacilitiesPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const sp = (await searchParams) ?? {};
  const group = resolveActiveGroup(sp.gruppe);
  const month = currentMonth();
  const snaps = snapshotsForGroup(group, month);
  const snapMap = new Map(snaps.map((s) => [s.facilityId, s]));

  const rows = group.facilities.map((f) => {
    const s = snapMap.get(f.id)!;
    return { facility: f, snapshot: s };
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
      <header className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Einrichtungen</h1>
          <p className="mt-1 text-sm text-muted-foreground">Alle {group.facilities.length} Häuser der Gruppe mit Status, Belegung und letzter Prüfung.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{group.facilities.filter((f) => f.status === "active").length} aktiv</Badge>
          <Badge variant="warning">{group.facilities.filter((f) => f.status === "audit-review").length} im Audit</Badge>
          <Badge variant="outline">{group.facilities.filter((f) => f.status === "paused").length} pausiert</Badge>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Übersicht</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <FacilityTable rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
