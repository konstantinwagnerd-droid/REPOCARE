import { notFound } from "next/navigation";
import Link from "next/link";
import { abStore } from "@/lib/ab-testing/store";
import { generateReport } from "@/lib/ab-testing/reporter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeclareWinnerButton } from "./declare-winner-button";

export default async function ExperimentDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const exp = abStore.getByName(name);
  if (!exp) return notFound();
  const report = generateReport(exp.id);

  return (
    <div className="container py-10">
      <Link href="/admin/ab-testing" className="text-sm text-muted-foreground hover:text-primary">← Zurück zur Übersicht</Link>
      <div className="mt-3 flex items-start justify-between">
        <div>
          <Badge variant="outline" className="mb-2">{exp.status}</Badge>
          <h1 className="font-serif text-3xl font-semibold">{exp.name}</h1>
          <p className="mt-1 text-muted-foreground">{exp.description}</p>
        </div>
      </div>

      <Card className="mt-6"><CardContent className="p-5">
        <p className="text-sm font-medium">Empfehlung</p>
        <p className="mt-1 text-sm text-muted-foreground">{report?.recommendation}</p>
      </CardContent></Card>

      {report?.results.map((res) => (
        <div key={res.metricId} className="mt-8">
          <h2 className="font-serif text-xl font-semibold">Metrik: {exp.metrics.find((m) => m.id === res.metricId)?.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            p-Wert: {res.pValue !== null ? res.pValue.toFixed(4) : "–"} ·{" "}
            {res.significant ? "signifikant" : "nicht signifikant"} ·{" "}
            {res.sampleSizeReached ? "Mindest-Sample erreicht" : "Sample-Größe noch nicht erreicht"}
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50"><tr>
                <th className="p-3 text-left">Variante</th>
                <th className="p-3 text-right">Impressions</th>
                <th className="p-3 text-right">Conversions</th>
                <th className="p-3 text-right">Rate</th>
                <th className="p-3 text-right">95% CI</th>
                <th className="p-3 text-right">Aktion</th>
              </tr></thead>
              <tbody>
                {res.variants.map((v) => {
                  const isLeader = res.leadingVariantId === v.variantId;
                  return (
                    <tr key={v.variantId} className={`border-t ${isLeader ? "bg-primary/5" : ""}`}>
                      <td className="p-3 font-medium">{v.variantName}{isLeader && <Badge className="ml-2" variant="default">führend</Badge>}</td>
                      <td className="p-3 text-right">{v.impressions}</td>
                      <td className="p-3 text-right">{v.conversions}</td>
                      <td className="p-3 text-right font-semibold">{(v.conversionRate * 100).toFixed(2)}%</td>
                      <td className="p-3 text-right text-muted-foreground">[{(v.ciLower * 100).toFixed(1)}%, {(v.ciUpper * 100).toFixed(1)}%]</td>
                      <td className="p-3 text-right"><DeclareWinnerButton experimentId={exp.id} variantId={v.variantId} variantName={v.variantName} disabled={exp.status !== "running"} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline"><Link href="/admin/ab-testing">Zurück</Link></Button>
      </div>
    </div>
  );
}
