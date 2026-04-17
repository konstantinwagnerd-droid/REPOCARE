import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = { title: "Contacto", alternates: { canonical: "/es/contacto", languages: { "de-DE": "/kontakt", "en-US": "/en/contact", "fr-FR": "/fr/contact", "it-IT": "/it/contatti", "es-ES": "/es/contacto" } } };

export default function EsContactPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Contacto</Badge>
      <h1 className="font-serif text-5xl font-semibold">Hablemos.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Reserva una demo de 20 minutos, solicita un piloto o simplemente haz una pregunta. Respondemos en un día hábil.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Card><CardContent className="p-6"><Mail className="h-5 w-5 text-primary" /><h2 className="mt-3 font-semibold">Email</h2><a href="mailto:hello@careai.at" className="mt-2 block text-primary">hello@careai.at</a></CardContent></Card>
        <Card><CardContent className="p-6"><Phone className="h-5 w-5 text-primary" /><h2 className="mt-3 font-semibold">Teléfono</h2><a href="tel:+4312345678" className="mt-2 block text-primary">+43 1 234 5678</a></CardContent></Card>
        <Card><CardContent className="p-6"><MapPin className="h-5 w-5 text-primary" /><h2 className="mt-3 font-semibold">Oficina</h2><p className="mt-2 text-sm text-muted-foreground">Praterstraße 1<br />1020 Viena, Austria</p></CardContent></Card>
      </div>
    </div>
  );
}
