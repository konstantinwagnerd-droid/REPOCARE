import { AdminNotificationsClient } from "./AdminClient";
import { templates } from "@/lib/notifications/templates";

export const metadata = { title: "Notification-Admin · CareAI" };

export default function AdminNotificationsPage() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Notification-Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Templates verwalten, Regeln definieren, Test-Benachrichtigungen versenden, Zustellungsrate beobachten.
        </p>
      </header>
      <AdminNotificationsClient templates={templates} />
    </div>
  );
}
