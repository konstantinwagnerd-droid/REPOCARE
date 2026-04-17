import { notFound } from 'next/navigation';
import { getConsultation } from '@/lib/telemedizin/consultation-room';
import { RaumClient } from './raum-client';

export const metadata = { title: 'Konsultation · CareAI Telemedizin' };

export default async function RaumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getConsultation(id);
  if (!c) notFound();
  return <RaumClient consultation={c} />;
}
