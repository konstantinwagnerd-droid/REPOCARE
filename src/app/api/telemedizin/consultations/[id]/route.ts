import { NextRequest, NextResponse } from 'next/server';
import { cancelConsultation, getConsultation, updateConsultationStatus } from '@/lib/telemedizin/consultation-room';
import type { ConsultationStatus } from '@/lib/telemedizin/types';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getConsultation(id);
  if (!c) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  return NextResponse.json({ consultation: c });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { status?: ConsultationStatus; cancelReason?: string };
  if (body.status === 'abgesagt') {
    const c = cancelConsultation(id, body.cancelReason);
    if (!c) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    return NextResponse.json({ consultation: c });
  }
  if (body.status) {
    const c = updateConsultationStatus(id, body.status);
    if (!c) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    return NextResponse.json({ consultation: c });
  }
  return NextResponse.json({ error: 'Keine Änderungen' }, { status: 400 });
}
