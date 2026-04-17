import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Building2,
  Users,
  Heart,
  Plug,
  Sparkles,
  FileText,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";
import { WelcomeTourButton } from "./WelcomeTourButton";

/**
 * Welcome-Landing fuer Erst-Einrichtungen.
 * Lebt parallel zum bestehenden Guided-Wizard unter /onboarding.
 * 6-Schritt-Checkliste mit direkten Einstiegs-Links.
 */

interface Step {
  id: string;
  title: string;
  description: string;
  icon: typeof Building2;
  href?: string;
  action?: "tour";
}

const STEPS: Step[] = [
  {
    id: "stammdaten",
    title: "Stammdaten",
    description: "Einrichtungsname, Adresse, Ansprechpartner, Logo.",
    icon: Building2,
    href: "/onboarding",
  },
  {
    id: "team",
    title: "Team einladen",
    description: "Mitarbeiter anlegen und Rollen vergeben.",
    icon: Users,
    href: "/admin/users",
  },
  {
    id: "bewohner",
    title: "Erste Bewohner",
    description: "Manuell anlegen oder aus Vorgaenger-System importieren.",
    icon: Heart,
    href: "/app/bewohner",
  },
  {
    id: "integrations",
    title: "Integrationen",
    description: "Arzt-Software, Apotheke, Abrechnung — alles optional.",
    icon: Plug,
    href: "/admin/integrations",
  },
  {
    id: "tour",
    title: "Produkt-Tour",
    description: "2-Minuten-Rundgang durch CareAI.",
    icon: Sparkles,
    action: "tour",
  },
  {
    id: "first-report",
    title: "Erster Pflegebericht",
    description: "Legen Sie gemeinsam mit einem Teammitglied den ersten Eintrag an.",
    icon: FileText,
    href: "/app/handover",
  },
];

export default async function OnboardingWelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ facility?: string; completed?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const facilityName = params.facility ?? "Ihre Einrichtung";
  const completedIds = new Set((params.completed ?? "").split(",").filter(Boolean));
  const completedCount = completedIds.size;
  const progress = Math.round((completedCount / STEPS.length) * 100);

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <h1 className="mt-4 font-serif text-3xl font-semibold md:text-4xl">
          Willkommen bei CareAI, {facilityName}
        </h1>
        <p className="mt-2 text-muted-foreground">
          In 6 Schritten sind Sie startklar. Sie koennen jederzeit pausieren und spaeter weitermachen.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {completedCount} von {STEPS.length} Schritten erledigt
          </span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Checkliste */}
      <ul className="space-y-3">
        {STEPS.map((step) => {
          const done = completedIds.has(step.id);
          const Icon = step.icon;
          return (
            <li
              key={step.id}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="shrink-0">
                {done ? (
                  <CheckCircle2 className="h-6 w-6 text-primary" strokeWidth={2} />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground/50" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {step.action === "tour" ? (
                <WelcomeTourButton role={session.user.role} />
              ) : (
                step.href && (
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Starten <ArrowRight className="h-4 w-4" />
                  </Link>
                )
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex items-center justify-between text-sm">
        <Link href="/app" className="text-muted-foreground hover:text-foreground">
          &larr; Zur App
        </Link>
        <Link href="/onboarding" className="text-primary hover:underline">
          Klassischen Wizard oeffnen &rarr;
        </Link>
      </div>
    </div>
  );
}
