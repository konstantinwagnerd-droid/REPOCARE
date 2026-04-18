/**
 * /app/vorlagen/[slug] — Template-Vorschau + Ausfüllen für eine:n Bewohner:in.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTemplate, extractPlaceholders, fillTemplate } from "@/lib/templates";
import { renderMarkdown } from "@/lib/content/markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, ArrowLeft, Printer } from "lucide-react";

export default async function TemplateDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ resident?: string; mode?: string }>;
}) {
  const { slug: slugRaw } = await params;
  const sp = await searchParams;
  const slug = decodeURIComponent(slugRaw);
  const tpl = getTemplate(slug);
  if (!tpl) notFound();

  const session = await auth();
  const tenantId = session?.user?.tenantId;
  const residentsList = tenantId
    ? await db.select({ id: residents.id, fullName: residents.fullName }).from(residents).where(eq(residents.tenantId, tenantId)).limit(50)
    : [];

  const selectedResidentId = sp.resident;
  let filledBody = tpl.body;
  let resident: { id: string; fullName: string } | null = null;
  if (selectedResidentId) {
    const r = residentsList.find((x) => x.id === selectedResidentId) ?? null;
    resident = r;
    if (r) {
      const [vorname, ...rest] = (r.fullName ?? "").split(" ");
      filledBody = fillTemplate(tpl.body, {
        "resident.name": r.fullName,
        "resident.vorname": vorname,
        "resident.nachname": rest.join(" "),
        "einrichtung.name": "",
        datum: new Date().toISOString().slice(0, 10),
        autor: session?.user?.name ?? "",
        "autor.name": session?.user?.name ?? "",
      });
    }
  }

  const placeholders = extractPlaceholders(tpl.body);
  const { html } = renderMarkdown(filledBody);

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <nav className="text-sm text-muted-foreground">
        <Link href="/app/vorlagen" className="inline-flex items-center gap-1 hover:text-primary">
          <ArrowLeft className="h-3 w-3" /> Alle Vorlagen
        </Link>
      </nav>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge variant="secondary">{tpl.jurisdiction.toUpperCase()}</Badge>
            <Badge variant="outline">{tpl.category}</Badge>
            {tpl.applicable_to.map((a) => (
              <Badge key={a} variant="outline" className="text-xs">
                {a}
              </Badge>
            ))}
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">{tpl.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <strong>Rechtsgrundlage:</strong> {tpl.legal_reference} · <strong>Stand:</strong> {tpl.version_date}
          </p>
          {tpl.source_url && (
            <p className="mt-1 text-sm">
              <a
                href={tpl.source_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Offizielle Quelle <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          )}
        </div>
        <form className="flex flex-wrap items-end gap-2" method="get">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Ausfüllen für Bewohner:in</span>
            <select name="resident" defaultValue={selectedResidentId ?? ""} className="rounded border bg-background px-3 py-2 min-w-[16rem]">
              <option value="">— Vorschau ohne Vorbefüllung —</option>
              {residentsList.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.fullName}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" variant="default">
            <FileText className="mr-1 h-4 w-4" /> Ausfüllen
          </Button>
        </form>
      </header>

      {resident && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4 text-sm">
          <span>
            Vorbefüllt für <strong>{resident.fullName}</strong>. Unbefüllte Felder erscheinen als{" "}
            <code className="rounded bg-background px-1">__feldname__</code>.
          </span>
          <Button variant="outline" asChild>
            <Link href={`/app/vorlagen/${encodeURIComponent(slug)}/print?resident=${resident.id}`} target="_blank">
              <Printer className="mr-1 h-4 w-4" /> Druckansicht
            </Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
        <Card>
          <CardContent className="prose prose-sm max-w-none pt-6 dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Platzhalter ({placeholders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-xs font-mono text-muted-foreground">
                {placeholders.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {tpl.assessment_tool && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assessment-Instrument</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{tpl.assessment_tool}</p>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
