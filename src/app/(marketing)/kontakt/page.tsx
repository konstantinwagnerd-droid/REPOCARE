import { PageHero } from "@/components/marketing/sections/page-hero";
import { SecondaryNav } from "@/components/marketing/sections/secondary-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "./form";

export const metadata = { title: "Kontakt — CareAI" };

export default function KontaktPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="Schreiben Sie uns. Wir lesen alles."
        description="Wir antworten werktags innerhalb eines Tages — bei dringenden Sicherheits-Meldungen auch am Wochenende."
      />
      <SecondaryNav active="/kontakt" />

      <section className="container py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardContent className="flex items-start gap-3 p-5">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">Innovative Solutions KI GmbH</div>
                  <div className="text-sm text-muted-foreground">
                    Schwarzenbergplatz 7/30
                    <br />
                    1030 Wien, Oesterreich
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-3 p-5">
                <Mail className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">E-Mail</div>
                  <a href="mailto:hallo@careai.app" className="text-sm text-muted-foreground hover:text-primary">
                    hallo@careai.app
                  </a>
                  <div className="text-xs text-muted-foreground">Sicherheit: security@careai.app</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-3 p-5">
                <Phone className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">Telefon</div>
                  <div className="text-sm text-muted-foreground">+43 1 234 56 78</div>
                  <div className="text-xs text-muted-foreground">Mo–Fr 09:00–17:00 CET</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-3 p-5">
                <Clock className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">Response-Zeiten</div>
                  <div className="text-sm text-muted-foreground">
                    Vertrieb: <strong>24h</strong>
                    <br />
                    Support (Pro): <strong>8h</strong>
                    <br />
                    Security-Incidents: <strong>1h</strong>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Karte */}
            <Card>
              <CardContent className="p-0">
                <div
                  aria-label="Karte mit Bueroadresse"
                  role="img"
                  className="relative h-56 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900 dark:to-primary-800"
                >
                  <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full opacity-40">
                    {[...Array(20)].map((_, i) => (
                      <line key={`h${i}`} x1="0" y1={i * 10} x2="400" y2={i * 10} stroke="currentColor" strokeWidth="0.5" className="text-primary-700" />
                    ))}
                    {[...Array(40)].map((_, i) => (
                      <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="200" stroke="currentColor" strokeWidth="0.5" className="text-primary-700" />
                    ))}
                  </svg>
                  <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="mt-2 rounded-lg bg-background px-2 py-1 text-xs shadow">
                      Schwarzenbergplatz 7/30, 1030 Wien
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
