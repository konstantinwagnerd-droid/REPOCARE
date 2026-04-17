import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COURSES } from "@/lib/lms/courses";
import { db } from "@/lib/lms/store";
import { Plus, Edit, Archive, BookOpen } from "lucide-react";
import { frequencyLabel } from "@/lib/lms/scheduler";

export default function AdminKursePage() {
  const d = db();
  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Kurse</h1>
          <p className="mt-1 text-muted-foreground">
            {COURSES.length} Kurse insgesamt · {COURSES.filter((c) => c.published).length} aktiv
          </p>
        </div>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> Neuer Kurs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Alle Kurse
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2">Kurs</th>
                <th>Kategorie</th>
                <th>Rollen</th>
                <th>Dauer</th>
                <th>Gültigkeit</th>
                <th>Module</th>
                <th>Abschlüsse</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {COURSES.map((c) => {
                const completions = d.certificates.filter((cert) => cert.courseId === c.id).length;
                return (
                  <tr key={c.id} className="border-t border-border">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl" aria-hidden>{c.thumbnailEmoji}</span>
                        <div>
                          <div className="font-semibold">{c.title}</div>
                          <div className="text-xs text-muted-foreground">{c.shortDescription.slice(0, 60)}…</div>
                        </div>
                      </div>
                    </td>
                    <td className="capitalize">{c.category}</td>
                    <td className="text-xs">{c.targetRoles.join(", ")}</td>
                    <td>{c.durationMinutes} Min</td>
                    <td>{frequencyLabel(c.validity)}</td>
                    <td>{c.modules.length}</td>
                    <td>{completions}</td>
                    <td>
                      <Badge variant={c.published ? "success" : "outline"}>
                        {c.published ? "Aktiv" : "Entwurf"}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Archive className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kurs-Editor (Vorschau)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Der Editor erlaubt: Metadaten (Titel, Beschreibung, Kategorie, Dauer, Gültigkeit, Sprache, Zielgruppe) · Module hinzufügen
            (Text / Video-Stub / Quiz / Reflexion mit Reihenfolge) · Quiz-Editor (Multiple-Choice mit 1–5 korrekten, Freitext, Hotspot,
            Matching) · Veröffentlichen mit Zielgruppen-Zuweisung.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Text-Modul", d: "Markdown, Bilder, Tabellen" },
              { k: "Video-Stub", d: "Poster + Transkript" },
              { k: "Quiz", d: "MC, Freitext, Hotspot, Matching" },
              { k: "Reflexion", d: "Offene Frage, Wort-Minimum" },
            ].map((x) => (
              <div key={x.k} className="rounded-xl border border-dashed border-border p-4 text-sm">
                <div className="font-serif font-semibold">{x.k}</div>
                <div className="mt-1 text-xs text-muted-foreground">{x.d}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
