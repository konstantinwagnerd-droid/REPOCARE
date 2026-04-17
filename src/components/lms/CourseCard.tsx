import Link from "next/link";
import { Clock, Award, BookOpen, ArrowRight, Lock, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/lib/lms/types";
import { frequencyLabel } from "@/lib/lms/scheduler";

const CATEGORY_STYLE: Record<Course["category"], { label: string; className: string }> = {
  pflicht: { label: "Pflicht", className: "bg-amber-100 text-amber-800 border-amber-200" },
  weiterbildung: { label: "Weiterbildung", className: "bg-sky-100 text-sky-800 border-sky-200" },
  onboarding: { label: "Onboarding", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

export function CourseCard({ course, href }: { course: Course; href?: string }) {
  const cat = CATEGORY_STYLE[course.category];
  const url = href ?? `/lms/kurs/${course.id}`;
  return (
    <Card className="group relative flex flex-col overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-primary/10 via-muted/40 to-accent/10 text-6xl">
        <span role="img" aria-label={course.title}>{course.thumbnailEmoji}</span>
        <span className={`absolute left-3 top-3 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cat.className}`}>
          {cat.label}
        </span>
        {!course.published && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Lock className="h-3 w-3" /> Entwurf
          </span>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-semibold leading-snug">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.durationMinutes} Min</span>
          <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course.modules.length} Module</span>
          <span className="inline-flex items-center gap-1"><Award className="h-3.5 w-3.5" />{course.points} Punkte</span>
          <span className="inline-flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{course.language.toUpperCase()}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="secondary" className="text-[10px]">{frequencyLabel(course.validity)}</Badge>
          <Link
            href={url}
            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Starten <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
