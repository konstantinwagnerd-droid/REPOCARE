// Offline-Mode Demo & E2E-Test-Seite. Oeffentlich erreichbar nur im Dev-Build
// und bewusst frei von Auth, damit Playwright das Offline-Verhalten ohne
// Session-Setup durchspielen kann.

import { CareReportForm } from "@/components/reports/CareReportForm";
import { VitalEntryForm } from "@/components/vital/VitalEntryForm";
import { AdministerMedicationButton, MarkMeasureDoneButton } from "@/components/medication/AdministerMedicationButton";
import { WoundObservationForm } from "@/components/wounds/WoundObservationForm";
import { IncidentForm } from "@/components/incidents/IncidentForm";

export const dynamic = "force-dynamic";

export default function OfflineDemoPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold">Offline-Modus – Demo</h1>
        <p className="text-sm text-neutral-600">
          Alle Formulare hier sind offline-fähig. Chrome DevTools → Network → Offline
          umschalten, Eintrag speichern, wieder online → Sync läuft automatisch.
        </p>
      </header>

      <section>
        <h2 className="mb-2 text-lg font-medium">Pflegebericht</h2>
        <CareReportForm residentId="demo-resident-1" />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Vital-Werte</h2>
        <VitalEntryForm residentId="demo-resident-1" />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Medikament verabreicht</h2>
        <AdministerMedicationButton medicationId="demo-med-1" residentId="demo-resident-1" dose="5mg" />
        <div className="mt-2"><MarkMeasureDoneButton measureId="demo-m-1" residentId="demo-resident-1" /></div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Wundbeobachtung</h2>
        <WoundObservationForm residentId="demo-resident-1" woundId="demo-wound-1" />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Incident / Sturz</h2>
        <IncidentForm residentId="demo-resident-1" />
      </section>
    </main>
  );
}
