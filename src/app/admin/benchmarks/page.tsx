import { BenchmarksClient } from "@/components/benchmarks/BenchmarksClient";
import { BUNDESLAENDER, QIS, SIZES, TRAEGER, makePeerGroup } from "@/lib/quality-benchmarks/reference-data";
import { calculateBenchmark } from "@/lib/quality-benchmarks/calculator";
import { HelpTip } from "@/components/tooltip/HelpTip";
import { GlossarTip } from "@/components/tooltip/GlossarTip";

export const metadata = { title: "Care-Quality-Benchmarks · CareAI" };

export default function BenchmarksPage() {
  const peer = makePeerGroup("Wien", "mittel", "church");
  const report = calculateBenchmark("facility-demo", "Pflegezentrum Hietzing", "2026-Q1", peer);
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="flex items-center gap-2 font-serif text-3xl font-semibold tracking-tight">
          Care-Quality-Benchmarks
          <HelpTip label="Was sind Benchmarks?" size="md">
            Vergleicht Ihre Einrichtung gegen Peer-Group (Region, Groesse, Traegerart) und Bundesdurchschnitt.
            Werte unter Median sind potenzieller Handlungsbedarf.
          </HelpTip>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vergleiche deine 10{" "}
          <GlossarTip term="qi">Qualitätsindikatoren</GlossarTip>
          {" "}nach §{" "}
          <GlossarTip term="sgb_xi" explanation="§ 113 SGB XI regelt die indikatorengestuetzte Qualitaetsdarstellung in der stationaeren Langzeitpflege.">
            113 SGB XI
          </GlossarTip>
          {" "}mit Bundesdurchschnitt, Region und ähnlicher Trägerart.
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
