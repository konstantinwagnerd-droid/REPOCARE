// LMS In-Memory-Store mit Demo-Daten.
// In Produktion würde dies durch eine DB-Schicht (außerhalb unserer Zone) ersetzt.

import { COURSES } from "./courses";
import type {
  Assignment,
  Certificate,
  Course,
  Enrollment,
  QuizAttempt,
  Role,
} from "./types";
import type { StaffMember } from "./compliance";

// Singleton-Store pro Serverinstanz (Next.js edge: pro Lambda)
type DB = {
  courses: Course[];
  staff: StaffMember[];
  assignments: Assignment[];
  enrollments: Enrollment[];
  attempts: QuizAttempt[];
  certificates: Certificate[];
  reflections: Record<string, string>; // moduleId_userId → text
  notes: Record<string, string>; // userId_courseId → notes
};

declare global {
  // eslint-disable-next-line no-var
  var __careaiLmsStore: DB | undefined;
}

function initDb(): DB {
  const now = new Date();
  const staff: StaffMember[] = [
    { id: "u_anna", name: "Anna Huber", role: "pflegekraft" as Role, team: "Station A" },
    { id: "u_miriam", name: "Miriam Gruber", role: "pflegekraft" as Role, team: "Station B" },
    { id: "u_thomas", name: "Thomas Schmid", role: "pdl" as Role, team: "Leitung" },
    { id: "u_linda", name: "Linda Bauer", role: "pflegekraft" as Role, team: "Station A" },
    { id: "u_peter", name: "Peter König", role: "reinigung" as Role, team: "Service" },
    { id: "u_sabine", name: "Sabine Mayer", role: "pflegekraft" as Role, team: "Station B" },
  ];
  const assignments: Assignment[] = [];
  for (const s of staff) {
    for (const c of COURSES.filter((co) => co.category === "pflicht")) {
      // Mit Variation: in 30, 60, -7 Tagen (überfällig)
      const offset = (s.id.charCodeAt(2) + c.id.charCodeAt(0)) % 120 - 20;
      const due = new Date(now);
      due.setDate(due.getDate() + offset);
      assignments.push({
        id: `as_${s.id}_${c.id}`,
        userId: s.id,
        courseId: c.id,
        dueDate: due.toISOString(),
        mandatory: true,
        assignedAt: new Date(now.getTime() - 30 * 86400000).toISOString(),
        assignedBy: "u_thomas",
      });
    }
  }

  // Ein paar Demo-Zertifikate
  const certificates: Certificate[] = [
    {
      id: "cert_demo_1",
      userId: "u_anna",
      userName: "Anna Huber",
      personnelNumber: "12345",
      courseId: "hygiene-basis",
      courseTitle: "Hygiene & Infektionsschutz (Basis)",
      durationMinutes: 45,
      score: 72,
      total: 80,
      issuedAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
      validUntil: new Date(now.getTime() + 355 * 86400000).toISOString(),
      verificationCode: "AX7K9-P2M3R",
    },
    {
      id: "cert_demo_2",
      userId: "u_anna",
      userName: "Anna Huber",
      personnelNumber: "12345",
      courseId: "careai-onboarding",
      courseTitle: "CareAI Onboarding — die Basics",
      durationMinutes: 30,
      score: 40,
      total: 40,
      issuedAt: new Date(now.getTime() - 60 * 86400000).toISOString(),
      verificationCode: "B9X4T-M7N2K",
    },
    {
      id: "cert_demo_3",
      userId: "u_miriam",
      userName: "Miriam Gruber",
      personnelNumber: "12346",
      courseId: "brandschutz",
      courseTitle: "Brandschutz & Evakuierung",
      durationMinutes: 30,
      score: 54,
      total: 60,
      issuedAt: new Date(now.getTime() - 100 * 86400000).toISOString(),
      validUntil: new Date(now.getTime() + 265 * 86400000).toISOString(),
      verificationCode: "C5W2R-K8Q1N",
    },
  ];

  return {
    courses: [...COURSES],
    staff,
    assignments,
    enrollments: [],
    attempts: [],
    certificates,
    reflections: {},
    notes: {},
  };
}

export function db(): DB {
  if (!globalThis.__careaiLmsStore) {
    globalThis.__careaiLmsStore = initDb();
  }
  return globalThis.__careaiLmsStore;
}

export const DEMO_CURRENT_USER = {
  id: "u_anna",
  name: "Anna Huber",
  personnelNumber: "12345",
  role: "pflegekraft" as Role,
  team: "Station A",
};

export function getOrCreateEnrollment(userId: string, courseId: string): Enrollment {
  const d = db();
  let e = d.enrollments.find((en) => en.userId === userId && en.courseId === courseId && !en.completedAt);
  if (!e) {
    e = {
      id: `en_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      courseId,
      startedAt: new Date().toISOString(),
      moduleProgress: [],
    };
    d.enrollments.push(e);
  }
  return e;
}

export function setModuleCompleted(enrollmentId: string, moduleId: string) {
  const d = db();
  const e = d.enrollments.find((en) => en.id === enrollmentId);
  if (!e) return;
  const existing = e.moduleProgress.find((p) => p.moduleId === moduleId);
  if (existing) {
    existing.completed = true;
    existing.completedAt = new Date().toISOString();
  } else {
    e.moduleProgress.push({ moduleId, completed: true, completedAt: new Date().toISOString() });
  }
  e.bookmarkModuleId = moduleId;
}

export function completeEnrollment(
  enrollmentId: string,
  score: number,
  passed: boolean,
) {
  const d = db();
  const e = d.enrollments.find((en) => en.id === enrollmentId);
  if (!e) return;
  e.completedAt = new Date().toISOString();
  e.finalScore = score;
  e.passed = passed;
}
