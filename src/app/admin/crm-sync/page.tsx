import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, CloudUpload, CloudDownload, Activity } from "lucide-react";

export const metadata = { title: "CRM-Sync" };

const providers = [
  { name: "Mock", id: "mock", desc: "In-Memory (Default, Entwicklung)", status: "active" },
  { name: "Salesforce", id: "salesforce", desc: "SOQL + REST via jsforce — OAuth/Session", status: "configure" },
  { name: "HubSpot", id: "hubspot", desc: "REST v3 mit Private-App-Token", status: "configure" },
];

export default function CrmSyncPage() {
  return (
    <div className="container py-10">
      <Badge variant="outline" className="mb-2">Integration</Badge>
      <h1 className="font-serif text-3xl font-semibold">CRM-Sync</h1>
      <p className="mt-1 text-muted-foreground">Bidirektionale Synchronisation zwischen CareAI-Leads und Salesforce / HubSpot.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {providers.map((p) => (
          <Card key={p.id}><CardContent className="p-5">
            <Database className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-semibold">{p.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <Badge variant={p.status === "active" ? "default" : "outline"} className="mt-3">{p.status === "active" ? "Aktiv" : "Konfiguration erforderlich"}</Badge>
          </CardContent></Card>
        ))}
      </div>

      <h2 className="mt-10 font-serif text-xl font-semibold">Aktionen</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5">
          <CloudUpload className="h-5 w-5 text-primary" />
          <h3 className="mt-3 font-semibold">Push</h3>
          <p className="mt-1 text-sm text-muted-foreground">CareAI → CRM. Endpoint: <code>POST /api/crm-sync/push</code></p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <CloudDownload className="h-5 w-5 text-primary" />
          <h3 className="mt-3 font-semibold">Pull</h3>
          <p className="mt-1 text-sm text-muted-foreground">CRM → CareAI. Endpoint: <code>POST /api/crm-sync/pull</code></p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="mt-3 font-semibold">Status</h3>
          <p className="mt-1 text-sm text-muted-foreground">Health-Check. <code>GET /api/crm-sync/status?provider=hubspot</code></p>
        </CardContent></Card>
      </div>

      <Card className="mt-8"><CardContent className="p-5">
        <h3 className="font-semibold">Konflikt-Auflösung</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Bidirektionale Syncs verwenden eine der drei Strategien: <code>careai-wins</code>, <code>crm-wins</code> oder <code>newest-wins</code> (Default).
          Pro Sync-Run wird das Ergebnis geloggt — siehe <code>SyncResult.conflicts</code> in der API-Antwort.
        </p>
      </CardContent></Card>

      <p className="mt-6 text-xs text-muted-foreground">Setup und Field-Mapping: siehe <code>docs/CRM-SYNC.md</code>.</p>
    </div>
  );
}
