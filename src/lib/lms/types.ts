// CareAI LMS — Typdefinitionen
// Gekapselt in src/lib/lms — keine Abhängigkeit zu src/db.

export type CourseCategory = "pflicht" | "weiterbildung" | "onboarding";
export type CourseLanguage = "de" | "en";
export type CourseDifficulty = "einsteiger" | "fortgeschritten" | "profi";
export type Role = "pflegekraft" | "pdl" | "admin" | "reinigung" | "kuche" | "verwaltung" | "alle";

export type Frequency =
  | { type: "einmalig" }
  | { type: "jaehrlich" }
  | { type: "zweijaehrlich" }
  | { type: "fuenfjaehrlich" };

export type ModuleKind = "text" | "video" | "quiz" | "reflexion";

export interface BaseModule {
  id: string;
  title: string;
  kind: ModuleKind;
  order: number;
  estimatedMinutes: number;
}

export interface TextModule extends BaseModule {
  kind: "text";
  body: string; // Markdown
}

export interface VideoModule extends BaseModule {
  kind: "video";
  // Stub: keine echte Videodatei, sondern Beschreibung + Poster
  posterUrl?: string;
  transcript: string;
  durationSeconds: number;
}

export type QuestionType = "mc" | "freitext" | "hotspot" | "matching";

export interface MCOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  explanation?: string;
  points: number;
  // MC
  options?: MCOption[];
  // Freitext
  expectedKeywords?: string[];
  // Hotspot
  hotspot?: { imageUrl?: string; correctX: number; correctY: number; tolerance: number };
  // Matching
  matchingPairs?: { left: string; right: string }[];
}

export interface QuizModule extends BaseModule {
  kind: "quiz";
  passThreshold: number; // z.B. 0.8
  questions: Question[];
  isFinal?: boolean;
}

export interface ReflexionModule extends BaseModule {
  kind: "reflexion";
  prompt: string;
  minWords?: number;
}

export type CourseModule = TextModule | VideoModule | QuizModule | ReflexionModule;

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: CourseCategory;
  targetRoles: Role[];
  durationMinutes: number;
  language: CourseLanguage;
  difficulty: CourseDifficulty;
  validity: Frequency; // jährlich, zweijährlich, …
  lawReference?: string; // z.B. §15 GuKG
  learningObjectives: string[];
  literature: string[];
  modules: CourseModule[];
  points: number;
  thumbnailEmoji: string;
  published: boolean;
  updatedAt: string; // ISO
}

export interface Assignment {
  id: string;
  userId: string;
  courseId: string;
  dueDate: string; // ISO
  mandatory: boolean;
  assignedAt: string;
  assignedBy: string;
}

export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  completedAt?: string;
  lastPosition?: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  startedAt: string;
  completedAt?: string;
  moduleProgress: ModuleProgress[];
  notes?: string;
  bookmarkModuleId?: string;
  finalScore?: number;
  passed?: boolean;
}

export interface QuizAttempt {
  id: string;
  enrollmentId: string;
  quizModuleId: string;
  submittedAt: string;
  answers: Record<string, string | string[]>;
  score: number;
  total: number;
  passed: boolean;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  personnelNumber: string;
  courseId: string;
  courseTitle: string;
  durationMinutes: number;
  score: number;
  total: number;
  issuedAt: string; // ISO
  validUntil?: string; // ISO (je nach Frequency)
  verificationCode: string;
}

export interface Badge {
  id: string;
  label: string;
  description: string;
  emoji: string;
  threshold: number; // Punkte oder Kurse
  kind: "points" | "courses" | "streak";
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  team?: string;
  points: number;
  coursesCompleted: number;
  rank: number;
}

export interface ComplianceStatus {
  userId: string;
  userName: string;
  role: Role;
  mandatoryCoursesTotal: number;
  mandatoryCoursesCompleted: number;
  nextDueDate?: string;
  state: "gruen" | "gelb" | "rot";
}
