import Link from "next/link";
import { notFound } from "next/navigation";
import { FLOWS } from "@/lib/marketing-automation/flows";
import { marketingScheduler } from "@/lib/marketing-automation/scheduler";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock } from "lucide-react";

export default async function FlowDetailPage({ params }: { params: Promise<{ flow: string }> }) {
  const { flow: flowId } = await params;
  const flow = FLOWS.find((f) => f.id === flowId);
  if (!flow) return notFound();
  const stats = marketingScheduler.stats(flow.id);

  return (
    <div className="container py-10">
      <Link href="/admin/marketing-automation" className="text-sm text-muted-foreground hover:text-primary">← Zurück</Link>
      <Badge variant="outline" className="mt-3 mb-2">{flow.active ? "Aktiv" : "Inaktiv"}</Badge>
      <h1 className="font-serif text-3xl font-semibold">{flow.name}</h1>
      <p className="mt-1 text-muted-foreground">{flow.description}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Trigger</p><p className="text-base font-semibold">{flow.trigger}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Aktive Leads</p><p className="text-2xl font-semibold">{stats.activeLeads}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Open-Rate</p><p className="text-2xl font-semibold">{(stats.openRate * 100).toFixed(1)}%</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Click-Rate</p><p className="text-2xl font-semibold">{(stats.clickRate * 100).toFixed(1)}%</p></CardContent></Card>
      </div>

      <h2 className="mt-10 font-serif text-xl font-semibold">Flow-Schritte</h2>
      <div className="mt-4 space-y-2">
        {flow.steps.map((s, i) => (
          <Card key={s.id}><CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 text-primary h-8 w-8 flex items-center justify-center text-sm font-semibold">{i + 1}</div>
            <div className="flex-1">
              <p className="font-medium">{s.subjectOverride ?? s.template}</p>
              <p className="text-xs text-muted-foreground">Template: <code>{s.template}</code> · <Clock className="inline h-3 w-3" /> T+{s.delayDays} Tage{s.condition ? ` · Bedingung: ${s.condition.type}` : ""}{s.subjectExperiment ? ` · A/B: ${s.subjectExperiment}` : ""}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
