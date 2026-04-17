import { OnboardingWizard } from "./wizard";

export const metadata = { title: "Onboarding — CareAI" };

export default function OnboardingPage() {
  return (
    <section className="container py-10">
      <OnboardingWizard />
    </section>
  );
}
