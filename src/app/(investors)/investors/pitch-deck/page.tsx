import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Pitch Deck — CareAI Data Room" };

export default function PitchDeckPage() {
  return (
    <div className="container py-10">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Pitch Deck</h1>
          <p className="mt-2 text-muted-foreground">Seed-Pitch, Stand April 2026.</p>
        </div>
        <Button asChild variant="accent">
          <Link href="/investors/exports/careai-pitch-deck.pdf" target="_blank">
            <Download className="mr-2 h-4 w-4" /> PDF herunterladen
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="aspect-[16/10] w-full bg-gradient-to-br from-primary/10 via-background to-accent/10">
            {/* Eingebettetes PDF — in Produktion via object oder iframe */}
            <iframe
              src="/investors/exports/careai-pitch-deck.pdf"
              title="CareAI Pitch Deck"
              className="h-full w-full"
            />
          </div>
        </CardContent>
      </Card>

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold">Deck-Struktur</h2>
        <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>1. Problem — 35% Doku-Zeit, Pflegekraefte-Mangel, Legacy-Software in DACH</li>
          <li>2. Loesung — Sprach-KI, Strukturmodell-konform, EU-gehostet</li>
          <li>3. Warum jetzt — EU AI Act, Entbuerokratisierungsgesetz, Generation-Wechsel bei PDLs</li>
          <li>4. Markt — 13.500 Pflegeheime DACH, TAM €4,2 Mrd</li>
          <li>5. Produkt — Demo-Screenshots, HITL-Architektur, Voice-Engine</li>
          <li>6. Traction — 3 Pilots, 5 LOIs, NPS +54</li>
          <li>7. Business Model — 42k EUR ACV, 82% Gross Margin, unter 5% Churn</li>
          <li>8. Competition — Medifox/Vivendi (Legacy), Nuance (US, DSGVO-Risiko), Compugroup</li>
          <li>9. GTM — Direct Sales, Messen, Traegergruppen-Partnerships</li>
          <li>10. Team — Konstantin, geplantes CTO-Hire, Pflege-Beirat</li>
          <li>11. Finanzen — 450k ARR Dec 2026, 5,4M 2028, Break-Even 2028</li>
          <li>12. Ask — 500k EUR SAFE, Cap 5M, 20% Discount</li>
        </ol>
      </section>
    </div>
  );
}
