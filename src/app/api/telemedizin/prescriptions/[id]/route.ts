import { NextRequest, NextResponse } from 'next/server';
import { getPrescription, updatePrescriptionStatus } from '@/lib/telemedizin/prescription';
import type { Prescription } from '@/lib/telemedizin/types';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rx = getPrescription(id);
  if (!rx) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  return NextResponse.json({ prescription: rx });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { status?: Prescription['status'] };
  if (!body.status) return NextResponse.json({ error: 'status fehlt' }, { status: 400 });
  const rx = updatePrescriptionStatus(id, body.status);
  if (!rx) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  return NextResponse.json({ prescription: rx });
}
