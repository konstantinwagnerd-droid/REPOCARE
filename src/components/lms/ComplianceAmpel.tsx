import { cn } from "@/lib/utils";

export function ComplianceAmpel({
  state,
  label,
  size = "md",
}: {
  state: "gruen" | "gelb" | "rot" | "offen";
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const colors = {
    gruen: "bg-emerald-500",
    gelb: "bg-amber-500",
    rot: "bg-red-500",
    offen: "bg-slate-300",
  } as const;
  const labels = {
    gruen: "Aktuell",
    gelb: "Bald fällig",
    rot: "Überfällig",
    offen: "Nicht begonnen",
  } as const;
  const dim = size === "sm" ? "h-2.5 w-2.5" : size === "lg" ? "h-4 w-4" : "h-3 w-3";
  return (
    <span className="inline-flex items-center gap-2 text-xs">
      <span className={cn("inline-block rounded-full", colors[state], dim)} aria-hidden />
      <span className="text-muted-foreground">{label ?? labels[state]}</span>
    </span>
  );
}
