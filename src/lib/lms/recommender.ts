// LMS Kurs-Empfehlungen
import type { Certificate, Course, Role } from "./types";
import { nextDueDate } from "./scheduler";

export interface Recommendation {
  course: Course;
  reason: string;
  priority: number; // 1=hoch, 5=niedrig
}

export function recommendCourses(
  courses: Course[],
  role: Role,
  certificates: Certificate[],
  limit = 5,
): Recommendation[] {
  const now = new Date();
  const recs: Recommendation[] = [];

  for (const course of courses) {
    if (!course.published) continue;
    if (!course.targetRoles.includes("alle") && !course.targetRoles.includes(role)) continue;

    const cert = [...certificates]
      .filter((c) => c.courseId === course.id)
      .sort((a, b) => (a.issuedAt > b.issuedAt ? -1 : 1))[0];

    if (!cert) {
      // Nie absolviert
      if (course.category === "pflicht") {
        recs.push({ course, reason: "Pflichtschulung — noch nicht absolviert", priority: 1 });
      } else if (course.category === "onboarding") {
        recs.push({ course, reason: "Onboarding — empfohlen für neue Mitarbeitende", priority: 2 });
      } else {
        recs.push({ course, reason: "Weiterbildung — stärkt Ihre Fachkompetenz", priority: 4 });
      }
      continue;
    }

    // Absolviert — läuft Frist bald ab?
    const due = nextDueDate(cert.issuedAt, course.validity);
    if (due) {
      const days = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (days < 0) {
        recs.push({
          course,
          reason: `Frist überschritten seit ${Math.abs(days)} Tagen`,
          priority: 1,
        });
      } else if (days <= 30) {
        recs.push({
          course,
          reason: `Auffrischung fällig in ${days} Tag${days === 1 ? "" : "en"}`,
          priority: 2,
        });
      }
    }
  }

  recs.sort((a, b) => a.priority - b.priority);
  return recs.slice(0, limit);
}
