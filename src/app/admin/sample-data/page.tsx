import { SampleDataClient } from "@/components/sample-data/SampleDataClient";

export const metadata = { title: "Sample-Daten · CareAI" };

export default function AdminSampleDataPage() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Sample-Daten Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Erzeugen Sie realistische, synthetische Bewohner:innen-Datensätze für Demos, Schulungen und Stress-Tests.
          Deterministisch über Seed — gleiche Eingabe, gleiches Ergebnis. Keine Echtdaten, voll DSGVO-unbedenklich.
        </p>
      </header>
      <SampleDataClient />
    </div>
  );
}
