/**
 * /app/vorlagen — Katalog offizieller DACH-Pflegedokument-Vorlagen.
 *
 * Pflegekräfte können jedes Template durchblättern, filtern (Jurisdiction,
 * Kategorie, Suche), Vorschau sehen und für eine:n Bewohner:in ausfüllen.
 *
 * Recherche-Hintergrund: docs/research/dach-templates.md
 */
import Link from "next/link";
import { loadAllTemplates, uniqueCategories, type Template } from "@/lib/templates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, FileText, Shield, Stamp, ArrowRight } from "lucide-react";

export const dynamic = "force-static";

const JURISDICTION_LABEL: Record<string, string> = {
  at: "Österreich",
  de: "Deutschland",
  shared: "DACH",
};

const CATEGORY_LABEL: Record<string, string> = {
  pflegegeld: "Pflegegeld-Antrag",
  sis: "Strukturierte Informationssammlung",
  strukturmodell: "Strukturmodell / SIS",
  einzug: "Einzug & Rechtsdokumente",
  nqz: "NQZ-Qualitätszertifikat",
  abrechnung: "Abrechnung",
  expertenstandards: "DNQP Expertenstandards",
  "md-pruefung": "MD-Qualitätsprüfung",
  gefaehrdungsbeurteilung: "BGW Gefährdungsbeurteilung",
};

function TemplateCard({ t }: { t: Template }) {
  return (
    <Link href={`/app/vorlagen/${encodeURIComponent(t.slug)}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{JURISDICTION_LABEL[t.jurisdiction] ?? t.jurisdiction}</Badge>
            <Badge variant="outline">{CATEGORY_LABEL[t.category] ?? t.category}</Badge>
            {t.applicable_to.map((a) => (
              <Badge key={a} variant="outline" className="text-xs">
                {a}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-lg leading-snug group-hover:text-primary">{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">{t.legal_reference}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Stand {t.version_date}</span>
            <span className="inline-flex items-center gap-1 text-primary transition-transform group-hover:translate-x-0.5">
              Ansehen <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function VorlagenKatalogPage({ searchParams }: { searchParams: Promise<{ j?: string; c?: string; q?: string }> }) {
  return <VorlagenInner searchParams={searchParams} />;
}

async function VorlagenInner({ searchParams }: { searchParams: Promise<{ j?: string; c?: string; q?: string }> }) {
  const params = await searchParams;
  const all = loadAllTemplates();
  const byJurisdiction = {
    at: all.filter((t) => t.jurisdiction === "at"),
    de: all.filter((t) => t.jurisdiction === "de"),
    shared: all.filter((t) => t.jurisdiction === "shared"),
  };
  const cats = uniqueCategories();

  const filtered = all.filter((t) => {
    if (params.j && params.j !== "all" && t.jurisdiction !== params.j) return false;
    if (params.c && params.c !== "all" && t.category !== params.c) return false;
    if (params.q) {
      const s = params.q.toLowerCase();
      if (!t.title.toLowerCase().includes(s) && !t.body.toLowerCase().includes(s) && !t.legal_reference.toLowerCase().includes(s))
        return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Offizielle Pflege-Vorlagen</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {all.length} behördliche und fachverbandliche Dokumente aus Deutschland und Österreich.
            Ausfüllbar für Bewohner:innen, Export als PDF. Alle Quellen siehe{" "}
            <Link href="/docs/research/dach-templates" className="text-primary underline-offset-2 hover:underline">
              Recherche-Dossier
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary"><Shield className="mr-1 h-3 w-3" /> DSGVO-konform</Badge>
          <Badge variant="secondary"><Stamp className="mr-1 h-3 w-3" /> Rechtsgrundlage-belegt</Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase text-muted-foreground">Deutschland</p>
                <p className="text-2xl font-semibold">{byJurisdiction.de.length} Dokumente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase text-muted-foreground">Österreich</p>
                <p className="text-2xl font-semibold">{byJurisdiction.at.length} Dokumente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase text-muted-foreground">DACH-Shared</p>
                <p className="text-2xl font-semibold">{byJurisdiction.shared.length} Dokumente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <form className="flex flex-wrap items-end gap-4 rounded-lg border bg-muted/20 p-4" method="get">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Land</span>
          <select name="j" defaultValue={params.j ?? "all"} className="rounded border bg-background px-3 py-2">
            <option value="all">Alle</option>
            <option value="de">Deutschland</option>
            <option value="at">Österreich</option>
            <option value="shared">DACH-Shared</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Kategorie</span>
          <select name="c" defaultValue={params.c ?? "all"} className="rounded border bg-background px-3 py-2">
            <option value="all">Alle</option>
            {cats.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c] ?? c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Suche</span>
          <Input name="q" defaultValue={params.q ?? ""} placeholder="z.B. Dekubitus, SIS, Pflegegeld …" />
        </label>
        <button type="submit" className="rounded bg-primary px-4 py-2 text-primary-foreground">
          Filtern
        </button>
      </form>

      <section>
        <h2 className="mb-4 text-lg font-semibold">{filtered.length} Vorlagen gefunden</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <TemplateCard key={t.id} t={t} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">Keine Vorlagen mit diesen Filtern.</p>
        )}
      </section>
    </div>
  );
}
