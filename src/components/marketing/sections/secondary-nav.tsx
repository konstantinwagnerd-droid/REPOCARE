/**
 * Sekundaere Marketing-Navigation (unterhalb des Hero auf Unterseiten).
 * Wird auf Trust/Security/Integrations usw. eingesetzt.
 */
import Link from "next/link";

const links = [
  { href: "/trust", label: "Trust" },
  { href: "/security", label: "Sicherheit" },
  { href: "/integrations", label: "Integrationen" },
  { href: "/roi-rechner", label: "ROI-Rechner" },
  { href: "/case-studies", label: "Fallstudien" },
  { href: "/changelog", label: "Changelog" },
  { href: "/status", label: "Status" },
  { href: "/ueber-uns", label: "Ueber uns" },
  { href: "/karriere", label: "Karriere" },
  { href: "/kontakt", label: "Kontakt" },
];

export function SecondaryNav({ active }: { active?: string }) {
  return (
    <nav aria-label="Sekundaernavigation" className="border-b border-border/60 bg-background">
      <div className="container flex items-center gap-1 overflow-x-auto py-2 text-sm">
        {links.map((l) => {
          const isActive = active === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 transition ${
                isActive
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
