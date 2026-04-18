/**
 * /admin/abrechnung — Krankenkassen-Direktabrechnung nach § 302 SGB V.
 *
 * Zeigt Monats-Übersicht aller abrechenbaren Leistungen, gruppiert nach Kasse.
 * Kern: DTA-Datei-Generierung für Upload bei der Kasse / Datenannahmestelle.
 * Technische Details siehe docs/research/krankenkassen-abrechnung.md.
 */
import Link from "next/link";
import { LEISTUNGSKATALOG_HKP } from "@/lib/abrechnung";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Download, Upload, AlertCircle } from "lucide-react";

export default function AbrechnungPage() {
  return (
    <div className="space-y-6 p-6 lg:p-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Krankenkassen-Abrechnung § 302 SGB V</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Direkt-Abrechnung mit gesetzlichen Krankenkassen (SGB V) und Pflegekassen (SGB XI) — elektronisch
            nach Technischer Anlage des GKV-Spitzenverbands. Siehe{" "}
            <Link href="/docs/research/krankenkassen-abrechnung" className="text-primary underline-offset-2 hover:underline">
              Technisches Dossier
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">§ 302 SGB V</Badge>
          <Badge variant="secondary">§ 105 SGB XI</Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Positionen diesen Monat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">–</p>
            <p className="text-xs text-muted-foreground">Leistungs-Positionen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Bruttowert</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">– €</p>
            <p className="text-xs text-muted-foreground">abrechenbar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Kassen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">–</p>
            <p className="text-xs text-muted-foreground">Kostenträger</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Letzte Einreichung</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">—</p>
            <p className="text-xs text-muted-foreground">keine Daten</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/5 p-4 text-sm">
        <div className="mb-1 flex items-center gap-2 font-semibold">
          <AlertCircle className="h-4 w-4 text-yellow-600" /> Aktivierung erforderlich
        </div>
        <p className="text-muted-foreground">
          Für produktive Abrechnung müssen folgende Daten hinterlegt sein:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>IK-Nummer (Institutions-Kennzeichen, 9-stellig, ARGE-IK Essen)</li>
          <li>Datenannahmestellen-IK je Kostenträger</li>
          <li>Verschlüsselungs-Zertifikat (PKCS#7 / S/MIME)</li>
          <li>Bundesland-spezifische Leistungskomplex-Preise (SGB XI Rahmenvertrag)</li>
        </ul>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Abrechenbare Leistungen je Kasse</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left">Kasse (IK)</th>
                  <th className="px-4 py-3 text-left">Bewohner:innen</th>
                  <th className="px-4 py-3 text-left">Positionen</th>
                  <th className="px-4 py-3 text-right">Bruttowert</th>
                  <th className="px-4 py-3 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-6 text-center text-muted-foreground" colSpan={5}>
                    Sobald Service-Records abrechenbare Positionen liefern, werden sie hier gruppiert nach Kasse angezeigt.
                    Einlesen per <code className="rounded bg-muted px-1 font-mono">src/lib/abrechnung/generateDta()</code>.
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="h-4 w-4 text-primary" /> DTA-Datei erzeugen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Erzeugt SLGA + SLLA-Dateien nach § 302 SGB V, Download als ISO-8859-15-Textdatei zum
              Upload bei der Datenannahmestelle (E-Mail oder SFTP, je Kasse).
            </p>
            <Button variant="outline" disabled>
              <Download className="mr-2 h-4 w-4" /> Dateien herunterladen (aktiviert bei vorhandenen Daten)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="h-4 w-4 text-primary" /> KTA-Rückmeldung importieren
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Importiert KOTR (technisch) bzw. KOST (Zahlungsavis) der Kasse, mappt auf interne
              Rechnungen und aktualisiert Status automatisch.
            </p>
            <Button variant="outline" disabled>
              <Upload className="mr-2 h-4 w-4" /> Datei auswählen (aktiviert nach DTA-Übermittlung)
            </Button>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Leistungskatalog (Auszug {LEISTUNGSKATALOG_HKP.length} Positionen)</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left">Pos.Nr</th>
                  <th className="px-4 py-3 text-left">Bezeichnung</th>
                  <th className="px-4 py-3 text-left">Basis</th>
                  <th className="px-4 py-3 text-right">Richt-Preis</th>
                </tr>
              </thead>
              <tbody>
                {LEISTUNGSKATALOG_HKP.map((l) => (
                  <tr key={l.positionsNr} className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">{l.positionsNr}</td>
                    <td className="px-4 py-2">{l.kurzBezeichnung}</td>
                    <td className="px-4 py-2 text-muted-foreground">{l.abrechnungsBasis}</td>
                    <td className="px-4 py-2 text-right font-mono">
                      {l.standardPreisCent ? `${(l.standardPreisCent / 100).toFixed(2)} €` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <p className="mt-3 text-xs text-muted-foreground">
          Quelle: GKV-Spitzenverband, Positionsnummernverzeichnis HKP vom 16.08.2024.{" "}
          <a
            href="https://www.gkv-datenaustausch.de/media/dokumente/leistungserbringer_1/sonstige_leistungserbringer/positionsnummernverzeichnisse/Haeusliche-Krankenpflege_20240816.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Original-PDF
          </a>
          . Preise sind Richtwerte; Rahmenverträge variieren je Bundesland.
        </p>
      </section>
    </div>
  );
}
