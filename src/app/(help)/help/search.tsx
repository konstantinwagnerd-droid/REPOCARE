"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { HelpArticle } from "./articles";

export function HelpSearch({ articles }: { articles: HelpArticle[] }) {
  const [q, setQ] = useState("");
  const results = q.trim().length < 2
    ? []
    : articles.filter((a) =>
        (a.title + " " + a.excerpt + " " + a.body).toLowerCase().includes(q.toLowerCase())
      ).slice(0, 8);

  return (
    <div className="relative mx-auto max-w-2xl">
      <label htmlFor="help-search" className="sr-only">
        Hilfe durchsuchen
      </label>
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="help-search"
          type="search"
          placeholder="Suchen: z. B. Spracheingabe, MD-Export, DSGVO"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-14 pl-12 text-base"
          autoComplete="off"
        />
      </div>
      {results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-border/60 bg-background p-2 shadow-lg">
          {results.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/help/${a.slug}`}
                className="block rounded-xl p-3 hover:bg-secondary"
                onClick={() => setQ("")}
              >
                <div className="text-xs font-medium uppercase tracking-wider text-primary">{a.category}</div>
                <div className="mt-0.5 font-medium">{a.title}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">{a.excerpt}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
