import Link from "next/link";
import { BookOpen, ClipboardList, Shield, FileBarChart, Home } from "lucide-react";

const tabs = [
  { href: "/admin/lms", label: "Übersicht", icon: Home, exact: true },
  { href: "/admin/lms/kurse", label: "Kurse", icon: BookOpen },
  { href: "/admin/lms/zuweisungen", label: "Zuweisungen", icon: ClipboardList },
  { href: "/admin/lms/compliance", label: "Compliance", icon: Shield },
  { href: "/admin/lms/reports", label: "Reports", icon: FileBarChart },
];

export default function AdminLmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-border bg-background">
        <div className="flex flex-wrap gap-1 px-6 py-3">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-border hover:bg-muted/40 aria-[current=page]:border-primary aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
            >
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
