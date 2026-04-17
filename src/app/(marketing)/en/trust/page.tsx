import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Server, FileCheck, Users, Globe2 } from "lucide-react";

export const metadata = { title: "Trust Center", alternates: { canonical: "/en/trust", languages: { "de-DE": "/trust", "en-US": "/en/trust" } } };

const pillars = [
  { icon: ShieldCheck, title: "GDPR by design", desc: "Data minimisation, purpose binding, erasure workflows, DPA templates for customers." },
  { icon: Lock, title: "End-to-end encryption", desc: "TLS 1.3 in transit, AES-256 at rest, customer-managed keys available on Enterprise." },
  { icon: Server, title: "DACH hosting only", desc: "Primary data center Hetzner Falkenstein (DE), DR site Vienna (AT). No data leaves the EU." },
  { icon: FileCheck, title: "ISO 27001 on track", desc: "Certification audit scheduled Q4 2026. All controls implemented and monitored." },
  { icon: Users, title: "Human oversight", desc: "Every AI suggestion is reviewable. Caregivers confirm before anything enters the record." },
  { icon: Globe2, title: "EU AI Act compliant", desc: "High-risk system fully documented: risk management, transparency, logging, oversight." },
];

const certs = [
  { name: "GDPR / DSGVO", status: "Compliant" },
  { name: "EU AI Act", status: "Compliant (Art. 6 + Annex III)" },
  { name: "ISO 27001", status: "Audit Q4 2026" },
  { name: "BSI C5", status: "In preparation" },
  { name: "TISAX", status: "Planned 2027" },
  { name: "HIPAA", status: "On request for US pilots" },
];

export default function EnTrustPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Trust Center</Badge>
      <h1 className="font-serif text-5xl font-semibold">Security you can verify.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Care data is the most sensitive data there is. Here is exactly how we protect it.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => (
          <Card key={p.title}><CardContent className="p-6">
            <p.icon className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
          </CardContent></Card>
        ))}
      </div>

      <h2 className="mt-16 font-serif text-3xl font-semibold">Certifications & frameworks</h2>
      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr><th className="p-3 text-left">Framework</th><th className="p-3 text-left">Status</th></tr></thead>
          <tbody>
            {certs.map((c) => <tr key={c.name} className="border-t"><td className="p-3 font-medium">{c.name}</td><td className="p-3 text-muted-foreground">{c.status}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
