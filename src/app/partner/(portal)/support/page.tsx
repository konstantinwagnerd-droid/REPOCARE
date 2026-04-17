import { redirect } from "next/navigation";
import { LifeBuoy, Phone, Mail, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getPartnerSession } from "@/components/partner/session";

export const metadata = { title: "Support" };

export default async function SupportPage() {
  const session = await getPartnerSession();
  if (!session) redirect("/partner/login");

  return (
    <div className="container max-w-4xl space-y-8 py-8">
      <header className="space-y-2">
        <Badge variant="outline">Support</Badge>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">Wir sind für dich da</h1>
        <p className="text-muted-foreground">
          Antwort-SLA: 1 Werktag. Für tagesaktuelle Abschlüsse ruf uns an.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="space-y-2 p-5">
            <Phone className="size-5 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">Partner-Telefon</h3>
            <p className="text-sm">+43 1 xxx xxxx</p>
            <p className="text-xs text-muted-foreground">Mo–Fr, 9–18 Uhr</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <Mail className="size-5 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">E-Mail</h3>
            <p className="text-sm">
              <a className="text-primary hover:underline" href="mailto:partner@careai.health">partner@careai.health</a>
            </p>
            <p className="text-xs text-muted-foreground">Antwort-SLA 24h werktags</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-5">
            <MessageCircle className="size-5 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">Slack-Channel</h3>
            <p className="text-sm">#careai-partner</p>
            <p className="text-xs text-muted-foreground">Live-Kommunikation</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold">
            <LifeBuoy className="size-5 text-primary" aria-hidden="true" />
            Ticket-Formular
          </h2>
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="sup-name">Dein Name</Label>
                <Input id="sup-name" defaultValue={session.contactName} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sup-type">Anliegen</Label>
                <select id="sup-type" className="flex h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
                  <option>Technische Frage</option>
                  <option>Deal-Beratung</option>
                  <option>Vertragsfrage</option>
                  <option>Provisions-Abrechnung</option>
                  <option>Zertifizierung</option>
                  <option>Sonstiges</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sup-subject">Betreff</Label>
              <Input id="sup-subject" placeholder="Kurz und konkret…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sup-msg">Nachricht</Label>
              <Textarea id="sup-msg" rows={5} placeholder="Problem, Kontext, gewünschtes Ergebnis…" />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Ticket erstellen</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
