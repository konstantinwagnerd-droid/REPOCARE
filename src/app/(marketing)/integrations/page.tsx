import { PageHero } from "@/components/marketing/sections/page-hero";
import { SecondaryNav } from "@/components/marketing/sections/secondary-nav";
import { Integration } from "@/design-system/illustrations";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Integrationen — CareAI" };

const groups = [
  {
    title: "Gesundheitswesen (Standards)",
    items: [
      {
        name: "FHIR R4",
        desc: "HL7 FHIR fuer Patientendaten-Austausch mit Kliniken, Hausaerzten, ePA.",
        status: "Live",
      },
      {
        name: "GDT",
        desc: "Geraetedaten-Transfer fuer Blutdruck, SpO2, Waage — automatische Werte-Uebernahme.",
        status: "Live",
      },
      {
        name: "KIM",
        desc: "Kommunikation im Medizinwesen (DE) — sicherer Versand von Arztbriefen.",
        status: "Beta",
      },
      {
        name: "ELGA",
        desc: "Elektronische Gesundheitsakte (AT) — Lesezugriff mit Patient-Consent.",
        status: "Live",
      },
      {
        name: "DTA",
        desc: "Datentraegeraustausch fuer Abrechnung mit Pflegekassen (DE).",
        status: "Live",
      },
    ],
  },
  {
    title: "Branchenloesungen",
    items: [
      { name: "Vivendi Migration", desc: "Import-Assistent fuer Vivendi PD-Altbestaende.", status: "Live" },
      { name: "MediFox Migration", desc: "Full-Migration inkl. SIS-Historie.", status: "Live" },
      { name: "Senso Cloud", desc: "Datenabgleich mit Senso Cloud (CH).", status: "Roadmap" },
    ],
  },
  {
    title: "Office & Kollaboration",
    items: [
      { name: "Microsoft 365 / Teams", desc: "SSO via Entra ID, Teams-Benachrichtigungen.", status: "Live" },
      { name: "Google Workspace", desc: "SSO, Calendar fuer Dienstplan-Sync.", status: "Live" },
      { name: "Slack", desc: "Dienstplan-Benachrichtigungen.", status: "Live" },
    ],
  },
  {
    title: "Abrechnung & ERP",
    items: [
      { name: "DATEV", desc: "Buchhaltungs-Export, Lohnabrechnung (DE).", status: "Live" },
      { name: "BMD", desc: "ERP- und Lohn-Schnittstelle (AT).", status: "Live" },
      { name: "Stripe Connect", desc: "Kartenzahlungen fuer Privatanteile.", status: "Beta" },
    ],
  },
];

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Live"
      ? "bg-primary/10 text-primary"
      : status === "Beta"
      ? "bg-accent/10 text-accent-700 dark:text-accent-400"
      : "bg-muted text-muted-foreground";
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}>{status}</span>;
}

export default function IntegrationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Integrationen"
        title="Passt in Ihre Systemlandschaft. Nicht umgekehrt."
        description="CareAI ist API-first. 14 native Integrationen, FHIR + GDT + KIM + ELGA + DTA von Haus aus. Wir migrieren Sie aus Vivendi, MediFox und anderen — ohne Datenverlust."
        illustration={<Integration className="h-72 w-72" />}
      />
      <SecondaryNav active="/integrations" />

      <section className="container space-y-14 py-16">
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">{g.title}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {g.items.map((i) => (
                <Card key={i.name}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold">{i.name}</h3>
                      <StatusBadge status={i.status} />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{i.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
