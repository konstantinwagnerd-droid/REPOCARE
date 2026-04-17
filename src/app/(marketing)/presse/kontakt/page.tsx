import Link from "next/link";
import { ArrowLeft, Mail, Phone, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PresseContactForm } from "@/components/presse/PresseContactForm";

export const metadata = {
  title: "Pressekontakt | Presse | CareAI",
  description:
    "Presse-Anfragen, Interviews, Hintergrundgespräche, Podcast-Termine — direkt zu CareAI.",
};

export default function PresseKontaktPage() {
  return (
    <div className="container max-w-4xl space-y-8 py-12">
      <Link
        href="/presse"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Zurück zum Presse-Hub
      </Link>

      <header className="space-y-3">
        <Badge variant="outline">Pressekontakt</Badge>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">
          Sprich direkt mit uns
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Wir melden uns in der Regel innerhalb von 24 Stunden werktags zurück.
          Für Druck- und Sendetermine bitte die Deadline nennen — wir richten uns ein.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[1fr_260px]">
        <div>
          <PresseContactForm />
        </div>
        <aside className="space-y-4">
          <Card>
            <CardContent className="space-y-3 p-5">
              <h2 className="font-serif text-lg font-semibold">Direktkontakt</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <a className="text-primary hover:underline" href="mailto:presse@careai.health">
                    presse@careai.health
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>+43 1 xxx xxxx<br />Mo–Fr 9–17 Uhr</span>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>CareAI GmbH<br />Wien, Österreich</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-5">
              <h2 className="font-serif text-lg font-semibold">Sprachen</h2>
              <p className="text-sm text-muted-foreground">
                Deutsch (Muttersprache) und Englisch. Französisch und Italienisch auf Anfrage.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
