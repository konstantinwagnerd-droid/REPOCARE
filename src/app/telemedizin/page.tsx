import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Clock, Stethoscope, Users, Video, FileSignature } from 'lucide-react';
import { listConsultations } from '@/lib/telemedizin/consultation-room';
import { historyStats } from '@/lib/telemedizin/history';

const statusTone: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'danger'> = {
  geplant: 'secondary',
  warteraum: 'warning',
  aktiv: 'success',
  abgeschlossen: 'default',
  abgesagt: 'danger',
  ausgefallen: 'danger',
};

export default function TelemedizinDashboardPage() {
  const upcoming = listConsultations({ status: 'geplant' });
  const active = listConsultations({ status: 'aktiv' });
  const stats = historyStats();

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Telemedizin-Portal</h1>
          <p className="mt-1 text-muted-foreground">
            Online-Sprechstunden mit Ärzt:innen — geplant, sicher, dokumentiert.
          </p>
        </div>
        <Button asChild>
          <Link href="/telemedizin/termin-vereinbaren">
            <CalendarPlus className="mr-2 h-4 w-4" /> Neue Konsultation
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Anstehend', value: stats.upcoming, icon: Clock },
          { label: 'Aktiv', value: stats.active, icon: Video },
          { label: 'Abgeschlossen', value: stats.completed, icon: Stethoscope },
          { label: 'Ärzt:innen', value: stats.uniqueDoctors, icon: Users },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <k.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-serif text-2xl font-semibold">{k.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {active.length > 0 && (
        <Card className="border-emerald-200 bg-emerald-50/60 dark:bg-emerald-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              <Video className="h-5 w-5" /> Laufende Konsultationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {active.map((c) => (
              <Link
                key={c.id}
                href={`/telemedizin/raum/${c.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-white p-3 text-sm transition-colors hover:bg-emerald-100/50 dark:bg-gray-900"
              >
                <div>
                  <div className="font-semibold">{c.subject}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.residentName} · {c.doctor.displayName}
                  </div>
                </div>
                <Badge variant="success">aktiv</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Anstehende Konsultationen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcoming.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Keine anstehenden Konsultationen.{' '}
              <Link href="/telemedizin/termin-vereinbaren" className="text-primary underline">
                Jetzt planen
              </Link>
              .
            </p>
          ) : (
            upcoming.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Stethoscope className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="font-semibold">{c.subject}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.residentName} · {c.doctor.displayName} · {new Date(c.scheduledAt).toLocaleString('de-AT')}
                  </div>
                </div>
                <Badge variant={statusTone[c.status]}>{c.status}</Badge>
                <Button asChild size="sm" variant="secondary">
                  <Link href={`/telemedizin/raum/${c.id}`}>Raum</Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-primary" /> Schnell-Aktionen
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Button asChild variant="outline"><Link href="/telemedizin/historie">Alle Termine anzeigen</Link></Button>
          <Button asChild variant="outline"><Link href="/telemedizin/rezepte">e-Rezepte verwalten</Link></Button>
          <Button asChild variant="outline"><Link href="/telemedizin/termin-vereinbaren">Neuen Termin planen</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
