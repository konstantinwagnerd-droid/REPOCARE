import { NextResponse } from "next/server";
import { findCourse } from "@/lib/lms/courses";
import { gradeQuiz, makeAttemptRecord } from "@/lib/lms/grader";
import { completeEnrollment, db, DEMO_CURRENT_USER, setModuleCompleted } from "@/lib/lms/store";
import { createCertificate } from "@/lib/lms/certificate";
import type { QuizModule } from "@/lib/lms/types";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: quizId } = await params;
  const body = (await req.json()) as {
    courseId: string;
    moduleId: string;
    enrollmentId: string;
    answers: Record<string, string | string[]>;
  };

  const course = findCourse(body.courseId);
  if (!course) return NextResponse.json({ error: "course_not_found" }, { status: 404 });
  const quiz = course.modules.find((m) => m.id === quizId && m.kind === "quiz") as QuizModule | undefined;
  if (!quiz) return NextResponse.json({ error: "quiz_not_found" }, { status: 404 });

  const result = gradeQuiz(quiz, body.answers);
  const attempt = makeAttemptRecord(body.enrollmentId, quiz.id, body.answers, result);
  const d = db();
  d.attempts.push(attempt);

  // Progress für dieses Quiz-Modul markieren
  setModuleCompleted(body.enrollmentId, quiz.id);

  let certificateId: string | undefined;
  if (quiz.isFinal && result.passed) {
    completeEnrollment(body.enrollmentId, result.score, true);
    const cert = createCertificate({
      userId: DEMO_CURRENT_USER.id,
      userName: DEMO_CURRENT_USER.name,
      personnelNumber: DEMO_CURRENT_USER.personnelNumber,
      course,
      score: result.score,
      total: result.total,
    });
    d.certificates.push(cert);
    certificateId = cert.id;
  }

  return NextResponse.json({
    ...result,
    certificateId,
  });
}
