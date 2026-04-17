import Link from "next/link";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/lms/CourseCard";
import { ProgressRing } from "@/components/lms/ProgressRing";
import { ComplianceAmpel } from "@/components/lms/ComplianceAmpel";
import { LeaderboardCard } from "@/components/lms/LeaderboardCard";
import { Award, Clock, Flame, Sparkles, AlertTriangle, ArrowRight } from "lucide-react";
import { COURSES } from "@/lib/lms/courses";
import { db, DEMO_CURRENT_USER } from "@/lib/lms/store";
import { recommendCourses } from "@/lib/lms/recommender";
import { computeComplianceForStaff } from "@/lib/lms/compliance";
import { badgesForUser, computeLeaderboard, computeStreak, pointsForUser } from "@/lib/lms/gamification";

export default async function LmsHome() {
  const session = await auth();
  const role = (session?.user?.role as "pflegekraft" | "pdl" | "admin") ?? DEMO_CURRENT_USER.role;
  const user = DEMO_CURRENT_USER;

  const d = db();
  const myAssignments = d.assignments.filter((a) => a.userId === user.id);
  const myCerts = d.certificates.filter((c) => c.userId === user.id);
  const myEnrollments = d.enrollments.filter((e) => e.userId === user.id);
  const mandatory = COURSES.filter((c) => c.category === "pflicht");
  const compliance = computeComplianceForStaff(
    { id: user.id, name: user.name, role: user.role, team: user.team },
    mandatory,
    myAssignments,
    myCerts,
  );

  const openMandatory = compliance.breakdown.filter((b) => b.state !== "gruen").slice(0, 4);
  const running = myEnrollments.filter((e) => !e.completedAt);
  const completedCourses = myCerts.length;
  const hoursLearned = Math.round(
    myCerts.reduce((sum, c) => {
      const course = COURSES.find((co) => co.id === c.courseId);
      return sum + (course?.durationMinutes ?? 0) / 60;
    }, 0) * 10,
  ) / 10;
  const streak = computeStreak(user.id, myCerts);
  const points = pointsForUser(user.id, myCerts);
  const badges = badgesForUser(user.id, myCerts, streak);
  const earnedBadges = badges.filter((b) => b.earned);
  const recs = recommendCourses(COURSES, user.role, myCerts, 4);
  const leaderboard = computeLeaderboard(d.staff, d.certificates);

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Willkommen zurück</div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Hallo {user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-muted-foreground">
            {openMandatory.length > 0
              ? `Sie haben ${openMandatory.length} offene Pflichtschulung${openMandatory.length === 1 ? "" : "en"}.`
              : "Alle Pflichtschulungen sind aktuell — stark!"}
          </p>
        </div>
        <Link
          href="/lms/katalog"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Katalog öffnen <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Clock} label="Lernstunden" value={`${hoursLearned} h`} tone="text-primary bg-primary/10" />
        <StatCard icon={Award} label="Abgeschlossen" value={`${completedCourses}`} tone="text-emerald-700 bg-emerald-100" />
        <StatCard icon={Flame} label="Streak" value={`${streak} Tag${streak === 1 ? "" : "e"}`} tone="text-amber-700 bg-amber-100" />
        <StatCard icon={Sparkles} label="Punkte" value={`${points}`} tone="text-accent bg-accent/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Offene Pflichtschulungen
            </CardTitle>
            <Badge variant={compliance.status.state === "gruen" ? "success" : compliance.status.state === "rot" ? "danger" : "warning"}>
              {compliance.status.state === "gruen"
                ? "Alles aktuell"
                : compliance.status.state === "gelb"
                ? "Einige fällig"
                : "Überfällig"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {openMandatory.length === 0 && (
              <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                Sie sind vollständig auf Stand. Weiter so!
              </p>
            )}
            {openMandatory.map((b) => {
              const dueDays = b.dueDate
                ? Math.floor((new Date(b.dueDate).getTime() - Date.now()) / 86400000)
                : null;
              return (
                <Link
                  key={b.course.id}
                  href={`/lms/kurs/${b.course.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden>{b.course.thumbnailEmoji}</span>
                    <div>
                      <div className="font-semibold">{b.course.title}</div>
                      <div className="mt-1 text-xs">
                        <ComplianceAmpel state={b.state} />
                        {dueDays !== null && (
                          <span className="ml-3 text-muted-foreground">
                            {dueDays < 0
                              ? `${Math.abs(dueDays)} Tage überfällig`
                              : `in ${dueDays} Tag${dueDays === 1 ? "" : "en"}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mein Fortschritt</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <ProgressRing
              progress={compliance.status.mandatoryCoursesCompleted / Math.max(1, compliance.status.mandatoryCoursesTotal)}
              label="Pflichtquote"
              size={110}
            />
            <div className="text-sm">
              <div className="font-serif text-2xl font-semibold">
                {compliance.status.mandatoryCoursesCompleted}/{compliance.status.mandatoryCoursesTotal}
              </div>
              <div className="text-muted-foreground">Pflichtkurse aktuell</div>
              <div className="mt-3 flex flex-wrap gap-1">
                {earnedBadges.slice(0, 5).map((b) => (
                  <span key={b.id} title={b.label} className="rounded-full bg-muted px-2 py-1 text-xs">
                    {b.emoji} {b.label}
                  </span>
                ))}
                {earnedBadges.length === 0 && <span className="text-xs text-muted-foreground">Noch keine Abzeichen</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {running.length > 0 && (
        <div>
          <h2 className="font-serif text-xl font-semibold">Laufende Kurse</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {running.map((e) => {
              const course = COURSES.find((c) => c.id === e.courseId);
              if (!course) return null;
              const done = e.moduleProgress.filter((p) => p.completed).length;
              const pct = Math.round((done / course.modules.length) * 100);
              return (
                <Card key={e.id}>
                  <CardContent className="p-5">
                    <div className="mb-2 text-2xl">{course.thumbnailEmoji}</div>
                    <h3 className="font-serif text-lg font-semibold">{course.title}</h3>
                    <div className="mt-2 text-xs text-muted-foreground">{pct} % abgeschlossen</div>
                    <div className="mt-2 h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                    <Link
                      href={`/lms/kurs/${course.id}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                    >
                      Fortsetzen <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-serif text-xl font-semibold">Empfohlen für Sie</h2>
        <p className="text-sm text-muted-foreground">Basierend auf Ihrer Rolle und offenen Pflichten.</p>
        <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recs.map((r) => (
            <div key={r.course.id} className="relative">
              <CourseCard course={r.course} />
              <div className="mt-1 px-1 text-[11px] text-muted-foreground">{r.reason}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LeaderboardCard entries={leaderboard} currentUserId={user.id} />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Meine Abzeichen
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`rounded-xl border p-3 ${b.earned ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{b.emoji}</span>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${b.earned ? "" : "text-muted-foreground"}`}>
                      {b.label}
                    </div>
                    <div className="text-xs text-muted-foreground">{b.description}</div>
                  </div>
                </div>
                {!b.earned && (
                  <div className="mt-2 h-1.5 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary/60" style={{ width: `${Math.round(b.progress * 100)}%` }} />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="font-serif text-2xl font-semibold">{value}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
