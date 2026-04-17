// LMS Gamification — Punkte, Streaks, Abzeichen, Leaderboard
import type { Badge, Certificate, LeaderboardEntry } from "./types";
import { COURSES } from "./courses";
import type { StaffMember } from "./compliance";

export const BADGES: Badge[] = [
  { id: "starter", label: "Neueinsteiger:in", description: "Ersten Kurs abgeschlossen", emoji: "🌱", threshold: 1, kind: "courses" },
  { id: "lerner", label: "Wissbegierig", description: "3 Kurse abgeschlossen", emoji: "📚", threshold: 3, kind: "courses" },
  { id: "profi", label: "Fachprofi", description: "6 Kurse abgeschlossen", emoji: "🎓", threshold: 6, kind: "courses" },
  { id: "expert", label: "Expertin", description: "Alle Pflichtkurse bestanden", emoji: "🏆", threshold: 8, kind: "courses" },
  { id: "pts_500", label: "500 Punkte", description: "500 Lernpunkte gesammelt", emoji: "⭐", threshold: 500, kind: "points" },
  { id: "streak_7", label: "7-Tage-Streak", description: "7 Tage in Folge gelernt", emoji: "🔥", threshold: 7, kind: "streak" },
];

export function pointsForUser(userId: string, certificates: Certificate[]): number {
  return certificates
    .filter((c) => c.userId === userId)
    .reduce((sum, c) => {
      const course = COURSES.find((co) => co.id === c.courseId);
      return sum + (course?.points ?? 50);
    }, 0);
}

export function coursesCompleted(userId: string, certificates: Certificate[]): number {
  return new Set(certificates.filter((c) => c.userId === userId).map((c) => c.courseId)).size;
}

export interface EarnedBadge extends Badge {
  earned: boolean;
  progress: number; // 0..1
}

export function badgesForUser(
  userId: string,
  certificates: Certificate[],
  streakDays: number,
): EarnedBadge[] {
  const pts = pointsForUser(userId, certificates);
  const courses = coursesCompleted(userId, certificates);
  return BADGES.map((b) => {
    let value = 0;
    if (b.kind === "points") value = pts;
    if (b.kind === "courses") value = courses;
    if (b.kind === "streak") value = streakDays;
    return {
      ...b,
      earned: value >= b.threshold,
      progress: Math.min(1, value / b.threshold),
    };
  });
}

export function computeLeaderboard(
  staff: StaffMember[],
  certificates: Certificate[],
): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = staff.map((s) => ({
    userId: s.id,
    displayName: s.name,
    team: s.team,
    points: pointsForUser(s.id, certificates),
    coursesCompleted: coursesCompleted(s.id, certificates),
    rank: 0,
  }));
  entries.sort((a, b) => b.points - a.points || b.coursesCompleted - a.coursesCompleted);
  entries.forEach((e, idx) => (e.rank = idx + 1));
  return entries;
}

/** Sehr simple Streak-Berechnung (basierend auf Zertifikats-Datums-Historie). */
export function computeStreak(userId: string, certificates: Certificate[]): number {
  const days = new Set(
    certificates
      .filter((c) => c.userId === userId)
      .map((c) => new Date(c.issuedAt).toISOString().slice(0, 10)),
  );
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 60; i++) {
    const iso = d.toISOString().slice(0, 10);
    if (days.has(iso)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else if (i === 0) {
      // Heute keine Aktivität — Streak basiert auf letzten aktiven Tag: rückwärts starten
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
