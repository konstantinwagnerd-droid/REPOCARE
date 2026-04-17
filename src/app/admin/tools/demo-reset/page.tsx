export const dynamic = "force-dynamic";

export default function DemoResetPage() {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "1";
  return (
    <main className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Demo-Reset</h1>
        <p className="text-sm text-muted-foreground">Setzt alle Seed-Daten zurück. Nur im Demo-Modus verfügbar.</p>
      </header>
      {!demoMode ? (
        <div role="alert" className="rounded-md border border-destructive p-4 text-sm">
          Diese Aktion ist deaktiviert — die Umgebung ist nicht im Demo-Modus.
        </div>
      ) : (
        <form action="/api/admin/demo-reset" method="POST" className="space-y-4">
          <p className="text-sm">Alle Bewohner, Berichte, Audit-Einträge werden gelöscht und Seed-Daten neu geladen.</p>
          <button className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground">
            Jetzt zurücksetzen
          </button>
        </form>
      )}
    </main>
  );
}
