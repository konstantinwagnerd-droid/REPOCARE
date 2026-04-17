import { AnomalyClient } from "./AnomalyClient";

export const metadata = { title: "Audit-Anomalien · CareAI" };

export default function AdminAnomalyPage() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Audit-Log Anomalien</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Automatische Erkennung ungewöhnlicher Muster. Methodik: Heuristische Regeln + Z-Score auf 30-Tage-Baseline.
            Bezug: ISO 27001 A.12.4.
          </p>
        </div>
      </header>
      <AnomalyClient />
    </div>
  );
}
