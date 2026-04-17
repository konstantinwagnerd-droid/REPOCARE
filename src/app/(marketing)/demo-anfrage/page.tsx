import { PageHero } from "@/components/marketing/sections/page-hero";
import { SecondaryNav } from "@/components/marketing/sections/secondary-nav";
import { PflegeTeam } from "@/design-system/illustrations";
import { DemoForm } from "./form";

export const metadata = { title: "Demo anfragen — CareAI" };

export default function DemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Demo anfragen"
        title="30 Minuten. Ihre Prozesse. Ihre Fragen."
        description="Keine Kreditkarte, keine Verpflichtung. Waehlen Sie einen Termin — wir bestaetigen innerhalb eines Werktags."
        illustration={<PflegeTeam className="h-72 w-72" />}
      />
      <SecondaryNav />
      <section className="container py-12">
        <DemoForm />
      </section>
    </>
  );
}
