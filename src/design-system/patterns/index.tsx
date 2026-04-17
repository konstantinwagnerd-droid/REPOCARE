/**
 * Wiederkehrende UI-Patterns — StatCard, QuoteCard, TimelineItem, MetricTile.
 * Reine Praesentations-Komponenten. A11y: semantische Rollen + aria-labels.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: boolean;
}) {
  return (
    <Card className={cn("group h-full transition-shadow duration-200 hover:shadow-md", accent && "bg-gradient-to-br from-primary-50 to-background")}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-2 font-serif text-4xl font-semibold tracking-[-0.02em]">{value}</div>
            {hint && <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{hint}</div>}
          </div>
          {Icon && (
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuoteCard({
  quote,
  author,
  role,
  facility,
}: {
  quote: string;
  author: string;
  role: string;
  facility?: string;
}) {
  return (
    <Card>
      <CardContent className="p-7">
        <svg aria-hidden className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 7h4v10H3V11c0-2.2 1.8-4 4-4zm10 0h4v10h-8V11c0-2.2 1.8-4 4-4z" />
        </svg>
        <p className="mt-4 text-base leading-relaxed">{quote}</p>
        <div className="mt-6 border-t border-border pt-4">
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-muted-foreground">
            {role}
            {facility ? `, ${facility}` : ""}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TimelineItem({
  date,
  title,
  children,
  badge,
  last = false,
}: {
  date: string;
  title: string;
  children: React.ReactNode;
  badge?: string;
  last?: boolean;
}) {
  return (
    <li className="relative pl-8">
      {!last && <span aria-hidden className="absolute left-[11px] top-4 h-full w-0.5 bg-border" />}
      <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-background">
        <span className="h-2 w-2 rounded-full bg-primary" />
      </span>
      <div className="flex flex-wrap items-center gap-3">
        <time className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{date}</time>
        {badge && (
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent-700 dark:text-accent-400">
            {badge}
          </span>
        )}
      </div>
      <h4 className="mt-1 font-serif text-lg font-semibold">{title}</h4>
      <div className="mt-1 text-sm text-muted-foreground">{children}</div>
    </li>
  );
}

export function MetricTile({
  value,
  label,
  trend,
  trendValue,
}: {
  value: string;
  label: string;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
}) {
  const trendColor =
    trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground";
  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em]">{value}</div>
      {trend && trendValue && (
        <div className={cn("mt-1 text-sm font-medium", trendColor)}>
          {arrow} {trendValue}
        </div>
      )}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center")}>
      {eyebrow && (
        <div className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </div>
      )}
      <h2 className="font-serif text-4xl font-semibold tracking-[-0.02em] md:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  );
}
