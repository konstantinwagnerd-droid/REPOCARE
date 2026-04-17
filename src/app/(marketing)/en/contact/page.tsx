import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = { title: "Contact", alternates: { canonical: "/en/contact", languages: { "de-DE": "/kontakt", "en-US": "/en/contact" } } };

export default function EnContactPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Contact</Badge>
      <h1 className="font-serif text-5xl font-semibold">Let&apos;s talk.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Book a 20-minute demo, request a pilot, or just ask a question. We answer within one business day.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Card><CardContent className="p-6">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="mt-3 font-semibold">Email</h2>
          <a href="mailto:hello@careai.at" className="mt-2 block text-primary">hello@careai.at</a>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <Phone className="h-5 w-5 text-primary" />
          <h2 className="mt-3 font-semibold">Phone</h2>
          <a href="tel:+4312345678" className="mt-2 block text-primary">+43 1 234 5678</a>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="mt-3 font-semibold">Office</h2>
          <p className="mt-2 text-sm text-muted-foreground">Praterstraße 1<br />1020 Vienna, Austria</p>
        </CardContent></Card>
      </div>
    </div>
  );
}
