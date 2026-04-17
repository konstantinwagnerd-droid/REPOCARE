import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Chi siamo", alternates: { canonical: "/it/chi-siamo", languages: { "de-DE": "/ueber-uns", "en-US": "/en/about", "fr-FR": "/fr/a-propos", "it-IT": "/it/chi-siamo", "es-ES": "/es/sobre-nosotros" } } };

export default function ItAboutPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Chi siamo</Badge>
      <h1 className="font-serif text-5xl font-semibold">Creato da chi conosce la cura.</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="prose prose-slate max-w-none">
          <p>CareAI è stata fondata a Vienna nel 2024 da un team di operatori sanitari, ingegneri ed eticisti stanchi di vedere buoni professionisti lasciare la professione a causa della burocrazia.</p>
          <p>La nostra missione è semplice: restituire agli operatori il tempo per cui hanno scelto questo lavoro — il tempo con le persone. Con un&apos;IA che lavora in silenzio, senza mai sostituire il giudizio umano.</p>
          <h2>Principi</h2>
          <ul>
            <li><strong>Human-in-the-loop di default.</strong> Ogni output IA è confermato da un operatore formato.</li>
            <li><strong>Hosting solo DACH.</strong> I dati dei residenti non lasciano mai l&apos;UE.</li>
            <li><strong>Standard aperti.</strong> HL7 FHIR, SAML — nessun lock-in.</li>
            <li><strong>Accessibile ai piccoli fornitori.</strong> Il tier Starter esiste perché non tutti hanno 200 posti letto.</li>
          </ul>
        </div>
        <div className="space-y-3">
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Fondata</p><p className="text-2xl font-semibold">2024</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Sede</p><p className="text-2xl font-semibold">Vienna, AT</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Team</p><p className="text-2xl font-semibold">14</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Posti letto</p><p className="text-2xl font-semibold">2.400+</p></CardContent></Card>
        </div>
      </div>
    </div>
  );
}
