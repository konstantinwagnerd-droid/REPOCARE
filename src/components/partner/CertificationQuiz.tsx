"use client";

import { useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explain: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Welche der folgenden Aussagen zur DSGVO-Konformität von CareAI ist korrekt?",
    options: [
      "CareAI hostet teilweise in den USA",
      "CareAI hostet ausschließlich bei Hetzner Falkenstein (DE)",
      "CareAI nutzt AWS eu-west-1 in Irland",
      "Hosting variiert je nach Kunde",
    ],
    correct: 1,
    explain: "CareAI hostet konsequent bei Hetzner in Falkenstein, Deutschland — keine Drittland-Datenübermittlung.",
  },
  {
    id: "q2",
    question: "Eine Einrichtung hat 45 Plätze. Welcher Plan passt am besten?",
    options: ["Starter", "Professional", "Enterprise", "Keiner — Custom-Angebot"],
    correct: 1,
    explain: "Professional gilt für 26–80 Plätze und ist bei 45 Plätzen der passende Plan.",
  },
  {
    id: "q3",
    question: "Wie lange wird die Provision je gewonnenem Deal gezahlt?",
    options: ["1 Monat", "3 Monate", "12 Monate", "Solange der Kunde bleibt"],
    correct: 2,
    explain: "Provisionen laufen über 12 Monate ab Go-Live des jeweiligen Deals.",
  },
];

export function CertificationQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = QUESTIONS.filter((q) => answers[q.id] === q.correct).length;
  const percent = Math.round((score / QUESTIONS.length) * 100);

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="space-y-6">
      {QUESTIONS.map((q, i) => (
        <div key={q.id} className="space-y-3">
          <p className="font-medium">
            {i + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === oi;
              const correct = submitted && oi === q.correct;
              const wrong = submitted && selected && oi !== q.correct;
              return (
                <label
                  key={oi}
                  className={
                    "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors " +
                    (correct
                      ? "border-primary bg-primary/5"
                      : wrong
                      ? "border-destructive bg-destructive/5"
                      : selected
                      ? "border-primary"
                      : "border-border hover:border-primary/50")
                  }
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={oi}
                    checked={selected}
                    onChange={() => !submitted && setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    disabled={submitted}
                    className="mt-0.5"
                  />
                  <span className="flex-1">{opt}</span>
                  {correct && <Check className="mt-0.5 size-4 text-primary" aria-hidden="true" />}
                  {wrong && <X className="mt-0.5 size-4 text-destructive" aria-hidden="true" />}
                </label>
              );
            })}
          </div>
          {submitted && (
            <p className="rounded-xl bg-muted/50 p-3 text-xs">
              <strong>Erklärung:</strong> {q.explain}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <Button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < QUESTIONS.length}
        >
          Auswerten
        </Button>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
          <div>
            <div className="font-semibold">
              {percent} % richtig ({score} von {QUESTIONS.length})
            </div>
            <div className="text-sm text-muted-foreground">
              {percent >= 80 ? "Wärst bestanden!" : "Noch nicht ganz — im echten Quiz zählen 80 %."}
            </div>
          </div>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="size-4" /> Neu
          </Button>
        </div>
      )}
    </div>
  );
}
