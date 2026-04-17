import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...p }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-2xl border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgba(15,118,110,0.04),0_8px_24px_-12px_rgba(15,118,110,0.12)]", className)}
      {...p}
    />
  ),
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...p }, ref) => <div ref={ref} className={cn("flex flex-col gap-1.5 p-6", className)} {...p} />,
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...p }, ref) => (
    <h3 ref={ref} className={cn("font-serif text-xl font-semibold leading-tight", className)} {...p} />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...p }, ref) => <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...p} />,
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...p }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...p} />,
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...p }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...p} />
  ),
);
CardFooter.displayName = "CardFooter";
