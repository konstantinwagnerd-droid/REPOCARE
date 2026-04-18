"use client";
/**
 * Schulungs-UI fuer Pflegekraefte.
 *
 * States:
 *  - "list"   -> Liste offener + absolvierter Module mit Faelligkeits-Badges
 *  - "quiz"   -> Einzelfrage-Runner mit Timer + Progress
 *  - "result" -> Auswertung + Link auf Zertifikat (falls bestanden)
 */

import { useEffect, useMemo, useState } from "react";

type ModuleRow = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  passingScore: number;
  durationMinutes: number;
  isMandatory: boolean;
  validityMonths: number;
  questionCount: number;
  lastAttemptAt: string | null;
};

type Question = {
  id: string;
  question: string;
  type: "single" | "multi" | "truefalse";
  optionsJson: string[];
  orderIndex: number;
};

type GradingPerQuestion = { id: string; correct: boolean; explanation: string | null };
type GradingResult = {
  total: number;
  correct: number;
  score: number;
  passed: boolean;
  perQuestion: GradingPerQuestion[];
};

const categoryLabel: Record<string, string> = {
  dnqp: "DNQP",
  hygiene: "Hygiene",
  btm: "BtM / Opiate",
  brandschutz: "Brandschutz",
  dsgvo: "DSGVO",
  custom: "Custom",
};

function dueInfo(lastAttemptAt: string | null, validityMonths: number) {
  if (!lastAttemptAt) return { status: "offen", label: "Noch nicht absolviert", color: "bg-amber-100 text-amber-900" };
  const last = new Date(lastAttemptAt);
  const due = new Date(last);
  due.setMonth(due.getMonth() + validityMonths);
  const days = Math.floor((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { status: "ueberfaellig", label: `Ueberfaellig seit ${-days} T.`, color: "bg-rose-100 text-rose-900" };
  if (days < 30) return { status: "bald", label: `Faellig in ${days} T.`, color: "bg-amber-100 text-amber-900" };
  return { status: "ok", label: `Gueltig bis ${due.toLocaleDateString("de-AT")}`, color: "bg-emerald-100 text-emerald-900" };
}

export function SchulungenClient() {
  const [view, setView] = useState<"list" | "quiz" | "result">("list");
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<ModuleRow | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [passingScore, setPassingScore] = useState(80);

  useEffect(() => {
    void loadModules();
  }, []);

  async function loadModules() {
    setLoading(true);
    try {
      const res = await fetch("/api/training/modules");
      const data = await res.json();
      setModules(data.modules ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function startQuiz(mod: ModuleRow) {
    const start = await fetch("/api/training/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId: mod.id }),
    });
    if (!start.ok) return;
    const { attemptId: aid } = await start.json();
    const qres = await fetch(`/api/training/modules/${mod.id}`);
    const qdata = await qres.json();
    setActiveModule(mod);
    setQuestions(qdata.questions ?? []);
    setAttemptId(aid);
    setAnswers({});
    setCurrentIdx(0);
    setStartedAt(Date.now());
    setView("quiz");
  }

  function toggleAnswer(qid: string, idx: number, type: Question["type"]) {
    setAnswers((prev) => {
      const current = prev[qid] ?? [];
      if (type === "single" || type === "truefalse") {
        return { ...prev, [qid]: [idx] };
      }
      return {
        ...prev,
        [qid]: current.includes(idx) ? current.filter((x) => x !== idx) : [...current, idx].sort(),
      };
    });
  }

  async function submit() {
    if (!attemptId) return;
    const res = await fetch("/api/training/attempt", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId, answers }),
    });
    const data = await res.json();
    setResult(data.result);
    setPassingScore(data.passingScore ?? 80);
    setCertificateId(data.certificateId ?? null);
    setView("result");
    void loadModules();
  }

  const timeLabel = useMemo(() => {
    if (view !== "quiz") return "";
    const secs = Math.floor((Date.now() - startedAt) / 1000);
    const mm = String(Math.floor(secs / 60)).padStart(2, "0");
    const ss = String(secs % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }, [view, startedAt]);

  // Re-render every second for timer
  useEffect(() => {
    if (view !== "quiz") return;
    const i = setInterval(() => setStartedAt((s) => s), 1000);
    return () => clearInterval(i);
  }, [view]);

  // --- List ---
  if (view === "list") {
    if (loading) return <div className="text-sm text-muted-foreground">Lade Schulungen…</div>;
    if (modules.length === 0) {
      return (
        <div className="rounded-lg border bg-white p-6 text-sm">
          Noch keine Module verfuegbar. Admin kann unter <a className="underline" href="/admin/schulungen">/admin/schulungen</a> Module anlegen
          oder via <code>/api/training/seed</code> die Pflicht-Module seeden.
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {modules.map((m) => {
          const due = dueInfo(m.lastAttemptAt, m.validityMonths);
          return (
            <div key={m.id} className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium">
                    {categoryLabel[m.category] ?? m.category}
                  </span>
                  <h3 className="font-semibold">{m.title}</h3>
                  {m.isMandatory && <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-900">Pflicht</span>}
                </div>
                {m.description && <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>}
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{m.questionCount} Fragen · {m.durationMinutes} Min · Bestehen ab {m.passingScore}%</span>
                  <span className={`rounded px-2 py-0.5 ${due.color}`}>{due.label}</span>
                </div>
              </div>
              <button
                onClick={() => void startQuiz(m)}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
              >
                Jetzt starten
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  // --- Quiz Runner ---
  if (view === "quiz" && activeModule) {
    const q = questions[currentIdx];
    if (!q) return null;
    const selected = answers[q.id] ?? [];
    const progress = Math.round(((currentIdx + 1) / questions.length) * 100);
    const isLast = currentIdx === questions.length - 1;
    const canNext = selected.length > 0;

    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{activeModule.title}</span>
          <span>Timer: {timeLabel}</span>
        </div>
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mb-3 text-xs text-muted-foreground">
          Frage {currentIdx + 1} / {questions.length}
        </div>
        <h2 className="mb-4 text-lg font-semibold">{q.question}</h2>
        <div className="space-y-2">
          {q.optionsJson.map((opt: string, idx: number) => {
            const active = selected.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleAnswer(q.id, idx, q.type)}
                className={`w-full rounded-md border px-4 py-3 text-left text-sm transition-all ${
                  active ? "border-emerald-600 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <span className="mr-2 font-medium">{String.fromCharCode(65 + idx)})</span>
                {opt}
              </button>
            );
          })}
        </div>
        {q.type === "multi" && (
          <p className="mt-2 text-xs text-muted-foreground">Mehrfachauswahl moeglich.</p>
        )}
        <div className="mt-6 flex justify-between">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
          >
            Zurueck
          </button>
          {isLast ? (
            <button
              disabled={!canNext}
              onClick={() => void submit()}
              className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Auswerten
            </button>
          ) : (
            <button
              disabled={!canNext}
              onClick={() => setCurrentIdx((i) => i + 1)}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Weiter
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- Result ---
  if (view === "result" && result && activeModule) {
    return (
      <div className="space-y-4">
        <div
          className={`rounded-lg border p-6 shadow-sm ${
            result.passed ? "border-emerald-500 bg-emerald-50" : "border-rose-500 bg-rose-50"
          }`}
        >
          <h2 className="text-2xl font-semibold">
            {result.passed ? "Bestanden" : "Nicht bestanden"}
          </h2>
          <p className="mt-1 text-sm">
            {result.correct} von {result.total} richtig · Score {result.score}% · Bestehensgrenze {passingScore}%
          </p>
          {result.passed && certificateId && (
            <a
              href={`/app/schulungen/zertifikat/${certificateId}`}
              className="mt-3 inline-block rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Zertifikat anzeigen / drucken
            </a>
          )}
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-semibold">Erklaerungen</h3>
          <ol className="space-y-3 text-sm">
            {questions.map((q, idx) => {
              const pq = result.perQuestion.find((p) => p.id === q.id);
              return (
                <li key={q.id} className="border-b pb-2 last:border-b-0">
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                      pq?.correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                    }`}>
                      {pq?.correct ? "✓" : "✗"}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{idx + 1}. {q.question}</p>
                      {pq?.explanation && <p className="mt-1 text-muted-foreground">{pq.explanation}</p>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <button
          onClick={() => { setView("list"); setActiveModule(null); setResult(null); }}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Zurueck zur Uebersicht
        </button>
      </div>
    );
  }

  return null;
}
