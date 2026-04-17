"use client";

import { useState } from "react";
import type { Question, QuizModule } from "@/lib/lms/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizResultView {
  score: number;
  total: number;
  passed: boolean;
  percentage: number;
  passThreshold: number;
  graded: Array<{
    questionId: string;
    correct: boolean;
    awardedPoints: number;
    maxPoints: number;
    explanation?: string;
    userAnswer: string | string[];
    correctAnswer?: string | string[];
  }>;
  certificateId?: string;
}

export function QuizPlayer({
  quiz,
  courseId,
  moduleId,
  enrollmentId,
  onCompleted,
}: {
  quiz: QuizModule;
  courseId: string;
  moduleId: string;
  enrollmentId: string;
  onCompleted?: (result: QuizResultView) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResultView | null>(null);

  const q = quiz.questions[idx];
  const isLast = idx === quiz.questions.length - 1;

  function setAnswer(id: string, value: string | string[]) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/lms/quiz/${quiz.id}/submit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ courseId, moduleId, enrollmentId, answers }),
      });
      const data = (await res.json()) as QuizResultView;
      setResult(data);
      onCompleted?.(data);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return <QuizResult quiz={quiz} result={result} />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Frage {idx + 1} von {quiz.questions.length}
        </CardTitle>
        <div className="flex items-center gap-1">
          {quiz.questions.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-6 rounded-full",
                i < idx || answers[quiz.questions[i].id] !== undefined ? "bg-primary" : "bg-muted",
              )}
              aria-hidden
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-lg font-medium">{q.text}</p>
          <p className="mt-1 text-xs text-muted-foreground">{q.points} Punkte</p>
        </div>

        {q.type === "mc" && <MCAnswer q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />}
        {q.type === "freitext" && (
          <Textarea
            rows={5}
            value={(answers[q.id] as string) ?? ""}
            onChange={(e) => setAnswer(q.id, e.target.value)}
            placeholder="Ihre Antwort…"
            aria-label={q.text}
          />
        )}
        {q.type === "matching" && q.matchingPairs && (
          <MatchingAnswer pairs={q.matchingPairs} value={(answers[q.id] as string) ?? ""} onChange={(v) => setAnswer(q.id, v)} />
        )}
        {q.type === "hotspot" && (
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            Hotspot-Frage: Klicken Sie auf die korrekte Stelle (Demo-Modus — keine Abbildung hinterlegt).
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Zurück
          </Button>
          {!isLast ? (
            <Button onClick={() => setIdx((i) => Math.min(quiz.questions.length - 1, i + 1))}>
              Weiter <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting}>
              {submitting ? "Auswertung…" : "Quiz einreichen"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MCAnswer({
  q,
  value,
  onChange,
}: {
  q: Question;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
}) {
  const opts = q.options ?? [];
  const correctCount = opts.filter((o) => o.correct).length;
  const isMulti = correctCount > 1;
  const selected = Array.isArray(value) ? value : value ? [value as string] : [];
  function toggle(id: string) {
    if (isMulti) {
      onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
    } else {
      onChange([id]);
    }
  }
  return (
    <fieldset className="space-y-2">
      <legend className="sr-only">{q.text}</legend>
      {isMulti && (
        <p className="text-xs text-muted-foreground">
          Mehrfachauswahl möglich ({correctCount} korrekte Antworten)
        </p>
      )}
      {opts.map((o) => {
        const on = selected.includes(o.id);
        return (
          <label
            key={o.id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors",
              on ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30",
            )}
          >
            <input
              type={isMulti ? "checkbox" : "radio"}
              name={q.id}
              className="mt-1"
              checked={on}
              onChange={() => toggle(o.id)}
            />
            <span>{o.text}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

function MatchingAnswer({
  pairs,
  value,
  onChange,
}: {
  pairs: { left: string; right: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const parsed: Record<string, string> = value ? JSON.parse(value) : {};
  const rights = [...new Set(pairs.map((p) => p.right))];
  return (
    <div className="space-y-2">
      {pairs.map((p) => (
        <div key={p.left} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 text-sm">
          <span>{p.left}</span>
          <select
            className="rounded-lg border border-border bg-background px-2 py-1 text-sm"
            value={parsed[p.left] ?? ""}
            onChange={(e) => {
              parsed[p.left] = e.target.value;
              onChange(JSON.stringify(parsed));
            }}
            aria-label={`Zuordnung für ${p.left}`}
          >
            <option value="">—</option>
            {rights.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

function QuizResult({ quiz, result }: { quiz: QuizModule; result: QuizResultView }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {result.passed ? (
            <>
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <span className="text-emerald-700">Bestanden!</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-6 w-6 text-amber-600" />
              <span className="text-amber-700">Leider nicht bestanden</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-serif text-3xl font-semibold">
                {result.score} / {result.total}
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(result.percentage * 100)} % — Bestehensgrenze {Math.round(result.passThreshold * 100)} %
              </div>
            </div>
            {result.passed && result.certificateId && (
              <a
                href={`/api/lms/certificates/${result.certificateId}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Zertifikat öffnen
              </a>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-lg font-semibold">Auswertung</h3>
          {result.graded.map((g, i) => {
            const q = quiz.questions.find((qq) => qq.id === g.questionId)!;
            return (
              <div key={g.questionId} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {g.correct ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        Frage {i + 1}
                      </span>
                    </div>
                    <p className="mt-1 font-medium">{q.text}</p>
                    {g.explanation && (
                      <p className="mt-2 rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
                        <span className="font-semibold">Erklärung: </span>
                        {g.explanation}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-serif text-lg font-semibold">
                      {g.awardedPoints} / {g.maxPoints}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!result.passed && (
          <Button onClick={() => window.location.reload()}>Erneut versuchen</Button>
        )}
      </CardContent>
    </Card>
  );
}
