import { InboxClient } from "./InboxClient";

export const metadata = { title: "Benachrichtigungen · CareAI" };

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Benachrichtigungen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inbox, Einstellungen und Browser-Push. Kritische Hinweise werden zusätzlich als Toast eingeblendet.
        </p>
      </header>
      <InboxClient />
    </div>
  );
}
