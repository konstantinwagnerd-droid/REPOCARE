/**
 * Super-Admin only: impersonate another user.
 * Triggers audit log entry `action: "impersonate"` before switching session.
 *
 * NOTE: Server-side enforcement lives in the `/api/admin/impersonate` route
 * (owned by enterprise agent). This page is the UI surface.
 */
export const dynamic = "force-dynamic";

export default function ImpersonationPage() {
  return (
    <main className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">User-Impersonation</h1>
        <p className="text-sm text-muted-foreground">
          Nur für Super-Administrator:innen. Jeder Wechsel wird revisionssicher protokolliert.
        </p>
      </header>
      <form action="/api/admin/impersonate" method="POST" className="max-w-lg space-y-4">
        <label className="block text-sm font-medium">
          E-Mail des Ziel-Users
          <input
            required
            type="email"
            name="targetEmail"
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="user@careai.at"
          />
        </label>
        <label className="block text-sm font-medium">
          Begründung (audit-pflichtig)
          <textarea required name="reason" rows={3} className="mt-1 w-full rounded-md border px-3 py-2" />
        </label>
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Als User einloggen
        </button>
      </form>
    </main>
  );
}
