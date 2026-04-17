import { NextRequest, NextResponse } from 'next/server';
import { createConsultation, listConsultations } from '@/lib/telemedizin/consultation-room';
import type { ConsultationStatus, Participant } from '@/lib/telemedizin/types';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status') as ConsultationStatus | null;
  const residentId = url.searchParams.get('residentId');
  const data = listConsultations({
    status: status ?? undefined,
    residentId: residentId ?? undefined,
  });
  return NextResponse.json({ consultations: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { residentId, residentName, subject, scheduledAt, durationMin, doctor, note, participants } = body as {
    residentId?: string;
    residentName?: string;
    subject?: string;
    scheduledAt?: string;
    durationMin?: number;
    doctor?: Participant;
    note?: string;
    participants?: Participant[];
  };
  if (!residentId || !residentName || !subject || !scheduledAt || !durationMin || !doctor) {
    return NextResponse.json({ error: 'Fehlende Pflichtfelder.' }, { status: 400 });
  }
  const c = createConsultation({
    residentId,
    residentName,
    subject,
    scheduledAt,
    durationMin,
    doctor,
    note,
    participants,
  });
  return NextResponse.json({ consultation: c }, { status: 201 });
}
