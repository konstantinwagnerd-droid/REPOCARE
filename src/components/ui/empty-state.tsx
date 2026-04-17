import { type LucideIcon, CheckCircle2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  /** Optional: Sekundaer-Action (z.B. "Tour starten"). */
  secondaryAction?: EmptyStateAction;
  /** Optional: 3-Schritte-Checkliste (nur bei variant="first-time"). */
  checklist?: string[];
  /** first-time = dickeres Hero fuer Erstnutzer. */
  variant?: "default" | "first-time";
  className?: string;
}

function ActionButton({ action, primary }: { action: EmptyStateAction; primary: boolean }) {
  const variant = primary ? "accent" : "outline";
  if (action.href) {
    return (
      <Button asChild variant={variant}>
        <a href={action.href}>{action.label}</a>
      </Button>
    );
  }
  return (
    <Button onClick={action.onClick} variant={variant}>
      {action.label}
    </Button>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  checklist,
  variant = "default",
  className,
}: EmptyStateProps) {
  const isFirstTime = variant === "first-time";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 text-center",
        isFirstTime ? "py-20" : "py-16",
        className
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary motion-safe:animate-[pulse_3s_ease-in-out_infinite]",
          isFirstTime ? "h-24 w-24" : "h-16 w-16"
        )}
      >
        <Icon className={isFirstTime ? "h-12 w-12" : "h-8 w-8"} strokeWidth={1.5} />
      </div>
      <div>
        <h3 className={cn("font-serif font-semibold", isFirstTime ? "text-2xl md:text-3xl" : "text-xl")}>
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              "mt-2 text-muted-foreground",
              isFirstTime ? "max-w-lg text-base" : "max-w-sm text-sm mt-1.5"
            )}
          >
            {description}
          </p>
        )}
      </div>

      {checklist && checklist.length > 0 && (
        <ul className="mt-2 flex flex-col items-start gap-2 text-left text-sm">
          {checklist.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/60" strokeWidth={2} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {(action || secondaryAction) && (
        <div className={cn("mt-2 flex flex-wrap items-center justify-center gap-2", isFirstTime && "mt-4")}>
          {action && <ActionButton action={action} primary />}
          {secondaryAction && <ActionButton action={secondaryAction} primary={false} />}
        </div>
      )}
    </div>
  );
}
