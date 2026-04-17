import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resolveActiveGroup } from "../_lib/context";

export default async function GroupSettingsPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const sp = (await searchParams) ?? {};
  const group = resolveActiveGroup(sp.gruppe);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Einstellungen</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gruppen-Profil, Rollen und Rollup-Regeln.</p>
      </header>

      <Card>
        <CardHeader><CardTitle className="font-serif">Gruppen-Profil</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Field label="Name" value={group.name} />
          <Field label="Slug" value={group.slug} />
          <Field label="Trägerart" value={group.traegerType} />
          <Field label="Gegründet" value={String(group.foundedYear)} />
          <Field label="Land" value={group.country} />
          <Field label="Einrichtungen" value={`${group.facilities.length}`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-serif">Rollen &amp; Zugriff</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">group_admin</div>
              <div className="text-xs text-muted-foreground">Vollzugriff auf Rollups, Vergleiche, Finanzen, Deep-Dives je Einrichtung</div>
            </div>
            <Badge variant="success">aktiv</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">group_viewer</div>
              <div className="text-xs text-muted-foreground">Nur-Lesen, keine Einzel-Einrichtungs-Financials</div>
            </div>
            <Badge variant="outline">optional</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-serif">DSGVO &amp; Datenminimierung</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Auf Gruppen-Ebene werden ausschließlich <strong>aggregierte KPIs</strong> verarbeitet. Einzel-Bewohner:innen-Daten verlassen nie den Scope der jeweiligen Einrichtung. Die Aggregation erfolgt on-demand, nicht persistent.</p>
          <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse des Trägerverbunds an Qualitätssicherung und Steuerung).</p>
          <p>Datenschutzfolgeabschätzung (DSFA) liegt dem Verbund vor — siehe <code className="rounded bg-muted px-1.5 py-0.5 text-xs">docs/MULTI-TENANT.md</code>.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
