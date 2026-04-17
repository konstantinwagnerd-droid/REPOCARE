import { NextRequest, NextResponse } from 'next/server';
import { createPrescription, listPrescriptions } from '@/lib/telemedizin/prescription';
import type { PrescriptionItem } from '@/lib/telemedizin/types';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const residentId = url.searchParams.get('residentId');
  const consultationId = url.searchParams.get('consultationId');
  const data = listPrescriptions({
    residentId: residentId ?? undefined,
    consultationId: consultationId ?? undefined,
  });
  return NextResponse.json({ prescriptions: data });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    consultationId?: string;
    residentId?: string;
    residentName?: string;
    issuerDoctorId?: string;
    issuerDoctorName?: string;
    items?: PrescriptionItem[];
    validDays?: number;
  };
  if (!body.consultationId || !body.residentId || !body.residentName || !body.issuerDoctorId || !body.issuerDoctorName || !body.items?.length) {
    return NextResponse.json({ error: 'Unvollständig' }, { status: 400 });
  }
  const rx = createPrescription({
    consultationId: body.consultationId,
    residentId: body.residentId,
    residentName: body.residentName,
    issuerDoctorId: body.issuerDoctorId,
    issuerDoctorName: body.issuerDoctorName,
    items: body.items,
    validDays: body.validDays,
  });
  return NextResponse.json({ prescription: rx }, { status: 201 });
}
