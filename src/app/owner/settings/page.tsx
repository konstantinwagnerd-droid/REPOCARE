export const runtime = "nodejs";

export default function OwnerSettingsPage() {
  return (
    <div className="space-y-4 p-6 lg:p-10">
      <header><h1 className="font-serif text-3xl font-semibold tracking-tight">Owner-Settings</h1></header>
      <div className="space-y-4 rounded-xl border border-border bg-background p-6">
        <section>
          <h2 className="font-medium">Telegram-Push für neue Leads</h2>
          <p className="mt-1 text-sm text-muted-foreground">Damit du auf dem Handy direkt Bescheid bekommst, sobald jemand das Demo-Formular ausfüllt:</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            <li>In Vercel → Project Settings → Environment Variables zwei Werte ergänzen:</li>
            <li><code className="rounded bg-muted px-2 py-0.5 text-xs">TELEGRAM_BOT_TOKEN</code> = Token von @BotFather</li>
            <li><code className="rounded bg-muted px-2 py-0.5 text-xs">TELEGRAM_CHAT_ID</code> = deine Chat-ID</li>
            <li>Redeploy auslösen → fertig.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-medium">Demo-Account-Filter</h2>
          <p className="mt-1 text-sm text-muted-foreground">Alle Logins mit @careai.demo werden als DEMO markiert (gelb hinterlegt) und in der Live-Sessions-Übersicht von echten Logins unterschieden.</p>
        </section>

        <section>
          <h2 className="font-medium">E-Mail-Versand</h2>
          <p className="mt-1 text-sm text-muted-foreground">CareAI versendet aktuell <strong>keine</strong> E-Mails von extern (kein Gmail, kein Viennamail). Alle Anfragen siehst du nur in <a href="/owner/leads" className="text-primary hover:underline">Leads</a>.</p>
        </section>

        <section>
          <h2 className="font-medium">DB-Reset / Reseed</h2>
          <p className="mt-1 text-sm text-muted-foreground">Falls du die Demo-Daten neu aufsetzen willst: <code className="rounded bg-muted px-2 py-0.5 text-xs">/api/setup?token=careai-setup-2026</code> aufrufen.</p>
        </section>
      </div>
    </div>
  );
}
