import { AnonymizerClient } from "@/components/anonymizer/AnonymizerClient";

export const metadata = { title: "Anonymizer · CareAI" };

export default function AdminAnonymizerPage() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Test-Daten Anonymizer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Verwenden Sie Echtdaten DSGVO-konform für Lehre, Forschung oder Demos.
          Konfigurierbare Strategien, k-Anonymitätsbewertung und Side-by-Side-Vorschau.
        </p>
      </header>
      <AnonymizerClient />
    </div>
  );
}
