import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "About", alternates: { canonical: "/en/about", languages: { "de-DE": "/ueber-uns", "en-US": "/en/about" } } };

export default function EnAboutPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">About</Badge>
      <h1 className="font-serif text-5xl font-semibold">Built by people who know care.</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="prose prose-slate max-w-none">
          <p>
            CareAI was founded in Vienna in 2024 by a team of caregivers, software engineers and ethicists
            who were tired of watching good people leave the profession because of paperwork.
          </p>
          <p>
            Our mission is simple: give caregivers back the time they went into care for in the first place —
            time with people. We do this with AI that works quietly in the background, never replacing human
            judgement, always making it easier.
          </p>
          <h2>Principles</h2>
          <ul>
            <li><strong>Human-in-the-loop by default.</strong> Every AI output is confirmed by a trained caregiver.</li>
            <li><strong>DACH hosting only.</strong> Your residents&apos; data never leaves the EU.</li>
            <li><strong>Open standards.</strong> HL7 FHIR, SAML, XRechnung — no lock-in.</li>
            <li><strong>Affordable for small providers.</strong> Starter tier exists because not every provider has 200 beds.</li>
          </ul>
        </div>
        <div className="space-y-3">
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Founded</p><p className="text-2xl font-semibold">2024</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Headquarters</p><p className="text-2xl font-semibold">Vienna, AT</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Team</p><p className="text-2xl font-semibold">14</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Beds served</p><p className="text-2xl font-semibold">2,400+</p></CardContent></Card>
        </div>
      </div>
    </div>
  );
}
