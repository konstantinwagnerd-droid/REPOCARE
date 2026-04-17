import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pill, Download, FileText } from 'lucide-react';
import { listPrescriptions } from '@/lib/telemedizin/prescription';

export const metadata = { title: 'e-Rezepte · CareAI Telemedizin' };

const statusTone: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  entwurf: 'warning',
  ausgestellt: 'success',
  eingeloest: 'default',
  storniert: 'danger',
};

export default function RezeptePage() {
  const rxs = listPrescriptions();
  return (
    <div className="space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">e-Rezepte</h1>
        <p className="mt-1 text-muted-foreground">
          Elektronische Rezepte — TI (Deutschland) und ELGA e-Medikation (Österreich) kompatibel.
        </p>
      </header>

      {rxs.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">Keine Rezepte vorhanden.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {rxs.map((rx) => (
            <Card key={rx.id} id={rx.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" /> {rx.residentName}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ausgestellt von {rx.issuerDoctorName} · {new Date(rx.issuedAt).toLocaleString('de-AT')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Access-Code: <code className="font-mono">{rx.accessCode}</code>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={statusTone[rx.status]}>{rx.status}</Badge>
                  <Button asChild size="sm" variant="outline">
                    <a href={`/api/telemedizin/prescriptions/${rx.id}/pdf`} target="_blank" rel="noreferrer">
                      <Download className="mr-2 h-3.5 w-3.5" /> PDF
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" /> Arzneimittel ({rx.items.length})
                </div>
                <ul className="space-y-1 text-sm">
                  {rx.items.map((it, i) => (
                    <li key={i} className="rounded-lg border border-border p-3">
                      <div className="font-semibold">{it.name} {it.strength}</div>
                      <div className="text-xs text-muted-foreground">
                        {it.form} · Dosierung {it.dosage} · {it.durationDays} Tage
                        {it.pzn && ` · PZN ${it.pzn}`}
                        {it.packungsId && ` · Packungs-ID ${it.packungsId}`}
                      </div>
                      {it.note && <div className="mt-1 text-xs italic text-muted-foreground">{it.note}</div>}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
                  {rx.tiToken && <div>TI-Token: <code>{rx.tiToken}</code></div>}
                  {rx.elgaRef && <div>ELGA-Ref: <code>{rx.elgaRef}</code></div>}
                  <div>Gültig bis: {new Date(rx.validUntil).toLocaleDateString('de-AT')}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
