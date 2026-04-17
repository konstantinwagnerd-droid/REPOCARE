import Link from "next/link";
import { abStore } from "@/lib/ab-testing/store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

export const metadata = { title: "A/B-Testing" };

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  running: "bg-primary/10 text-primary",
  completed: "bg-emerald-100 text-emerald-700",
  archived: "bg-slate-100 text-slate-600",
};

export default function AbTestingPage() {
  const experiments = abStore.listExperiments();
  const running = experiments.filter((e) => e.status === "running").length;
  const completed = experiments.filter((e) => e.status === "completed").length;

  return (
    <div className="container py-10">
      <div className="flex items-start justify-between">
        <div>
          <Badge variant="outline" className="mb-2">Experimente</Badge>
          <h1 className="font-serif text-3xl font-semibold">A/B-Testing</h1>
          <p className="mt-1 text-muted-foreground">Marketing-Varianten datengetrieben entscheiden.</p>
        </div>
        <Button asChild><Link href="/admin/ab-testing/new">Neues Experiment</Link></Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5">
          <FlaskConical className="h-5 w-5 text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Gesamt</p>
          <p className="text-2xl font-semibold">{experiments.length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <TrendingUp className="h-5 w-5 text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Laufend</p>
          <p className="text-2xl font-semibold">{running}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Abgeschlossen</p>
          <p className="text-2xl font-semibold">{completed}</p>
        </CardContent></Card>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Varianten</th>
              <th className="p-3 text-left">Start</th>
              <th className="p-3 text-left">Metrik</th>
              <th className="p-3 text-right">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {experiments.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-3">
                  <Link href={`/admin/ab-testing/${e.name}`} className="font-medium hover:text-primary">{e.name}</Link>
                  <p className="text-xs text-muted-foreground">{e.description}</p>
                </td>
                <td className="p-3"><span className={`inline-block rounded-full px-2 py-0.5 text-xs ${statusStyles[e.status] ?? ""}`}>{e.status}</span></td>
                <td className="p-3">{e.variants.length}</td>
                <td className="p-3 text-muted-foreground"><Clock className="inline h-3 w-3 mr-1" />{e.startedAt ? new Date(e.startedAt).toLocaleDateString("de-DE") : "–"}</td>
                <td className="p-3 text-muted-foreground">{e.metrics[0]?.name ?? "–"}</td>
                <td className="p-3 text-right"><Link href={`/admin/ab-testing/${e.name}`} className="text-sm text-primary">Ergebnisse →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
