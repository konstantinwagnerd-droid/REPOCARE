// LMS Frist-Tracking
import type { Course, Frequency } from "./types";

export function frequencyToMonths(f: Frequency): number | null {
  switch (f.type) {
    case "einmalig":
      return null;
    case "jaehrlich":
      return 12;
    case "zweijaehrlich":
      return 24;
    case "fuenfjaehrlich":
      return 60;
  }
}

export function nextDueDate(completedAt: Date | string, f: Frequency): Date | null {
  const months = frequencyToMonths(f);
  if (months === null) return null;
  const d = typeof completedAt === "string" ? new Date(completedAt) : new Date(completedAt);
  const next = new Date(d);
  next.setMonth(next.getMonth() + months);
  return next;
}

export function frequencyLabel(f: Frequency): string {
  switch (f.type) {
    case "einmalig":
      return "Einmalig";
    case "jaehrlich":
      return "Jährlich";
    case "zweijaehrlich":
      return "Alle 2 Jahre";
    case "fuenfjaehrlich":
      return "Alle 5 Jahre";
  }
}

export interface DeadlineInfo {
  courseId: string;
  courseTitle: string;
  dueDate: string;
  daysUntilDue: number;
  urgency: "ok" | "soon" | "late";
}

export function computeDeadline(course: Course, completedAt?: string | null, assignedDueDate?: string): DeadlineInfo | null {
  let due: Date | null = null;
  if (assignedDueDate) due = new Date(assignedDueDate);
  else if (completedAt) due = nextDueDate(completedAt, course.validity);
  if (!due) return null;
  const now = Date.now();
  const diffMs = due.getTime() - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const urgency: DeadlineInfo["urgency"] = diffDays < 0 ? "late" : diffDays <= 14 ? "soon" : "ok";
  return {
    courseId: course.id,
    courseTitle: course.title,
    dueDate: due.toISOString(),
    daysUntilDue: diffDays,
    urgency,
  };
}

export const REMINDER_OFFSETS_DAYS = [30, 14, 7, 1];
