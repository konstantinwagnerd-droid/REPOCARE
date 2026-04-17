/**
 * Trust-Row — Compliance-Badges kompakt.
 */
import { ShieldCheck, Leaf, Server, Sparkles, Lock } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "DSGVO", sub: "konform" },
  { icon: Sparkles, label: "EU AI Act", sub: "ready" },
  { icon: Lock, label: "ISO 27001", sub: "i.V." },
  { icon: Server, label: "Hetzner EU", sub: "Falkenstein" },
  { icon: Leaf, label: "100% Oekostrom", sub: "Hosting" },
];

export function TrustRow() {
  return (
    <section className="border-y border-border/60 bg-background">
      <div className="container grid grid-cols-2 gap-4 py-10 sm:grid-cols-3 md:grid-cols-5">
        {badges.map((b) => (
          <div
            key={b.label}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <b.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold">{b.label}</div>
              <div className="text-xs text-muted-foreground">{b.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
