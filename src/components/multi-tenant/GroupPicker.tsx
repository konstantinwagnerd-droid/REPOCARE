"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Item { slug: string; name: string; logoText: string; }

export function GroupPicker({ groups, current }: { groups: Item[]; current: Item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const sp = useSearchParams();
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">{current.logoText}</span>
        <span>{current.name}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <div className="border-b border-border px-3 py-2 text-[11px] uppercase tracking-wide text-muted-foreground">Trägerverbund wechseln</div>
          {groups.map((g) => {
            const params = new URLSearchParams(sp?.toString() ?? "");
            params.set("gruppe", g.slug);
            return (
              <Link
                key={g.slug}
                href={`${pathname}?${params.toString()}`}
                className="flex items-center gap-3 px-3 py-3 text-sm hover:bg-secondary"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{g.logoText}</span>
                <span className="flex-1">{g.name}</span>
                {g.slug === current.slug && <span className="text-xs text-muted-foreground">aktiv</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
