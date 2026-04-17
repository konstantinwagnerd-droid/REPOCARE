import { notFound } from "next/navigation";
import Link from "next/link";
import { findCourse } from "@/lib/lms/courses";
import { db, DEMO_CURRENT_USER, getOrCreateEnrollment } from "@/lib/lms/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModulePlayer } from "@/components/lms/ModulePlayer";
import { frequencyLabel } from "@/lib/lms/scheduler";
import { BookOpen, Clock, Award, Target, BookCopy, ChevronLeft } from "lucide-react";

export default async function KursPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = findCourse(id);
  if (!course) notFound();

  const user = DEMO_CURRENT_USER;
  const enrollment = getOrCreateEnrollment(user.id, course.id);
  const progressMap = Object.fromEntries(
    enrollment.moduleProgress.filter((m) => m.completed).map((m) => [m.moduleId, true]),
  );

  const cert = db().certificates.find((c) => c.userId === user.id && c.courseId === course.id);

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div>
        <Link href="/lms/katalog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Katalog
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 bg-gradient-to-br from-primary/10 via-muted/30 to-accent/10 p-6 md:flex-row md:items-center">
          <div className="text-6xl">{course.thumbnailEmoji}</div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant={course.category === "pflicht" ? "warning" : course.category === "weiterbildung" ? "info" : "success"}>
                {course.category === "pflicht" ? "Pflichtschulung" : course.category === "weiterbildung" ? "Weiterbildung" : "Onboarding"}
              </Badge>
              <Badge variant="outline">{frequencyLabel(course.validity)}</Badge>
              <Badge variant="secondary">{course.difficulty}</Badge>
              {course.lawReference && <Badge variant="outline">{course.lawReference}</Badge>}
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground">{course.shortDescription}</p>
            <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{course.durationMinutes} Min</span>
              <span className="inline-flex items-center gap-1"><BookOpen className="h-4 w-4" />{course.modules.length} Module</span>
              <span className="inline-flex items-center gap-1"><Award className="h-4 w-4" />{course.points} Punkte</span>
            </div>
          </div>
        </div>
        {cert && (
          <div className="flex items-center justify-between gap-3 border-t border-border bg-emerald-50 p-4 text-sm text-emerald-900">
            <span>
              Sie haben diesen Kurs am{" "}
              <strong>{new Date(cert.issuedAt).toLocaleDateString("de-AT")}</strong> abgeschlossen
              {cert.validUntil && (
                <>
                  , gültig bis <strong>{new Date(cert.validUntil).toLocaleDateString("de-AT")}</strong>
                </>
              )}
              .
            </span>
            <a
              href={`/api/lms/certificates/${cert.id}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
            >
              Zertifikat
            </a>
          </div>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <h3 className="flex items-center gap-2 font-serif text-sm font-semibold">
              <Target className="h-4 w-4 text-primary" /> Lernziele
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {course.learningObjectives.map((o, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="flex items-center gap-2 font-serif text-sm font-semibold">
              <BookCopy className="h-4 w-4 text-primary" /> Literatur
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {course.literature.map((l, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="font-serif text-sm font-semibold">Frist</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {course.validity.type === "einmalig"
                ? "Einmalige Schulung, keine Auffrischung erforderlich."
                : `${frequencyLabel(course.validity)} — nach Abschluss wird der nächste Termin automatisch erstellt.`}
            </p>
            {course.lawReference && (
              <p className="mt-2 text-xs text-muted-foreground">Grundlage: {course.lawReference}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <ModulePlayer
        course={course}
        enrollmentId={enrollment.id}
        initialIndex={
          enrollment.bookmarkModuleId
            ? Math.max(0, course.modules.findIndex((m) => m.id === enrollment.bookmarkModuleId))
            : 0
        }
        initialProgress={progressMap}
      />
    </div>
  );
}
