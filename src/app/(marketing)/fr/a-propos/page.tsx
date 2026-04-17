import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "À propos", alternates: { canonical: "/fr/a-propos", languages: { "de-DE": "/ueber-uns", "en-US": "/en/about", "fr-FR": "/fr/a-propos", "it-IT": "/it/chi-siamo", "es-ES": "/es/sobre-nosotros" } } };

export default function FrAboutPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">À propos</Badge>
      <h1 className="font-serif text-5xl font-semibold">Créé par des gens du terrain.</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="prose prose-slate max-w-none">
          <p>CareAI a été fondée à Vienne en 2024 par une équipe de soignants, ingénieurs et éthiciens fatigués de voir de bonnes personnes quitter la profession à cause de la paperasse.</p>
          <p>Notre mission est simple : rendre aux soignants le temps pour lequel ils ont choisi ce métier — le temps avec les personnes. Nous le faisons avec une IA qui travaille en silence, sans jamais remplacer le jugement humain.</p>
          <h2>Principes</h2>
          <ul>
            <li><strong>Human-in-the-loop par défaut.</strong> Chaque sortie IA est confirmée par un soignant formé.</li>
            <li><strong>Hébergement DACH uniquement.</strong> Les données des résidents ne quittent jamais l&apos;UE.</li>
            <li><strong>Standards ouverts.</strong> HL7 FHIR, SAML — pas de verrouillage.</li>
            <li><strong>Abordable pour les petits prestataires.</strong> Le tier Starter existe parce que tout le monde n&apos;a pas 200 lits.</li>
          </ul>
        </div>
        <div className="space-y-3">
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Fondée</p><p className="text-2xl font-semibold">2024</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Siège</p><p className="text-2xl font-semibold">Vienne, AT</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Équipe</p><p className="text-2xl font-semibold">14</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Lits servis</p><p className="text-2xl font-semibold">2 400+</p></CardContent></Card>
        </div>
      </div>
    </div>
  );
}
