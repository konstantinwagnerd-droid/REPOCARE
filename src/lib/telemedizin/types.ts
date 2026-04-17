/**
 * Telemedizin-Domäne: Typen für Online-Konsultationen.
 *
 * Orientiert sich an TI / KIM / eRezept (DE) und ELGA (AT) — die konkreten
 * Felder sind mit beiden Frameworks kompatibel, ohne eine Live-Integration
 * abzubilden (würde Zertifikats-Handling und TI-Konnektor erfordern).
 */

export type ParticipantRole = 'patient' | 'pflege' | 'arzt' | 'angehoerige' | 'dolmetsch';

export type Participant = {
  id: string;
  role: ParticipantRole;
  displayName: string;
  email?: string;
  /** Nur für Ärzt:innen — BSNR/LANR (DE) bzw. ÖÄK-Zahl (AT). */
  externalIds?: { bsnr?: string; lanr?: string; oeakId?: string };
};

export type ConsultationStatus =
  | 'geplant'
  | 'warteraum'
  | 'aktiv'
  | 'abgeschlossen'
  | 'ausgefallen'
  | 'abgesagt';

export type Consultation = {
  id: string;
  /** Bewohner:in (FK auf residents — hier lose gekoppelt, da In-Memory). */
  residentId: string;
  residentName: string;
  /** Konsultationsanlass — frei, z. B. "Wundkontrolle", "Medikations-Review". */
  subject: string;
  /** ISO-Datum des geplanten Termins. */
  scheduledAt: string;
  /** Dauer in Minuten (Planwert). */
  durationMin: number;
  status: ConsultationStatus;
  /** Ärzt:in, die die Konsultation leitet. */
  doctor: Participant;
  /** Weitere Teilnehmer:innen (Pflege, Angehörige). */
  participants: Participant[];
  /** Notizen des planenden Pflegepersonals. */
  note?: string;
  /** Chat-Nachrichten (optimistisch im Client). */
  messages?: ConsultationMessage[];
  /** Diagnosen nach ICD-10 aus der Konsultation. */
  diagnoses?: Diagnosis[];
  /** Verordnete Rezepte. */
  prescriptionIds?: string[];
  createdAt: string;
  updatedAt: string;
};

export type ConsultationMessage = {
  id: string;
  consultationId: string;
  authorId: string;
  authorName: string;
  authorRole: ParticipantRole;
  body: string;
  sentAt: string;
};

export type Diagnosis = {
  code: string; // ICD-10 Code, z. B. "I10"
  label: string;
  isPrimary: boolean;
};

export type Prescription = {
  id: string;
  consultationId: string;
  residentId: string;
  residentName: string;
  issuerDoctorId: string;
  issuerDoctorName: string;
  /** Arzneimittel-Zeilen. */
  items: PrescriptionItem[];
  /** eRezept-Access-Code (16-stellig, alphanumerisch). */
  accessCode: string;
  /** ELGA e-Medikation (AT) identifier. */
  elgaRef?: string;
  /** TI eRezept-Token (DE). */
  tiToken?: string;
  status: 'entwurf' | 'ausgestellt' | 'eingeloest' | 'storniert';
  issuedAt: string;
  validUntil: string;
};

export type PrescriptionItem = {
  pzn?: string; // DE
  packungsId?: string; // AT
  name: string;
  strength: string; // z. B. "5 mg"
  form: string; // Tablette, Tropfen, Salbe ...
  dosage: string; // "1-0-1-0"
  durationDays: number;
  note?: string;
};

/**
 * Token für den Beitritt zu einem Konsultationsraum.
 * In Produktion: kurzlebiges, signiertes JWT mit Teilnehmer-Rolle.
 */
export type JoinToken = {
  token: string;
  consultationId: string;
  participantId: string;
  role: ParticipantRole;
  expiresAt: string;
};

export type SessionState = {
  consultationId: string;
  status: ConsultationStatus;
  joined: Array<{ participantId: string; joinedAt: string }>;
  activeSince?: string;
  endedAt?: string;
};

export type IcdEntry = { code: string; label: string; category: string };
