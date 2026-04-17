"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "@/components/lms/CourseCard";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { COURSES } from "@/lib/lms/courses";
import type { Course } from "@/lib/lms/types";
import { Search, Filter } from "lucide-react";

const CATEGORIES: Array<{ value: "alle" | Course["category"]; label: string }> = [
  { value: "alle", label: "Alle" },
  { value: "pflicht", label: "Pflicht" },
  { value: "weiterbildung", label: "Weiterbildung" },
  { value: "onboarding", label: "Onboarding" },
];

const DIFFICULTIES: Array<{ value: "alle" | Course["difficulty"]; label: string }> = [
  { value: "alle", label: "Alle" },
  { value: "einsteiger", label: "Einsteiger" },
  { value: "fortgeschritten", label: "Fortgeschritten" },
  { value: "profi", label: "Profi" },
];

export default function KatalogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"alle" | Course["category"]>("alle");
  const [difficulty, setDifficulty] = useState<"alle" | Course["difficulty"]>("alle");
  const [role, setRole] = useState<string>("alle");

  const filtered = useMemo(() => {
    return COURSES.filter((c) => {
      if (category !== "alle" && c.category !== category) return false;
      if (difficulty !== "alle" && c.difficulty !== difficulty) return false;
      if (role !== "alle" && !c.targetRoles.includes(role as Course["targetRoles"][number]) && !c.targetRoles.includes("alle"))
        return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.learningObjectives.some((o) => o.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [query, category, difficulty, role]);

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Kurs-Katalog</h1>
        <p className="mt-1 text-muted-foreground">
          {COURSES.length} Kurse verfügbar — {CATEGORIES.filter((c) => c.value !== "alle").map((c) => c.label).join(", ")}.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Kurse durchsuchen…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <FilterSelect label="Kategorie" value={category} options={CATEGORIES} onChange={(v) => setCategory(v as typeof category)} />
          <FilterSelect label="Schwierigkeit" value={difficulty} options={DIFFICULTIES} onChange={(v) => setDifficulty(v as typeof difficulty)} />
          <FilterSelect
            label="Rolle"
            value={role}
            options={[
              { value: "alle", label: "Alle Rollen" },
              { value: "pflegekraft", label: "Pflegekraft" },
              { value: "pdl", label: "PDL" },
              { value: "reinigung", label: "Reinigung" },
              { value: "kuche", label: "Küche" },
              { value: "verwaltung", label: "Verwaltung" },
            ]}
            onChange={(v) => setRole(v)}
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> {filtered.length} Treffer
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg border border-border bg-background px-2 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
