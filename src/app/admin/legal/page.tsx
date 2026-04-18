import Link from "next/link";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PageContainer, PageHeader, PageSection,
} from "@/components/admin/page-shell";
import { Download, FileText, ShieldCheck, Edit3 } from "lucide-react";

export const metadata = { title: "Legal-Dokumente — Admin | CareAI" };

interface LegalDoc {
  slug: string;
  titel: string;
  beschreibung: string;
  version: string;
  stand: string;
  status: "Aktiv" | "Entwurf";
  kategorie: "Datenschutz" | "Vertrag" | "Audit" | "Abrechnung";
  hatPlatzhalter: boolean;
}

const DOCS: LegalDoc[] = [
  {
    slug: "datenschutz-1pager-de",
    titel: "Datenschutz-1-Pager (Deutschland)",
    beschreibung: "Überblick für PDL und DSB · druckbar · 1 Seite A4",
    version: "1.0",
    stand: "2026-04-18",
    status: "Aktiv",
    kategorie: "Datenschutz",
    hatPlatzhalter: false,
  },
  {
    slug: "datenschutz-1pager-at",
    titel: "Datenschutz-1-Pager (Österreich)",
    beschreibung: "Österreich-spezifisch · GuKG + DSB + ELGA-Hinweis",
    version: "1.0",
    stand: "2026-04-18",
    status: "Aktiv",
    kategorie: "Datenschutz",
    hatPlatzhalter: false,
  },
  {
    slug: "av-vertrag-entwurf",
    titel: "AV-Vertrag (Art. 28 DSGVO)",
    beschreibung: "Vollständiger Entwurf · 13 Paragraphen + 3 Anlagen",
    version: "1.0",
    stand: "2026-04-18",
    status: "Entwurf",
    kategorie: "Vertrag",
    hatPlatzhalter: true,
  },
  {
    slug: "dsfa-careai",
    titel: "Datenschutz-Folgenabschätzung",
    beschreibung: "DSFA nach Art. 35 DSGVO · 12 Risiken + Maßnahmen",
    version: "1.0",
    stand: "2026-04-18",
    status: "Aktiv",
    kategorie: "Datenschutz",
    hatPlatzhalter: true,
  },
  {
    slug: "tom-careai",
    titel: "TOM-Dokument",
    beschreibung: "Technische + Organisatorische Maßnahmen nach BayLDA-Matrix",
    version: "1.0",
    stand: "2026-04-18",
    status: "Aktiv",
    kategorie: "Datenschutz",
    hatPlatzhalter: false,
  },
  {
    slug: "subprocessors",
    titel: "Subprocessor-Liste",
    beschreibung: "Aktive Unter-Auftragsverarbeiter · öffentlich",
    version: "1.0",
    stand: "2026-04-18",
    status: "Aktiv",
    kategorie: "Datenschutz",
    hatPlatzhalter: false,
  },
  {
    slug: "abrechnung-krankenkassen",
    titel: "Krankenkassen-Abrechnung 1-Pager",
    beschreibung: "Wie CareAI mit Kassen abrechnet · für PDL-Verkaufsgespräch",
    version: "1.0",
    stand: "2026-04-18",
    status: "Aktiv",
    kategorie: "Abrechnung",
    hatPlatzhalter: false,
  },
];

const KATEGORIE_COLOR: Record<LegalDoc["kategorie"], string> = {
  Datenschutz: "bg-teal-100 text-teal-900",
  Vertrag: "bg-amber-100 text-amber-900",
  Audit: "bg-indigo-100 text-indigo-900",
  Abrechnung: "bg-emerald-100 text-emerald-900",
};

export default async function AdminLegalPage() {
  const session = await auth();
  const facility = session?.user?.tenantId
    ? encodeURIComponent("Einrichtung")
    : "CareAI Demo Einrichtung";

  return (
    <PageContainer>
      <PageHeader
        title="Legal-Dokumente"
        description="Datenschutz, Verträge, Abrechnungs-Info — prüfbereit für PDL, DSB und Heimaufsicht."
        icon={ShieldCheck}
      />

      <PageSection>
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">
          <ShieldCheck className="h-4 w-4" />
          Alle Dokumente werden mit CareAI-Hash (SHA-256) + QR-Verifikation signiert.
          Einrichtungs-Logo und Adresse werden automatisch in den Footer gesetzt.
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DOCS.map((doc) => (
            <Card key={doc.slug} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-teal-700" />
                      {doc.titel}
                    </div>
                  </CardTitle>
                  <Badge className={KATEGORIE_COLOR[doc.kategorie]}>{doc.kategorie}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <div>
                  <p className="text-sm text-neutral-600">{doc.beschreibung}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <span>v{doc.version}</span>
                    <span>·</span>
                    <span>Stand {doc.stand}</span>
                    <span>·</span>
                    <Badge variant={doc.status === "Aktiv" ? "default" : "outline"}>
                      {doc.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href={`/api/legal/${doc.slug}/pdf?facility=${facility}`}>
                      <Download className="mr-1 h-4 w-4" /> PDF
                    </Link>
                  </Button>
                  {doc.hatPlatzhalter && (
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/legal/${doc.slug}`}>
                        <Edit3 className="mr-1 h-4 w-4" /> Anpassen
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection heading="Versions-Historie">
        <Card>
          <CardContent className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-neutral-500">
                  <th className="py-2 pr-4">Dokument</th>
                  <th className="py-2 pr-4">Version</th>
                  <th className="py-2 pr-4">Datum</th>
                  <th className="py-2 pr-4">Änderung</th>
                </tr>
              </thead>
              <tbody>
                {DOCS.map((d) => (
                  <tr key={d.slug} className="border-b last:border-0">
                    <td className="py-2 pr-4">{d.titel}</td>
                    <td className="py-2 pr-4 font-mono text-xs">v{d.version}</td>
                    <td className="py-2 pr-4">{d.stand}</td>
                    <td className="py-2 pr-4 text-neutral-600">Initialversion</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageSection>
    </PageContainer>
  );
}
