'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CalendarPlus } from 'lucide-react';

const DOCTORS = [
  { id: 'doc_maier', displayName: 'Dr. med. Klaus Maier', role: 'arzt' as const, email: 'k.maier@arzt.demo' },
  { id: 'doc_schuster', displayName: 'Dr. Sabine Schuster', role: 'arzt' as const, email: 's.schuster@arzt.demo' },
  { id: 'doc_novak', displayName: 'Dr. Martin Novak (Geriatrie)', role: 'arzt' as const, email: 'm.novak@arzt.demo' },
];

const RESIDENTS = [
  { id: 'res_demo_1', name: 'Frau Huber' },
  { id: 'res_demo_2', name: 'Herr Berger' },
  { id: 'res_demo_3', name: 'Frau Steiner' },
  { id: 'res_demo_4', name: 'Herr Wagner' },
];

export function TerminForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const residentId = fd.get('residentId') as string;
    const resident = RESIDENTS.find((r) => r.id === residentId);
    const doctorId = fd.get('doctor') as string;
    const doctor = DOCTORS.find((d) => d.id === doctorId);
    const date = fd.get('date') as string;
    const time = fd.get('time') as string;
    const subject = fd.get('subject') as string;
    const duration = Number(fd.get('duration') ?? 20);
    const note = (fd.get('note') as string) || undefined;
    if (!resident || !doctor || !date || !time || !subject) {
      setError('Bitte alle Pflichtfelder ausfüllen.');
      return;
    }
    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
    startTransition(async () => {
      const res = await fetch('/api/telemedizin/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentId: resident.id,
          residentName: resident.name,
          subject,
          scheduledAt,
          durationMin: duration,
          doctor,
          note,
        }),
      });
      if (!res.ok) {
        setError('Konnte Konsultation nicht anlegen.');
        return;
      }
      router.push('/telemedizin');
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CalendarPlus className="h-5 w-5 text-primary" /> Termin-Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="residentId">Bewohner:in *</Label>
              <select id="residentId" name="residentId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" required>
                {RESIDENTS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor">Ärzt:in *</Label>
              <select id="doctor" name="doctor" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" required>
                {DOCTORS.map((d) => <option key={d.id} value={d.id}>{d.displayName}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Betreff / Anlass *</Label>
            <Input id="subject" name="subject" placeholder="z. B. Medikations-Review" required />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date">Datum *</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Uhrzeit *</Label>
              <Input id="time" name="time" type="time" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Dauer (Min.)</Label>
              <Input id="duration" name="duration" type="number" min={5} max={120} defaultValue={20} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Notiz für die Ärzt:in</Label>
            <Textarea id="note" name="note" rows={3} placeholder="Relevante Vorbefunde, Fotos, Laborwerte …" />
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Abbrechen</Button>
            <Button type="submit" disabled={pending}>{pending ? 'Anlegen …' : 'Konsultation anlegen'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
