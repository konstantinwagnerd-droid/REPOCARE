import Link from "next/link";
import { marketingScheduler } from "@/lib/marketing-automation/scheduler";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Users, CheckCircle2, Mail } from "lucide-react";

export const metadata = { title: "Marketing-Automation" };

export default function MarketingAutomationPage() {
  const flows = marketingScheduler.listFlows();
  const totals = flows.reduce(
    (acc, f) => {
      const s = marketingScheduler.stats(f.id);
      acc.active += s.activeLeads;
      acc.completed += s.completedLeads;
      acc.enrolled += s.totalEnrolled;
      return acc;
    },
    { active: 0, completed: 0, enrolled: 0 }
  );

  return (
    <div className="container py-10">
      <div className="flex items-start justify-between">
        <div>
          <Badge variant="outline" className="mb-2">Automation</Badge>
          <h1 className="font-serif text-3xl font-semibold">Marketing-Automation</h1>
          <p className="mt-1 text-muted-foreground">Trigger-basierte Email-Flows für Leads und Kunden.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-5"><Zap className="h-5 w-5 text-primary" /><p className="mt-2 text-sm text-muted-foreground">Flows</p><p className="text-2xl font-semibold">{flows.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><Users className="h-5 w-5 text-primary" /><p className="mt-2 text-sm text-muted-foreground">Aktive Leads</p><p className="text-2xl font-semibold">{totals.active}</p></CardContent></Card>
        <Card><CardContent className="p-5"><CheckCircle2 className="h-5 w-5 text-primary" /><p className="mt-2 text-sm text-muted-foreground">Abgeschlossen</p><p className="text-2xl font-semibold">{totals.completed}</p></CardContent></Card>
        <Card><CardContent className="p-5"><Mail className="h-5 w-5 text-primary" /><p className="mt-2 text-sm text-muted-foreground">Gesamt-Enrolls</p><p className="text-2xl font-semibold">{totals.enrolled}</p></CardContent></Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {flows.map((f) => {
          const s = marketingScheduler.stats(f.id);
          return (
            <Card key={f.id}><CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant={f.active ? "default" : "outline"}>{f.active ? "Aktiv" : "Inaktiv"}</Badge>
                  <h2 className="mt-2 font-serif text-xl font-semibold">
                    <Link href={`/admin/marketing-automation/${encodeURIComponent(f.id)}`} className="hover:text-primary">{f.name}</Link>
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-4 gap-3 text-sm">
                <div><dt className="text-muted-foreground">Schritte</dt><dd className="font-semibold">{f.steps.length}</dd></div>
                <div><dt className="text-muted-foreground">Tage</dt><dd className="font-semibold">{f.durationDays}</dd></div>
                <div><dt className="text-muted-foreground">Aktiv</dt><dd className="font-semibold">{s.activeLeads}</dd></div>
                <div><dt className="text-muted-foreground">Open-Rate</dt><dd className="font-semibold">{(s.openRate * 100).toFixed(0)}%</dd></div>
              </dl>
              <div className="mt-4 flex gap-2">
                <Button asChild size="sm" variant="outline"><Link href={`/admin/marketing-automation/${encodeURIComponent(f.id)}`}>Details</Link></Button>
              </div>
            </CardContent></Card>
          );
        })}
      </div>
    </div>
  );
}
