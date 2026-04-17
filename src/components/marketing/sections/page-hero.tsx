/**
 * Generischer Page-Hero fuer Marketing-Unterseiten.
 */
import * as React from "react";
import { Badge } from "@/components/ui/badge";

export function PageHero({
  eyebrow,
  title,
  description,
  illustration,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  illustration?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[50vh] bg-gradient-to-b from-primary-50/60 via-background to-background dark:from-primary-900/20"
      />
      <div className="container grid items-center gap-10 py-16 md:py-20 lg:grid-cols-12">
        <div className={illustration ? "lg:col-span-7" : "lg:col-span-9"}>
          {eyebrow && (
            <Badge variant="outline" className="mb-5 rounded-full border-primary/20 bg-primary/5 text-primary">
              {eyebrow}
            </Badge>
          )}
          <h1 className="text-balance font-serif text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{description}</p>
          )}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {illustration && (
          <div className="hidden justify-center lg:col-span-5 lg:flex">{illustration}</div>
        )}
      </div>
    </section>
  );
}
