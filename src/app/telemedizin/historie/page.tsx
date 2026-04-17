import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Pill, Stethoscope } from 'lucide-react';
import { getFullHistory } from '@/lib/telemedizin/history';

export const metadata = { title: 'Konsultations-Historie · CareAI' };

export default function HistoriePage() {
  const entries = getFullHistory();

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Historie</h1>
        <p className="mt-1 text-muted-foreground">Alle abgeschlossenen und abgesagten Konsultationen.</p>
      </header>

      {entries.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">Keine Einträge vorhanden.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {entries.map((e) => (
            <Card key={e.consultation.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    {e.consultation.subject}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {e.consultation.residentName} · {e.consultation.doctor.displayName} ·{' '}
                    {new Date(e.consultation.scheduledAt).toLocaleString('de-AT')}
                  </p>
                </div>
                <Badge variant={e.consultation.status === 'abgeschlossen' ? 'success' : 'danger'}>
                  {e.consultation.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {e.consultation.diagnoses && e.consultation.diagnoses.length > 0 && (
                  <section>
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <History className="h-3.5 w-3.5" /> Diagnosen (ICD-10)
                    </div>
                    <ul className="space-y-1 text-sm">
                      {e.consultation.diagnoses.map((d) => (
                        <li key={d.code} className="flex items-center gap-2">
                          <Badge variant="outline">{d.code}</Badge>
                          <span>{d.label}</span>
                          {d.isPrimary && <Badge variant="info">Hauptdiagnose</Badge>}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {e.prescriptions.length > 0 && (
                  <section>
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Pill className="h-3.5 w-3.5" /> Rezepte
                    </div>
                    <ul className="space-y-1 text-sm">
                      {e.prescriptions.map((rx) => (
                        <li key={rx.id} className="flex items-center gap-2">
                          <Link className="text-primary underline" href={`/telemedizin/rezepte#${rx.id}`}>
                            {rx.accessCode}
                          </Link>
                          <span className="text-muted-foreground">
                            · {rx.items.length} Arzneimittel · {rx.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {e.consultation.note && (
                  <p className="text-sm text-muted-foreground">&bdquo;{e.consultation.note}&ldquo;</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
