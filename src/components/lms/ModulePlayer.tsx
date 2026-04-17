"use client";

import { useEffect, useState } from "react";
import type { Course, CourseModule, ReflexionModule, TextModule, VideoModule } from "@/lib/lms/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { BookOpenCheck, Play, FileText, MessageSquare, CheckCircle2, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { QuizPlayer } from "./QuizPlayer";
import { cn } from "@/lib/utils";

export function ModulePlayer({
  course,
  enrollmentId,
  initialIndex = 0,
  initialProgress = {},
}: {
  course: Course;
  enrollmentId: string;
  initialIndex?: number;
  initialProgress?: Record<string, boolean>;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const [completed, setCompleted] = useState<Record<string, boolean>>(initialProgress);
  const mod = course.modules[idx];

  async function markCompleted(moduleId: string) {
    setCompleted((c) => ({ ...c, [moduleId]: true }));
    await fetch(`/api/lms/courses/${course.id}/progress`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enrollmentId, moduleId }),
    }).catch(() => {});
  }

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = Math.round((completedCount / course.modules.length) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <span>Modul {idx + 1} / {course.modules.length}</span>
          <span aria-hidden>·</span>
          <span>{mod.estimatedMinutes} Min</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <ModuleIcon kind={mod.kind} /> {kindLabel(mod.kind)}
          </span>
        </div>
        <h2 className="font-serif text-3xl font-semibold">{mod.title}</h2>
        <Progress value={progress} aria-label={`Kursfortschritt ${progress}%`} />

        {mod.kind === "text" && <TextView mod={mod} />}
        {mod.kind === "video" && <VideoView mod={mod} />}
        {mod.kind === "reflexion" && (
          <ReflexionView
            mod={mod}
            courseId={course.id}
            enrollmentId={enrollmentId}
            onSubmit={() => markCompleted(mod.id)}
          />
        )}
        {mod.kind === "quiz" && (
          <QuizPlayer
            quiz={mod}
            courseId={course.id}
            moduleId={mod.id}
            enrollmentId={enrollmentId}
            onCompleted={(r) => {
              if (r.passed) markCompleted(mod.id);
            }}
          />
        )}

        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Zurück
          </Button>
          <div className="flex items-center gap-2">
            {mod.kind !== "quiz" && mod.kind !== "reflexion" && !completed[mod.id] && (
              <Button variant="secondary" onClick={() => markCompleted(mod.id)}>
                <CheckCircle2 className="mr-1 h-4 w-4" /> Als gelesen markieren
              </Button>
            )}
            <Button
              disabled={idx === course.modules.length - 1}
              onClick={() => setIdx((i) => Math.min(course.modules.length - 1, i + 1))}
            >
              Weiter <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Module
            </h3>
            <ol className="space-y-1">
              {course.modules.map((m, i) => {
                const done = completed[m.id];
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => setIdx(i)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm",
                        i === idx ? "bg-primary/10 text-primary" : "hover:bg-muted/40",
                      )}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-[10px]">
                        {done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : i + 1}
                      </span>
                      <span className="flex-1 truncate">{m.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <NotesPanel courseId={course.id} enrollmentId={enrollmentId} />
      </aside>
    </div>
  );
}

function ModuleIcon({ kind }: { kind: CourseModule["kind"] }) {
  if (kind === "text") return <FileText className="h-3.5 w-3.5" />;
  if (kind === "video") return <Play className="h-3.5 w-3.5" />;
  if (kind === "quiz") return <BookOpenCheck className="h-3.5 w-3.5" />;
  return <MessageSquare className="h-3.5 w-3.5" />;
}
function kindLabel(k: CourseModule["kind"]) {
  return { text: "Lektion", video: "Video", quiz: "Quiz", reflexion: "Reflexion" }[k];
}

function TextView({ mod }: { mod: TextModule }) {
  const html = markdownToHtml(mod.body);
  return (
    <Card>
      <CardContent className="prose prose-sm max-w-none p-6 dark:prose-invert prose-headings:font-serif prose-h1:text-2xl prose-h2:text-xl">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </CardContent>
    </Card>
  );
}

function VideoView({ mod }: { mod: VideoModule }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white">
          <div className="text-center">
            <Play className="mx-auto h-12 w-12" />
            <p className="mt-2 text-sm opacity-80">Video-Stub — {Math.round(mod.durationSeconds / 60)} Min</p>
          </div>
        </div>
        <details className="mt-4 rounded-xl border border-border p-4">
          <summary className="cursor-pointer text-sm font-semibold">Transkript anzeigen</summary>
          <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{mod.transcript}</p>
        </details>
      </CardContent>
    </Card>
  );
}

function ReflexionView({
  mod,
  courseId,
  enrollmentId,
  onSubmit,
}: {
  mod: ReflexionModule;
  courseId: string;
  enrollmentId: string;
  onSubmit: () => void;
}) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const minWords = mod.minWords ?? 50;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const ok = wordCount >= minWords;

  async function save() {
    await fetch(`/api/lms/courses/${courseId}/reflection`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enrollmentId, moduleId: mod.id, text }),
    }).catch(() => {});
    setDone(true);
    onSubmit();
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="rounded-xl bg-primary/5 p-4 text-sm">
          <p className="font-semibold">Reflexionsfrage</p>
          <p className="mt-1">{mod.prompt}</p>
        </div>
        <Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ihre Antwort…" aria-label={mod.prompt} />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className={ok ? "text-emerald-600" : ""}>
            {wordCount} / mind. {minWords} Wörter
          </span>
          <Button disabled={!ok || done} onClick={save}>
            {done ? "Gespeichert" : "Reflexion abschließen"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NotesPanel({ courseId, enrollmentId }: { courseId: string; enrollmentId: string }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    const key = `careai-lms-notes-${courseId}`;
    const cached = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (cached) setText(cached);
  }, [courseId]);

  async function save() {
    setSaved("saving");
    const key = `careai-lms-notes-${courseId}`;
    window.localStorage.setItem(key, text);
    await fetch(`/api/lms/courses/${courseId}/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enrollmentId, text }),
    }).catch(() => {});
    setSaved("saved");
    setTimeout(() => setSaved("idle"), 1500);
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Notizen
          </h3>
          <Bookmark className="h-4 w-4 text-muted-foreground" />
        </div>
        <Textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Persönliche Lernnotizen…"
          aria-label="Lernnotizen"
        />
        <Button size="sm" className="mt-2 w-full" variant="outline" onClick={save}>
          {saved === "saving" ? "Speichert…" : saved === "saved" ? "Gespeichert" : "Notizen speichern"}
        </Button>
      </CardContent>
    </Card>
  );
}

// Minimaler Markdown-Renderer (Überschriften, Listen, Tabellen, Absätze).
function markdownToHtml(md: string): string {
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // Tabellen
  html = html.replace(/((?:^\|.+\|\s*\n)+)/gm, (block) => {
    const lines = block.trim().split(/\n/);
    const rows = lines.map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
    if (rows.length < 2) return block;
    // zweite Zeile ist separator
    const head = rows[0];
    const body = rows.slice(2);
    const th = head.map((h) => `<th class="border border-border px-2 py-1 text-left">${h}</th>`).join("");
    const tr = body
      .map(
        (r) =>
          `<tr>${r
            .map((c) => `<td class="border border-border px-2 py-1">${c}</td>`)
            .join("")}</tr>`,
      )
      .join("");
    return `<table class="my-3 w-full border-collapse text-sm"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
  });
  html = html
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
  // Listen
  html = html.replace(/(^|\n)((?:[-*] .+(?:\n|$))+)/g, (_m, pre, block) => {
    const items = block
      .trim()
      .split(/\n/)
      .map((l: string) => `<li>${l.replace(/^[-*]\s+/, "")}</li>`)
      .join("");
    return `${pre}<ul>${items}</ul>`;
  });
  html = html.replace(/(^|\n)((?:\d+\. .+(?:\n|$))+)/g, (_m, pre, block) => {
    const items = block
      .trim()
      .split(/\n/)
      .map((l: string) => `<li>${l.replace(/^\d+\.\s+/, "")}</li>`)
      .join("");
    return `${pre}<ol>${items}</ol>`;
  });
  // Absätze
  html = html
    .split(/\n{2,}/)
    .map((p) => (p.match(/^\s*<(h\d|ul|ol|table)/) ? p : `<p>${p.replace(/\n/g, "<br/>")}</p>`))
    .join("\n");
  return html;
}
