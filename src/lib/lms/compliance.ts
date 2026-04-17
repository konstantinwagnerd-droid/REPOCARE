// LMS Compliance-Berechnung
import type { Assignment, Certificate, ComplianceStatus, Course, Role } from "./types";
import { nextDueDate } from "./scheduler";

export interface StaffMember {
  id: string;
  name: string;
  role: Role;
  team?: string;
}

export interface ComplianceRow {
  status: ComplianceStatus;
  breakdown: Array<{
    course: Course;
    completedAt?: string;
    dueDate?: string;
    state: "gruen" | "gelb" | "rot" | "offen";
    certificateId?: string;
  }>;
}

export function computeComplianceForStaff(
  staff: StaffMember,
  mandatoryCourses: Course[],
  assignments: Assignment[],
  certificates: Certificate[],
): ComplianceRow {
  const now = new Date();
  const breakdown = mandatoryCourses.map((course) => {
    const cert = [...certificates]
      .filter((c) => c.userId === staff.id && c.courseId === course.id)
      .sort((a, b) => (a.issuedAt > b.issuedAt ? -1 : 1))[0];
    const assignment = assignments.find(
      (a) => a.userId === staff.id && a.courseId === course.id,
    );
    let dueDate: Date | null = null;
    if (cert) {
      const next = nextDueDate(cert.issuedAt, course.validity);
      if (next) dueDate = next;
    } else if (assignment) {
      dueDate = new Date(assignment.dueDate);
    }
    let state: "gruen" | "gelb" | "rot" | "offen" = "offen";
    if (cert && (!dueDate || dueDate > now)) {
      if (dueDate) {
        const days = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        state = days <= 30 ? "gelb" : "gruen";
      } else {
        state = "gruen";
      }
    } else if (dueDate && dueDate < now) {
      state = "rot";
    } else if (assignment) {
      state = "gelb";
    }
    return {
      course,
      completedAt: cert?.issuedAt,
      dueDate: dueDate?.toISOString(),
      state,
      certificateId: cert?.id,
    };
  });

  const completed = breakdown.filter((b) => b.state === "gruen" || b.state === "gelb").length;
  const nextDue = breakdown
    .map((b) => b.dueDate)
    .filter((d): d is string => !!d)
    .sort()[0];
  const hasRed = breakdown.some((b) => b.state === "rot");
  const hasYellow = breakdown.some((b) => b.state === "gelb" || b.state === "offen");
  const overall: "gruen" | "gelb" | "rot" = hasRed ? "rot" : hasYellow ? "gelb" : "gruen";

  return {
    status: {
      userId: staff.id,
      userName: staff.name,
      role: staff.role,
      mandatoryCoursesTotal: mandatoryCourses.length,
      mandatoryCoursesCompleted: completed,
      nextDueDate: nextDue,
      state: overall,
    },
    breakdown,
  };
}

export function computeTenantCompliance(
  staffList: StaffMember[],
  mandatoryCourses: Course[],
  assignments: Assignment[],
  certificates: Certificate[],
) {
  const rows = staffList.map((s) =>
    computeComplianceForStaff(s, mandatoryCourses, assignments, certificates),
  );
  const totalSlots = rows.length * mandatoryCourses.length;
  const completed = rows.reduce((sum, r) => sum + r.status.mandatoryCoursesCompleted, 0);
  const rate = totalSlots === 0 ? 1 : completed / totalSlots;
  const overdue = rows
    .flatMap((r) => r.breakdown.filter((b) => b.state === "rot"))
    .length;
  const dueSoon = rows
    .flatMap((r) => r.breakdown.filter((b) => b.state === "gelb"))
    .length;
  return {
    rows,
    totals: {
      staffCount: rows.length,
      complianceRate: rate,
      overdue,
      dueSoon,
      green: rows.filter((r) => r.status.state === "gruen").length,
      yellow: rows.filter((r) => r.status.state === "gelb").length,
      red: rows.filter((r) => r.status.state === "rot").length,
    },
  };
}
