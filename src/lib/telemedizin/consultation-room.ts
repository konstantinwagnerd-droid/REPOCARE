/**
 * In-Memory Consultation-Room Management.
 *
 * Verantwortlich für:
 *  - Verwaltung geplanter, aktiver und abgeschlossener Konsultationen
 *  - Vergabe kurzlebiger JoinTokens pro Teilnehmer:in
 *  - Session-State (wer ist beigetreten, seit wann?)
 *
 * Persistenz: module-scope Map. Für eine Produktion würden wir hier auf
 * Drizzle + Redis (Tokens) umsteigen; die API bleibt identisch.
 */
import type {
  Consultation,
  ConsultationMessage,
  ConsultationStatus,
  JoinToken,
  Participant,
  SessionState,
} from './types';

type Store = {
  consultations: Map<string, Consultation>;
  tokens: Map<string, JoinToken>;
  sessions: Map<string, SessionState>;
};

const g = globalThis as unknown as { __telemed_store?: Store };

function store(): Store {
  if (!g.__telemed_store) {
    g.__telemed_store = {
      consultations: new Map(),
      tokens: new Map(),
      sessions: new Map(),
    };
    seed(g.__telemed_store);
  }
  return g.__telemed_store;
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export function listConsultations(filter?: { status?: ConsultationStatus; residentId?: string }): Consultation[] {
  const all = Array.from(store().consultations.values());
  return all
    .filter((c) => !filter?.status || c.status === filter.status)
    .filter((c) => !filter?.residentId || c.residentId === filter.residentId)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
}

export function getConsultation(idVal: string): Consultation | undefined {
  return store().consultations.get(idVal);
}

export type CreateConsultationInput = Pick<
  Consultation,
  'residentId' | 'residentName' | 'subject' | 'scheduledAt' | 'durationMin' | 'doctor' | 'note'
> & { participants?: Participant[] };

export function createConsultation(input: CreateConsultationInput): Consultation {
  const now = new Date().toISOString();
  const c: Consultation = {
    id: id('cons'),
    residentId: input.residentId,
    residentName: input.residentName,
    subject: input.subject,
    scheduledAt: input.scheduledAt,
    durationMin: input.durationMin,
    status: 'geplant',
    doctor: input.doctor,
    participants: input.participants ?? [],
    note: input.note,
    messages: [],
    diagnoses: [],
    prescriptionIds: [],
    createdAt: now,
    updatedAt: now,
  };
  store().consultations.set(c.id, c);
  return c;
}

export function updateConsultationStatus(consultationId: string, status: ConsultationStatus): Consultation | undefined {
  const c = store().consultations.get(consultationId);
  if (!c) return undefined;
  c.status = status;
  c.updatedAt = new Date().toISOString();
  return c;
}

export function cancelConsultation(consultationId: string, reason?: string): Consultation | undefined {
  const c = updateConsultationStatus(consultationId, 'abgesagt');
  if (c && reason) c.note = `[Abgesagt] ${reason}`;
  return c;
}

/** Ein neuer kurzlebiger Join-Token (10 Minuten). */
export function issueJoinToken(consultationId: string, participant: Participant): JoinToken {
  const tok: JoinToken = {
    token: id('tok'),
    consultationId,
    participantId: participant.id,
    role: participant.role,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  };
  store().tokens.set(tok.token, tok);
  return tok;
}

export function validateJoinToken(token: string): JoinToken | undefined {
  const t = store().tokens.get(token);
  if (!t) return undefined;
  if (new Date(t.expiresAt).getTime() < Date.now()) {
    store().tokens.delete(token);
    return undefined;
  }
  return t;
}

export function join(consultationId: string, participantId: string): SessionState {
  let s = store().sessions.get(consultationId);
  if (!s) {
    s = { consultationId, status: 'warteraum', joined: [] };
    store().sessions.set(consultationId, s);
  }
  if (!s.joined.some((j) => j.participantId === participantId)) {
    s.joined.push({ participantId, joinedAt: new Date().toISOString() });
  }
  // Erste Beitritt eines Arztes → aktiv
  const c = store().consultations.get(consultationId);
  if (c && s.joined.length >= 2 && s.status !== 'aktiv') {
    s.status = 'aktiv';
    s.activeSince = new Date().toISOString();
    updateConsultationStatus(consultationId, 'aktiv');
  }
  return s;
}

export function leave(consultationId: string, participantId: string): SessionState | undefined {
  const s = store().sessions.get(consultationId);
  if (!s) return undefined;
  s.joined = s.joined.filter((j) => j.participantId !== participantId);
  if (s.joined.length === 0 && s.status === 'aktiv') {
    s.status = 'abgeschlossen';
    s.endedAt = new Date().toISOString();
    updateConsultationStatus(consultationId, 'abgeschlossen');
  }
  return s;
}

export function getSessionState(consultationId: string): SessionState | undefined {
  return store().sessions.get(consultationId);
}

export function appendMessage(consultationId: string, message: Omit<ConsultationMessage, 'id' | 'consultationId' | 'sentAt'>): ConsultationMessage | undefined {
  const c = store().consultations.get(consultationId);
  if (!c) return undefined;
  const m: ConsultationMessage = {
    ...message,
    id: id('msg'),
    consultationId,
    sentAt: new Date().toISOString(),
  };
  c.messages = [...(c.messages ?? []), m];
  c.updatedAt = m.sentAt;
  return m;
}

function seed(s: Store) {
  const demoDoc: Participant = {
    id: 'doc_maier',
    role: 'arzt',
    displayName: 'Dr. med. Klaus Maier',
    email: 'k.maier@arzt.demo',
    externalIds: { oeakId: '123456', lanr: '999999900' },
  };
  const demoDoc2: Participant = {
    id: 'doc_schuster',
    role: 'arzt',
    displayName: 'Dr. Sabine Schuster',
    email: 's.schuster@arzt.demo',
    externalIds: { oeakId: '654321', lanr: '888888800' },
  };
  const nurse: Participant = { id: 'p_nurse', role: 'pflege', displayName: 'Anna Berger' };

  const days = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString();
  const cs: Consultation[] = [
    {
      id: 'cons_1',
      residentId: 'res_demo_1',
      residentName: 'Frau Huber',
      subject: 'Blutdruck-Einstellung & Wundkontrolle',
      scheduledAt: days(1),
      durationMin: 20,
      status: 'geplant',
      doctor: demoDoc,
      participants: [nurse],
      note: 'Wunde linker Unterschenkel — Foto vom 12.04. liegt vor.',
      messages: [],
      diagnoses: [{ code: 'I10', label: 'Essentielle (primäre) Hypertonie', isPrimary: true }],
      prescriptionIds: [],
      createdAt: days(-3),
      updatedAt: days(-1),
    },
    {
      id: 'cons_2',
      residentId: 'res_demo_2',
      residentName: 'Herr Berger',
      subject: 'Polymedikations-Review',
      scheduledAt: days(3),
      durationMin: 30,
      status: 'geplant',
      doctor: demoDoc2,
      participants: [nurse],
      note: '12 Dauermedikamente — Interaktions-Check notwendig.',
      messages: [],
      diagnoses: [],
      prescriptionIds: [],
      createdAt: days(-2),
      updatedAt: days(-2),
    },
    {
      id: 'cons_3',
      residentId: 'res_demo_3',
      residentName: 'Frau Steiner',
      subject: 'Nachbesprechung Schlaganfall-Reha',
      scheduledAt: days(-4),
      durationMin: 25,
      status: 'abgeschlossen',
      doctor: demoDoc,
      participants: [nurse],
      diagnoses: [
        { code: 'I69.4', label: 'Folgen eines Schlaganfalls', isPrimary: true },
        { code: 'F01.9', label: 'Vaskuläre Demenz, nicht näher bezeichnet', isPrimary: false },
      ],
      prescriptionIds: ['rx_demo_1'],
      messages: [],
      createdAt: days(-10),
      updatedAt: days(-4),
    },
  ];
  cs.forEach((c) => s.consultations.set(c.id, c));
}
