import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plug, Zap, Database, FileText } from "lucide-react";

export const metadata = { title: "Integrations", alternates: { canonical: "/en/integrations", languages: { "de-DE": "/integrations", "en-US": "/en/integrations" } } };

const categories = [
  { title: "Care documentation (import)", icon: Database, items: ["Vivendi NG", "MediFox stationär", "Senso", "DAN products", "CGM SOZIAL", "Generic CSV / Excel"] },
  { title: "Interoperability", icon: Plug, items: ["HL7 FHIR R4", "HL7 v2.5", "IHE XDS", "GDT / LDT", "eHealth (AT) — e-Medikation", "KIM (DE) — sichere Übertragung"] },
  { title: "Identity & SSO", icon: Zap, items: ["SAML 2.0", "OpenID Connect", "Microsoft Entra ID", "Google Workspace", "Keycloak", "LDAP / Active Directory"] },
  { title: "Billing & accounting", icon: FileText, items: ["DATEV", "BMD", "SAP FI", "Pflegekassen-Abrechnung §105 SGB XI", "WGKK (AT)", "Export ZUGFeRD / XRechnung"] },
];

export default function EnIntegrationsPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Integrations</Badge>
      <h1 className="font-serif text-5xl font-semibold">Plays well with your stack.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        CareAI integrates with the systems care providers already use. Imports, exports, real-time APIs — all standards-based.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {categories.map((c) => (
          <Card key={c.title}><CardContent className="p-6">
            <c.icon className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">{c.title}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {c.items.map((i) => <li key={i} className="flex gap-2"><span className="text-primary">✓</span>{i}</li>)}
            </ul>
          </CardContent></Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-muted/50 p-8">
        <h2 className="font-serif text-2xl font-semibold">Don&apos;t see your system?</h2>
        <p className="mt-2 text-muted-foreground">We build custom connectors for Enterprise customers. Typically 2–4 weeks depending on API surface.</p>
      </div>
    </div>
  );
}
