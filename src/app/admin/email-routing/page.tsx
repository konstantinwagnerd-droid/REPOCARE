import { RoutingClient } from "./RoutingClient";

export const metadata = { title: "E-Mail-Routing · Admin · CareAI" };

export default function EmailRoutingPage() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">E-Mail-Routing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Regeln definieren, welche Mails an Lead / Bewerbung / Beschwerde / Support routen.
          Hoehere Prioritaet schlaegt Default-Keyword-Matching.
        </p>
      </header>
      <RoutingClient />
    </div>
  );
}
