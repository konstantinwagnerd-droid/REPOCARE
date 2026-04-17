import { NextRequest, NextResponse } from 'next/server';
import { appendMessage, getConsultation } from '@/lib/telemedizin/consultation-room';
import type { ParticipantRole } from '@/lib/telemedizin/types';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getConsultation(id);
  if (!c) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  return NextResponse.json({ messages: c.messages ?? [] });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    authorId?: string;
    authorName?: string;
    authorRole?: ParticipantRole;
    body?: string;
  };
  if (!body.authorId || !body.authorName || !body.authorRole || !body.body) {
    return NextResponse.json({ error: 'Ungültige Nachricht' }, { status: 400 });
  }
  const m = appendMessage(id, {
    authorId: body.authorId,
    authorName: body.authorName,
    authorRole: body.authorRole,
    body: body.body,
  });
  if (!m) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  return NextResponse.json({ message: m }, { status: 201 });
}
