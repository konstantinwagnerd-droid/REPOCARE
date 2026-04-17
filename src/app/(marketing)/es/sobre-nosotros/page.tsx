import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Sobre nosotros", alternates: { canonical: "/es/sobre-nosotros", languages: { "de-DE": "/ueber-uns", "en-US": "/en/about", "fr-FR": "/fr/a-propos", "it-IT": "/it/chi-siamo", "es-ES": "/es/sobre-nosotros" } } };

export default function EsAboutPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Sobre nosotros</Badge>
      <h1 className="font-serif text-5xl font-semibold">Hecho por gente que conoce el cuidado.</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="prose prose-slate max-w-none">
          <p>CareAI se fundó en Viena en 2024 por un equipo de cuidadores, ingenieros y especialistas en ética cansados de ver cómo buenas personas dejaban la profesión por culpa del papeleo.</p>
          <p>Nuestra misión es simple: devolver a los cuidadores el tiempo por el que eligieron esta profesión — tiempo con las personas. Lo hacemos con IA que trabaja en silencio, sin reemplazar nunca el juicio humano.</p>
          <h2>Principios</h2>
          <ul>
            <li><strong>Human-in-the-loop por defecto.</strong> Toda salida de IA es confirmada por un cuidador capacitado.</li>
            <li><strong>Alojamiento solo DACH.</strong> Los datos de los residentes nunca salen de la UE.</li>
            <li><strong>Estándares abiertos.</strong> HL7 FHIR, SAML — sin bloqueo.</li>
            <li><strong>Asequible para pequeños proveedores.</strong> El tier Starter existe porque no todos tienen 200 camas.</li>
          </ul>
        </div>
        <div className="space-y-3">
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Fundada</p><p className="text-2xl font-semibold">2024</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Sede</p><p className="text-2xl font-semibold">Viena, AT</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Equipo</p><p className="text-2xl font-semibold">14</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Camas atendidas</p><p className="text-2xl font-semibold">2.400+</p></CardContent></Card>
        </div>
      </div>
    </div>
  );
}
