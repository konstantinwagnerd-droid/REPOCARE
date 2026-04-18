import { SchulungenClient } from "./SchulungenClient";

export const metadata = { title: "Schulungen · CareAI" };

export default function SchulungenPage() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Schulungen & Zertifikate</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pflichtschulungen nach DNQP, KRINKO, BtMG und AStV. Jaehrliche Wiederholung, automatische Zertifikate.
        </p>
      </header>
      <SchulungenClient />
    </div>
  );
}
