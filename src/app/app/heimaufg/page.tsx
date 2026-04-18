/**
 * HEIMaufG (AT) — Bonus-Feature fuer AT-Markt (MUST-AT)
 *
 * Heimaufenthaltsgesetz §3-§5 Oesterreich: Bei JEDER Freiheitsbeschraenkung
 * (mechanisch / medikamentoes / psychisch) muss Bewohnervertretung (VertretungsNetz)
 * unverzueglich verstaendigt werden + gelinderes Mittel begruendet.
 *
 * Quelle: HeimAufG BGBl I 11/2004 idF, vertretungsnetz.at.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Scale } from "lucide-react";

export default function HeimaufgPage() {
  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">HEIMaufG — Freiheitsbeschraenkungen</h1>
          <p className="mt-1 text-muted-foreground">AT-Pflichtmeldung an Bewohnervertretung (VertretungsNetz).</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="danger"><Scale className="mr-1 h-3 w-3" /> Nur AT</Badge>
          <Badge variant="outline">HeimAufG §3-5</Badge>
        </div>
      </div>

      <Card className="border-amber-300 bg-amber-50/40 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
            <AlertCircle className="h-5 w-5" /> Rechtlicher Hinweis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-900/90 dark:text-amber-100/90">
          <p>
            Eine Freiheitsbeschraenkung liegt vor, wenn die Ortsveraenderung einer Person ohne deren Willen
            unterbunden wird. Dies umfasst <b>mechanische</b> (Gurt, Bettgitter beidseitig, versperrte Tuer),
            <b> medikamentoese</b> (Sedierung ohne therap. Indikation) und <b>psychische</b> (Drohung) Mittel.
            Die Bewohnervertretung (VertretungsNetz) ist unverzueglich zu verstaendigen.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Neue Meldung erfassen</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Art der Beschraenkung</Label>
            <select className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option>Mechanisch — Bettgitter beidseitig</option>
              <option>Mechanisch — Bauchgurt</option>
              <option>Mechanisch — Therapietisch</option>
              <option>Mechanisch — Versperrte Stationstuer</option>
              <option>Medikamentoes — Sedativa ohne therap. Indikation</option>
              <option>Psychisch — Androhung</option>
            </select>
          </div>

          <div>
            <Label>Begruendung / Gefaehrdungslage</Label>
            <Textarea rows={3} placeholder="z.B. rezidivierende Stuerze aus dem Bett trotz Niederflur + Matte, Bewohnerin wehrt sich..." />
          </div>

          <div>
            <Label>Gelinderes Mittel geprueft — welche + warum nicht ausreichend?</Label>
            <Textarea rows={3} placeholder="Niederflurbett, Bodenmatte, Bewegungsmelder, Sitzwache — getestet 3 Wochen, weiter 2 Stuerze." />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Anordnung durch (Arzt-Name)</Label><Input placeholder="Dr. med. Schmidt" /></div>
            <div><Label>Beginn</Label><Input type="datetime-local" /></div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Voraussichtliches Ende</Label><Input type="datetime-local" /></div>
            <div><Label>Bewohnervertretung verstaendigt am</Label><Input type="datetime-local" /></div>
          </div>

          <div className="flex gap-2 border-t pt-4">
            <Button>Meldung speichern + an VertretungsNetz senden</Button>
            <Button variant="outline">Als Entwurf speichern</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Aktive Meldungen (Station A)</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr><th className="py-2">Bewohner</th><th>Art</th><th>Beginn</th><th>Arzt</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr className="border-t"><td className="py-2">Frau Schneider Z21</td><td>Mech. Bettgitter</td><td>12.04.2026</td><td>Dr. Schmidt</td><td><Badge variant="secondary">gemeldet</Badge></td></tr>
              <tr className="border-t"><td className="py-2">Herr Bauer Z5</td><td>Med. Sedativa</td><td>15.04.2026</td><td>Dr. Gruber</td><td><Badge>aktiv</Badge></td></tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
