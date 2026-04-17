import { AnalyticsClient } from "./AnalyticsClient";

export const metadata = { title: "Analytics · CareAI" };

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Nutzungs-Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Privatsphäre-freundliche Nutzungs-KPIs – ohne User-Tracking, ohne Cookies, ohne Fingerprint. DSGVO-konform by design.
        </p>
      </header>
      <AnalyticsClient />
    </div>
  );
}
