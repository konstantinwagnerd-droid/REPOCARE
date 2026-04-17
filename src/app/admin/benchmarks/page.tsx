import { BenchmarksClient } from "@/components/benchmarks/BenchmarksClient";
import { BUNDESLAENDER, QIS, SIZES, TRAEGER, makePeerGroup } from "@/lib/quality-benchmarks/reference-data";
import { calculateBenchmark } from "@/lib/quality-benchmarks/calculator";

export const metadata = { title: "Care-Quality-Benchmarks · CareAI" };

export default function BenchmarksPage() {
  const peer = makePeerGroup("Wien", "mittel", "church");
  const report = calculateBenchmark("facility-demo", "Pflegezentrum Hietzing", "2026-Q1", peer);
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Care-Quality-Benchmarks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vergleiche deine 10 Qualitätsindikatoren nach § 113 SGB XI mit Bundesdurchschnitt, Region und ähnlicher Trägerart.
        </p>
      </header>
      <BenchmarksClient
        qis={QIS}
        bundeslaender={BUNDESLAENDER}
        sizes={SIZES}
        traeger={TRAEGER}
        initialReport={report}
      />
    </div>
  );
}
