import { PageHero } from "@/components/marketing/sections/page-hero";
import { SecondaryNav } from "@/components/marketing/sections/secondary-nav";
import { Zeitersparnis } from "@/design-system/illustrations";
import { RoiCalculator } from "./calculator";

export const metadata = {
  title: "ROI-Rechner — CareAI",
  description: "Sekundengenau berechnen, wie viel Zeit und Geld CareAI Ihrer Einrichtung bringt.",
};

export default function RoiPage() {
  return (
    <>
      <PageHero
        eyebrow="ROI-Rechner"
        title="In unter 30 Sekunden sehen, was CareAI bringt."
        description="Schieben Sie die Regler — wir rechnen live. Konservative Annahmen, keine Marketing-Zahlen. Teilen Sie den Link mit Ihrer Geschaeftsfuehrung."
        illustration={<Zeitersparnis className="h-72 w-72" />}
      />
      <SecondaryNav active="/roi-rechner" />
      <section className="container py-12 lg:py-16">
        <RoiCalculator />
      </section>
    </>
  );
}
