/**
 * /admin/vorlagen — Verwalter-Sicht auf die Template-Bibliothek.
 * Zeigt Anzahl je Jurisdiction/Kategorie, erlaubt Einrichtung-spezifische
 * Überblicks-Exporte.
 */
import Link from "next/link";
import { loadAllTemplates, uniqueCategories } from "@/lib/templates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";

export const dynamic = "force-static";

export default function AdminVorlagenPage() {
  const all = loadAllTemplates();
  const cats = uniqueCategories();

  const counts = {
    at: all.filter((t) => t.jurisdiction === "at").length,
    de: all.filter((t) => t.jurisdiction === "de").length,
    shared: all.filter((t) => t.jurisdiction === "shared").length,
  };

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Vorlagen-Bibliothek (Admin)</h1>
          <p className="mt-2 text-muted-foreground">
            {all.length} offizielle Pflegedokumente aus DACH. Recherche-Quellen:{" "}
            <Link href="/docs/research/dach-templates" className="text-primary underline-offset-2 hover:underline">
              docs/research/dach-templates.md
            </Link>
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/app/vorlagen">
            Zur Katalog-Ansicht <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Deutschland</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{counts.de}</p>
            <p className="text-xs text-muted-foreground">Dokumente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Österreich</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{counts.at}</p>
            <p className="text-xs text-muted-foreground">Dokumente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">DACH-Shared</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{counts.shared}</p>
            <p className="text-xs text-muted-foreground">Dokumente</p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Nach Kategorie</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat) => {
            const tpls = all.filter((t) => t.category === cat);
            return (
              <Card key={cat}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-primary" />
                    {cat}
                    <Badge variant="secondary">{tpls.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {tpls.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/app/vorlagen/${encodeURIComponent(t.slug)}`}
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          {t.title}
                        </Link>
                        <span className="ml-2 text-xs text-muted-foreground">{t.jurisdiction.toUpperCase()}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border bg-muted/10 p-4 text-sm text-muted-foreground">
        <strong>Eigene Templates hinzufügen:</strong> Markdown-Datei unter{" "}
        <code className="rounded bg-background px-1 font-mono">content/templates/&lt;country&gt;/&lt;category&gt;/slug.md</code> anlegen,
        YAML-Frontmatter (<code>id, title, jurisdiction, category, applicable_to, legal_reference, source_url, version_date</code>)
        ausfüllen, deployen. Nach Rebuild erscheint das Template automatisch im Katalog.
      </section>
    </div>
  );
}
