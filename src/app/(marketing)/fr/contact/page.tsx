import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = { title: "Contact", alternates: { canonical: "/fr/contact", languages: { "de-DE": "/kontakt", "en-US": "/en/contact", "fr-FR": "/fr/contact", "it-IT": "/it/contatti", "es-ES": "/es/contacto" } } };

export default function FrContactPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Contact</Badge>
      <h1 className="font-serif text-5xl font-semibold">Parlons.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Réservez une démo de 20 minutes, demandez un pilote ou posez simplement une question. Réponse sous un jour ouvré.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Card><CardContent className="p-6"><Mail className="h-5 w-5 text-primary" /><h2 className="mt-3 font-semibold">Email</h2><a href="mailto:hello@careai.at" className="mt-2 block text-primary">hello@careai.at</a></CardContent></Card>
        <Card><CardContent className="p-6"><Phone className="h-5 w-5 text-primary" /><h2 className="mt-3 font-semibold">Téléphone</h2><a href="tel:+4312345678" className="mt-2 block text-primary">+43 1 234 5678</a></CardContent></Card>
        <Card><CardContent className="p-6"><MapPin className="h-5 w-5 text-primary" /><h2 className="mt-3 font-semibold">Bureau</h2><p className="mt-2 text-sm text-muted-foreground">Praterstraße 1<br />1020 Vienne, Autriche</p></CardContent></Card>
      </div>
    </div>
  );
}
