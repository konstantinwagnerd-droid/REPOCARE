// LMS Quiz-Auswertung
import type { QuizModule, Question, QuizAttempt } from "./types";

export interface GradedQuestion {
  questionId: string;
  correct: boolean;
  awardedPoints: number;
  maxPoints: number;
  explanation?: string;
  userAnswer: string | string[];
  correctAnswer?: string | string[];
}

export interface GradeResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  passThreshold: number;
  graded: GradedQuestion[];
}

export function gradeQuiz(
  quiz: QuizModule,
  answers: Record<string, string | string[]>,
): GradeResult {
  const graded: GradedQuestion[] = quiz.questions.map((q) => gradeQuestion(q, answers[q.id]));
  const score = graded.reduce((s, g) => s + g.awardedPoints, 0);
  const total = quiz.questions.reduce((s, q) => s + q.points, 0);
  const percentage = total > 0 ? score / total : 0;
  return {
    score,
    total,
    percentage,
    passed: percentage >= quiz.passThreshold,
    passThreshold: quiz.passThreshold,
    graded,
  };
}

function gradeQuestion(q: Question, answer: string | string[] | undefined): GradedQuestion {
  if (q.type === "mc") {
    const opts = q.options ?? [];
    const correctIds = opts.filter((o) => o.correct).map((o) => o.id).sort();
    const user = Array.isArray(answer) ? [...answer].sort() : answer ? [answer].sort() : [];
    const ok =
      correctIds.length === user.length && correctIds.every((c, i) => c === user[i]);
    return {
      questionId: q.id,
      correct: ok,
      awardedPoints: ok ? q.points : 0,
      maxPoints: q.points,
      explanation: q.explanation,
      userAnswer: user,
      correctAnswer: correctIds,
    };
  }
  if (q.type === "freitext") {
    const text = (typeof answer === "string" ? answer : "").toLowerCase();
    const needed = q.expectedKeywords ?? [];
    const hits = needed.filter((kw) => text.includes(kw.toLowerCase())).length;
    const ratio = needed.length === 0 ? 1 : hits / needed.length;
    // Freitext: Teilpunkte nach Treffern (ab 60 % voll)
    const awarded = ratio >= 0.6 ? q.points : Math.round(q.points * ratio);
    return {
      questionId: q.id,
      correct: ratio >= 0.6,
      awardedPoints: awarded,
      maxPoints: q.points,
      explanation: q.explanation,
      userAnswer: typeof answer === "string" ? answer : "",
      correctAnswer: needed,
    };
  }
  if (q.type === "matching") {
    const pairs = q.matchingPairs ?? [];
    const user = (typeof answer === "string" ? JSON.parse(answer || "{}") : {}) as Record<string, string>;
    const hits = pairs.filter((p) => user[p.left] === p.right).length;
    const ratio = pairs.length === 0 ? 1 : hits / pairs.length;
    const awarded = Math.round(q.points * ratio);
    return {
      questionId: q.id,
      correct: ratio === 1,
      awardedPoints: awarded,
      maxPoints: q.points,
      explanation: q.explanation,
      userAnswer: JSON.stringify(user),
    };
  }
  if (q.type === "hotspot") {
    const parsed = typeof answer === "string" ? answer.split(",").map(Number) : [];
    const [x, y] = parsed;
    const ok =
      q.hotspot !== undefined &&
      Number.isFinite(x) &&
      Number.isFinite(y) &&
      Math.hypot(x - q.hotspot.correctX, y - q.hotspot.correctY) <= q.hotspot.tolerance;
    return {
      questionId: q.id,
      correct: !!ok,
      awardedPoints: ok ? q.points : 0,
      maxPoints: q.points,
      explanation: q.explanation,
      userAnswer: typeof answer === "string" ? answer : "",
    };
  }
  return {
    questionId: q.id,
    correct: false,
    awardedPoints: 0,
    maxPoints: q.points,
    userAnswer: "",
  };
}

export function makeAttemptRecord(
  enrollmentId: string,
  quizModuleId: string,
  answers: Record<string, string | string[]>,
  result: GradeResult,
): QuizAttempt {
  return {
    id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    enrollmentId,
    quizModuleId,
    submittedAt: new Date().toISOString(),
    answers,
    score: result.score,
    total: result.total,
    passed: result.passed,
  };
}
