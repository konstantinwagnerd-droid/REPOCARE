/**
 * Admin/App Page Shell — einheitliche Info-Architektur fuer alle Dashboards,
 * Listen-, Detail- und Form-Seiten. Siehe docs/IA-AUDIT.md fuer Rationale.
 *
 * Zielbild:
 *  - Jede Seite hat einen klaren PageHeader (Title + Subtitle + Actions + Breadcrumbs)
 *  - Sections trennen sich ueber PageSection (Heading + Description)
 *  - Grids sind vorgegeben (1/2/3/4 Spalten) — keine wilden md:grid-cols Mischungen
 *  - StatCard ersetzt die handgemalten KPI-Kacheln in jedem Dashboard
 *  - EmptyState kommt aus ui/empty-state.tsx (re-export hier)
 */
import * as React from "react";
import Link from "next/link";
import { ChevronRight, TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
export { EmptyState } from "@/components/ui/empty-state";

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  if (!items?.length) return null;
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-xs text-muted-foreground", className)}>
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={`${c.label}-${i}`}>
            {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" aria-hidden />}
            {c.href && !last ? (
              <Link href={c.href} className="transition-colors hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span className={cn(last && "font-medium text-foreground")}>{c.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// PageHeader
// ---------------------------------------------------------------------------

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Crumb[];
  /** Badge/Meta am Titel (z.B. Status). */
  meta?: React.ReactNode;
  /** Icon links am Titel. */
  icon?: LucideIcon;
  className?: string;
}

export function PageHeader({ title, subtitle, description, actions, breadcrumbs, meta, icon: Icon, className }: PageHeaderProps) {
  return (
    <header className={cn("space-y-3", className)}>
      {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {Icon && (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
            )}
            <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
            {meta ? <span className="ml-1">{meta}</span> : null}
          </div>
          {(subtitle || description) && (
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground md:text-base">{subtitle ?? description}</p>
          )}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// PageSection
// ---------------------------------------------------------------------------

export interface PageSectionProps {
  heading?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  /** Schmales Mini-Heading-Styling (fuer Owner-Style Sections). */
  compact?: boolean;
  className?: string;
  id?: string;
}

export function PageSection({ heading, description, actions, children, compact, className, id }: PageSectionProps) {
  return (
    <section id={id} className={cn("space-y-3", className)}>
      {(heading || actions) && (
        <div className="flex flex-wrap items-end justify-between gap-2">
          {heading && (
            <div>
              {compact ? (
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{heading}</h2>
              ) : (
                <h2 className="font-serif text-xl font-semibold tracking-tight md:text-2xl">{heading}</h2>
              )}
              {description && !compact && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
            </div>
          )}
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// PageGrid
// ---------------------------------------------------------------------------

export interface PageGridProps {
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const GRID_COLS: Record<NonNullable<PageGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

const GRID_GAP = { sm: "gap-3", md: "gap-4", lg: "gap-6" } as const;

export function PageGrid({ columns = 3, gap = "md", children, className }: PageGridProps) {
  return <div className={cn("grid", GRID_COLS[columns], GRID_GAP[gap], className)}>{children}</div>;
}

// ---------------------------------------------------------------------------
// StatCard (KPI-Kachel mit Trend + optionalem Mini-Sparkline)
// ---------------------------------------------------------------------------

export interface StatCardProps {
  label: string;
  value: number | string;
  sublabel?: string;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "accent" | "success" | "warning" | "danger";
  trend?: {
    value: string;
    direction: "up" | "down" | "flat";
    /** Semantik: ist "up" gut oder schlecht? Default: good. */
    positive?: boolean;
  };
  /** Werte fuer Mini-Sparkline (0..1 normalisiert oder beliebige Zahlen). */
  sparkline?: number[];
  href?: string;
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "border-border bg-background",
  primary: "border-primary/20 bg-primary/5",
  accent: "border-accent/20 bg-accent/5",
  success: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20",
  warning: "border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20",
  danger: "border-rose-200 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20",
};

const TONE_ICON: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (!data?.length) return null;
  const w = 80;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = data.length > 1 ? w / (data.length - 1) : 0;
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / span) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={cn("opacity-70", className)} aria-hidden>
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

function TrendIcon({ direction }: { direction: "up" | "down" | "flat" }) {
  if (direction === "up") return <TrendingUp className="h-3 w-3" aria-hidden />;
  if (direction === "down") return <TrendingDown className="h-3 w-3" aria-hidden />;
  return <Minus className="h-3 w-3" aria-hidden />;
}

export function StatCard({ label, value, sublabel, icon: Icon, tone = "default", trend, sparkline, href, className }: StatCardProps) {
  const trendColor = (() => {
    if (!trend) return "";
    const good = trend.positive ?? true;
    const isGood = (trend.direction === "up" && good) || (trend.direction === "down" && !good);
    if (trend.direction === "flat") return "text-muted-foreground";
    return isGood ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
  })();

  const inner = (
    <div className={cn("group rounded-2xl border p-5 transition hover:shadow-md", TONE_CLASSES[tone], className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1 font-serif text-3xl font-semibold leading-none tracking-tight">{value}</div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            {trend && (
              <span className={cn("inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 font-medium", trendColor)}>
                <TrendIcon direction={trend.direction} />
                {trend.value}
              </span>
            )}
            {sublabel && <span className="text-muted-foreground">{sublabel}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {Icon && (
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", TONE_ICON[tone])}>
              <Icon className="h-5 w-5" />
            </span>
          )}
          {sparkline?.length ? <Sparkline data={sparkline} className={TONE_ICON[tone].includes("text-") ? TONE_ICON[tone].split(" ").find((c) => c.startsWith("text-")) : "text-primary"} /> : null}
        </div>
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
      {inner}
    </Link>
  ) : (
    inner
  );
}

// ---------------------------------------------------------------------------
// PageContainer — aeusserer Wrapper mit konsistentem Padding/Spacing
// ---------------------------------------------------------------------------

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-10", className)}>{children}</div>;
}

// ---------------------------------------------------------------------------
// QuickAction — kleine Kacheln fuer Quick-Actions-Abschnitte
// ---------------------------------------------------------------------------

export interface QuickActionProps {
  title: string;
  description?: string;
  href: string;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "accent";
}

export function QuickAction({ title, description, href, icon: Icon, tone = "default" }: QuickActionProps) {
  const toneClass = {
    default: "hover:border-primary/30 hover:bg-muted/40",
    primary: "border-primary/30 bg-primary/5 hover:bg-primary/10",
    accent: "border-accent/30 bg-accent/5 hover:bg-accent/10",
  }[tone];
  return (
    <Link href={href} className={cn("flex items-start gap-3 rounded-xl border border-border p-4 text-sm transition", toneClass)}>
      {Icon && (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
          <Icon className="h-4 w-4" />
        </span>
      )}
      <div className="min-w-0">
        <div className="font-medium text-foreground">{title}</div>
        {description && <div className="mt-0.5 text-xs text-muted-foreground">{description}</div>}
      </div>
    </Link>
  );
}
