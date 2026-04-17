import { type LucideIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4 py-16 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="h-8 w-8" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="font-serif text-xl font-semibold">{title}</h3>
        {description && <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && (
        action.href ? (
          <Button asChild variant="accent">
            <a href={action.href}>{action.label}</a>
          </Button>
        ) : (
          <Button onClick={action.onClick} variant="accent">{action.label}</Button>
        )
      )}
    </div>
  );
}
