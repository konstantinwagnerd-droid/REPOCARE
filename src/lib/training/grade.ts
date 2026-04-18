/**
 * Auswertung der Schulungs-Quizzes.
 *
 * Input: Fragen (mit korrekten Indizes) + Antworten (Map fragen-id -> gewaehlte Indizes)
 * Output: Score (0-100), passed boolean, per-Frage-Ergebnis.
 */

export type GradingQuestion = {
  id: string;
  type: "single" | "multi" | "truefalse";
  correctIndicesJson: number[];
  explanation: string | null;
};

export type GradingResult = {
  total: number;
  correct: number;
  score: number; // 0-100
  passed: boolean;
  perQuestion: { id: string; correct: boolean; explanation: string | null }[];
};

export function gradeAttempt(
  questions: GradingQuestion[],
  answers: Record<string, number[]>,
  passingScore: number,
): GradingResult {
  let correctCount = 0;
  const perQuestion: GradingResult["perQuestion"] = [];

  for (const q of questions) {
    const given = (answers[q.id] ?? []).slice().sort((a, b) => a - b);
    const expected = q.correctIndicesJson.slice().sort((a, b) => a - b);
    const isCorrect =
      given.length === expected.length && given.every((v, i) => v === expected[i]);
    if (isCorrect) correctCount += 1;
    perQuestion.push({ id: q.id, correct: isCorrect, explanation: q.explanation });
  }

  const total = questions.length;
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  return {
    total,
    correct: correctCount,
    score,
    passed: score >= passingScore,
    perQuestion,
  };
}
