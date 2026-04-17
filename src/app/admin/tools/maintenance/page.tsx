export const dynamic = "force-dynamic";

export default function MaintenancePage() {
  return (
    <main className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Maintenance-Modus</h1>
        <p className="text-sm text-muted-foreground">Banner anzeigen, Schreibzugriffe einschränken oder komplett read-only.</p>
      </header>
      <form action="/api/admin/maintenance" method="POST" className="max-w-lg space-y-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="banner" /> Wartungs-Banner anzeigen
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="readOnly" /> Read-Only-Modus (keine Schreibzugriffe)
        </label>
        <label className="block text-sm font-medium">
          Banner-Text
          <textarea name="message" rows={3} className="mt-1 w-full rounded-md border px-3 py-2" />
        </label>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Anwenden</button>
      </form>
    </main>
  );
}
