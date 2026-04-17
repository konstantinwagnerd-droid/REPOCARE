/**
 * Feature flag toggle UI.
 *
 * Flags are stored in DB (table owned by enterprise agent). This page simply
 * POSTs to /api/admin/flags/[key] with { enabled: boolean }.
 */
export const dynamic = "force-dynamic";

const DEFAULT_FLAGS = [
  { key: "voice_v2", label: "Voice-Engine v2 (Beta)" },
  { key: "fhir_export", label: "FHIR Export (Beta)" },
  { key: "maintenance_mode", label: "Maintenance-Banner" },
  { key: "demo_mode", label: "Demo-Modus (keine Schreibzugriffe)" },
  { key: "pdf_v2", label: "PDF-Export v2" },
];

export default function FeatureFlagsPage() {
  return (
    <main className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Feature Flags</h1>
        <p className="text-sm text-muted-foreground">Aktivieren oder deaktivieren Sie Beta-Funktionen.</p>
      </header>
      <ul className="divide-y rounded-lg border">
        {DEFAULT_FLAGS.map((f) => (
          <li key={f.key} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{f.label}</div>
              <code className="text-xs text-muted-foreground">{f.key}</code>
            </div>
            <form action={`/api/admin/flags/${f.key}`} method="POST">
              <button className="rounded-md border px-3 py-1 text-sm hover:bg-muted" name="toggle" value="1">
                Umschalten
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
