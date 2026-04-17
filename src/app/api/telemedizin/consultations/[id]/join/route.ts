import { NextRequest, NextResponse } from 'next/server';
import { getConsultation, issueJoinToken, join, leave } from '@/lib/telemedizin/consultation-room';
import type { Participant } from '@/lib/telemedizin/types';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getConsultation(id);
  if (!c) return NextResponse.json({ error: 'Konsultation nicht gefunden' }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as { participant?: Participant };
  if (!body.participant) {
    return NextResponse.json({ error: 'participant fehlt' }, { status: 400 });
  }
  const token = issueJoinToken(id, body.participant);
  const session = join(id, body.participant.id);
  return NextResponse.json({ token, session });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const participantId = url.searchParams.get('participantId');
  if (!participantId) return NextResponse.json({ error: 'participantId fehlt' }, { status: 400 });
  const session = leave(id, participantId);
  return NextResponse.json({ session });
}
