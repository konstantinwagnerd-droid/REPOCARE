/**
 * Mock-Daten für die Family-App.
 * In Produktion würde hier ein API-Client stehen, der die Next.js-API der Einrichtung
 * mit dem Session-Token der Angehörigen abfragt (Consent-gesteuert).
 */
export type WellbeingScore = {
  date: string;
  score: number; // 0-100
  mood: 'gut' | 'mittel' | 'schlecht';
  note?: string;
};

export type Activity = {
  id: string;
  date: string;
  icon: 'meal' | 'walk' | 'visit' | 'medical' | 'leisure' | 'sleep';
  title: string;
  description: string;
};

export type Photo = {
  id: string;
  date: string;
  caption: string;
  uri: string;
  consentLevel: 'family' | 'public';
};

export type Message = {
  id: string;
  threadId: string;
  from: 'family' | 'care-team';
  authorName: string;
  sentAt: string;
  body: string;
  read: boolean;
};

export type MessageThread = {
  id: string;
  subject: string;
  lastMessageAt: string;
  unread: number;
  participants: string[];
};

export type Appointment = {
  id: string;
  date: string;
  title: string;
  type: 'visit' | 'video-call' | 'event';
  status: 'geplant' | 'angefragt' | 'bestaetigt' | 'abgesagt';
  location?: string;
  note?: string;
};

export type FamilyDocument = {
  id: string;
  date: string;
  title: string;
  kind: 'pflegebericht' | 'arztbericht' | 'medikamentenplan' | 'vorsorge';
  consentRequired: boolean;
  consentGranted: boolean;
  sizeKb: number;
};

const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

export const mockWellbeing: WellbeingScore[] = [
  { date: iso(daysAgo(6)), score: 72, mood: 'mittel' },
  { date: iso(daysAgo(5)), score: 68, mood: 'mittel', note: 'Etwas müde nach der Physio.' },
  { date: iso(daysAgo(4)), score: 78, mood: 'gut' },
  { date: iso(daysAgo(3)), score: 81, mood: 'gut', note: 'Hat im Garten gegessen.' },
  { date: iso(daysAgo(2)), score: 76, mood: 'gut' },
  { date: iso(daysAgo(1)), score: 83, mood: 'gut' },
  { date: iso(daysAgo(0)), score: 85, mood: 'gut', note: 'Fröhlich beim Frühstück.' },
];

export const mockActivities: Activity[] = [
  { id: 'a1', date: iso(daysAgo(0)), icon: 'meal', title: 'Frühstück gegessen', description: 'Semmel mit Marmelade, Tee.' },
  { id: 'a2', date: iso(daysAgo(0)), icon: 'leisure', title: 'Singkreis', description: '45 Min. Volkslieder im Gemeinschaftsraum.' },
  { id: 'a3', date: iso(daysAgo(0)), icon: 'walk', title: 'Spaziergang', description: '20 Min. im Innenhof mit Pfleger Markus.' },
  { id: 'a4', date: iso(daysAgo(1)), icon: 'medical', title: 'Arztbesuch', description: 'Dr. Maier — Blutdruck-Kontrolle, alles stabil.' },
  { id: 'a5', date: iso(daysAgo(1)), icon: 'sleep', title: 'Ruhige Nacht', description: 'Keine nächtlichen Unruhen.' },
];

export const mockPhotos: Photo[] = [
  { id: 'p1', date: iso(daysAgo(0)), caption: 'Beim Singkreis', uri: 'https://picsum.photos/seed/careai1/600/400', consentLevel: 'family' },
  { id: 'p2', date: iso(daysAgo(2)), caption: 'Im Garten', uri: 'https://picsum.photos/seed/careai2/600/400', consentLevel: 'family' },
  { id: 'p3', date: iso(daysAgo(5)), caption: 'Geburtstagskaffee', uri: 'https://picsum.photos/seed/careai3/600/400', consentLevel: 'family' },
];

export const mockThreads: MessageThread[] = [
  { id: 't1', subject: 'Wochenplan & Besuchszeiten', lastMessageAt: iso(daysAgo(0)), unread: 1, participants: ['Pflegeteam Station 2', 'Sie'] },
  { id: 't2', subject: 'Neue Medikation', lastMessageAt: iso(daysAgo(3)), unread: 0, participants: ['PDL Claudia Weber', 'Sie'] },
];

export const mockMessages: Record<string, Message[]> = {
  t1: [
    { id: 'm1', threadId: 't1', from: 'care-team', authorName: 'Anna (Pflege)', sentAt: iso(daysAgo(1)), body: 'Guten Morgen! Ihre Mutter hat heute Morgen sehr gut gefrühstückt und freut sich auf Ihren Besuch am Wochenende.', read: true },
    { id: 'm2', threadId: 't1', from: 'family', authorName: 'Sie', sentAt: iso(daysAgo(1)), body: 'Das freut mich sehr. Sagen Sie ihr bitte einen schönen Gruß.', read: true },
    { id: 'm3', threadId: 't1', from: 'care-team', authorName: 'Anna (Pflege)', sentAt: iso(daysAgo(0)), body: 'Mache ich gerne. Bis Samstag!', read: false },
  ],
  t2: [
    { id: 'm4', threadId: 't2', from: 'care-team', authorName: 'C. Weber (PDL)', sentAt: iso(daysAgo(3)), body: 'Wir haben heute mit Dr. Maier die Blutdruck-Medikation angepasst. Der neue Plan liegt im Bereich „Dokumente“.', read: true },
  ],
};

export const mockAppointments: Appointment[] = [
  { id: 'ap1', date: iso(daysAgo(-2)), title: 'Besuch geplant', type: 'visit', status: 'bestaetigt', location: 'Zimmer 214', note: 'Kuchen mitbringen.' },
  { id: 'ap2', date: iso(daysAgo(-7)), title: 'Videoanruf', type: 'video-call', status: 'angefragt' },
  { id: 'ap3', date: iso(daysAgo(-14)), title: 'Sommerfest', type: 'event', status: 'geplant', location: 'Garten' },
];

export const mockDocuments: FamilyDocument[] = [
  { id: 'd1', date: iso(daysAgo(0)), title: 'Wochenbericht KW ' + weekNr(new Date()), kind: 'pflegebericht', consentRequired: false, consentGranted: true, sizeKb: 84 },
  { id: 'd2', date: iso(daysAgo(3)), title: 'Medikamentenplan (neu)', kind: 'medikamentenplan', consentRequired: true, consentGranted: true, sizeKb: 22 },
  { id: 'd3', date: iso(daysAgo(8)), title: 'Arztbrief Dr. Maier', kind: 'arztbericht', consentRequired: true, consentGranted: false, sizeKb: 112 },
  { id: 'd4', date: iso(daysAgo(30)), title: 'Patientenverfügung', kind: 'vorsorge', consentRequired: true, consentGranted: true, sizeKb: 56 },
];

function weekNr(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}
