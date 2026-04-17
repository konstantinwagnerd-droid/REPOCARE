/**
 * Elektronische Rezepte — Mock, kompatibel mit TI eRezept-Struktur (DE)
 * und ELGA e-Medikation (AT). Reale Ausstellung erfordert:
 *   - DE: TI-Konnektor + HBA (Heilberufsausweis) + Signaturdienst
 *   - AT: ELGA-Karte + Ordinationssoftware-Anbindung
 *
 * Hier simulieren wir die Datenstruktur und generieren pro Rezept
 *   - einen 16-stelligen Access-Code (eRezept-Spec)
 *   - eine ELGA-Referenz
 *   - ein TI-Token
 */
import type { Prescription, PrescriptionItem } from './types';

type Store = { prescriptions: Map<string, Prescription> };
const g = globalThis as unknown as { __telemed_rx_store?: Store };

function store(): Store {
  if (!g.__telemed_rx_store) {
    g.__telemed_rx_store = { prescriptions: new Map() };
    seed(g.__telemed_rx_store);
  }
  return g.__telemed_rx_store;
}

const ALPHANUM = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Erzeugt einen 16-stelligen eRezept-Access-Code (Gruppe 4x4). */
export function generateAccessCode(): string {
  let out = '';
  for (let i = 0; i < 16; i++) {
    out += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
    if ((i + 1) % 4 === 0 && i < 15) out += '-';
  }
  return out;
}

function rid(): string {
  return 'rx_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export type CreatePrescriptionInput = {
  consultationId: string;
  residentId: string;
  residentName: string;
  issuerDoctorId: string;
  issuerDoctorName: string;
  items: PrescriptionItem[];
  validDays?: number;
};

export function createPrescription(input: CreatePrescriptionInput): Prescription {
  const now = Date.now();
  const validUntil = new Date(now + (input.validDays ?? 30) * 86_400_000).toISOString();
  const rx: Prescription = {
    id: rid(),
    consultationId: input.consultationId,
    residentId: input.residentId,
    residentName: input.residentName,
    issuerDoctorId: input.issuerDoctorId,
    issuerDoctorName: input.issuerDoctorName,
    items: input.items,
    accessCode: generateAccessCode(),
    elgaRef: 'elga:rx:' + rid().slice(3),
    tiToken: 'Task/' + crypto.randomUUID() + '/$accept',
    status: 'ausgestellt',
    issuedAt: new Date(now).toISOString(),
    validUntil,
  };
  store().prescriptions.set(rx.id, rx);
  return rx;
}

export function listPrescriptions(filter?: { residentId?: string; consultationId?: string; status?: Prescription['status'] }): Prescription[] {
  return Array.from(store().prescriptions.values())
    .filter((rx) => !filter?.residentId || rx.residentId === filter.residentId)
    .filter((rx) => !filter?.consultationId || rx.consultationId === filter.consultationId)
    .filter((rx) => !filter?.status || rx.status === filter.status)
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
}

export function getPrescription(id: string): Prescription | undefined {
  return store().prescriptions.get(id);
}

export function updatePrescriptionStatus(id: string, status: Prescription['status']): Prescription | undefined {
  const rx = store().prescriptions.get(id);
  if (!rx) return undefined;
  rx.status = status;
  return rx;
}

/**
 * Rendert ein Rezept als einfaches, druckbares PDF-Surrogat (reiner Text / HTML-String).
 * Die tatsächliche PDF-Generierung erfolgt auf der Server-Route via @react-pdf/renderer.
 */
export function prescriptionToPlainText(rx: Prescription): string {
  const lines: string[] = [];
  lines.push('ELEKTRONISCHES REZEPT (Demo)');
  lines.push('================================');
  lines.push(`Access-Code:   ${rx.accessCode}`);
  lines.push(`ELGA-Ref:      ${rx.elgaRef ?? '-'}`);
  lines.push(`TI-Token:      ${rx.tiToken ?? '-'}`);
  lines.push('');
  lines.push(`Patient:in:    ${rx.residentName}`);
  lines.push(`Arzt/Ärztin:   ${rx.issuerDoctorName}`);
  lines.push(`Ausgestellt:   ${new Date(rx.issuedAt).toLocaleString('de-AT')}`);
  lines.push(`Gültig bis:    ${new Date(rx.validUntil).toLocaleDateString('de-AT')}`);
  lines.push('');
  lines.push('Arzneimittel:');
  for (const [i, it] of rx.items.entries()) {
    lines.push(`${i + 1}. ${it.name} ${it.strength} (${it.form})`);
    lines.push(`   Dosierung: ${it.dosage}   Dauer: ${it.durationDays} Tage`);
    if (it.pzn) lines.push(`   PZN: ${it.pzn}`);
    if (it.packungsId) lines.push(`   Packungs-ID: ${it.packungsId}`);
    if (it.note) lines.push(`   Hinweis: ${it.note}`);
  }
  lines.push('');
  lines.push(`Status: ${rx.status.toUpperCase()}`);
  return lines.join('\n');
}

function seed(s: Store) {
  const rx: Prescription = {
    id: 'rx_demo_1',
    consultationId: 'cons_3',
    residentId: 'res_demo_3',
    residentName: 'Frau Steiner',
    issuerDoctorId: 'doc_maier',
    issuerDoctorName: 'Dr. med. Klaus Maier',
    items: [
      { name: 'Ramipril', strength: '5 mg', form: 'Tablette', dosage: '1-0-0-0', durationDays: 30, pzn: '01234567' },
      { name: 'Amlodipin', strength: '5 mg', form: 'Tablette', dosage: '0-0-1-0', durationDays: 30, pzn: '07654321' },
    ],
    accessCode: 'A1B2-C3D4-E5F6-G7H8',
    elgaRef: 'elga:rx:demo1',
    tiToken: 'Task/11111111-1111-1111-1111-111111111111/$accept',
    status: 'ausgestellt',
    issuedAt: new Date(Date.now() - 4 * 86_400_000).toISOString(),
    validUntil: new Date(Date.now() + 26 * 86_400_000).toISOString(),
  };
  s.prescriptions.set(rx.id, rx);
}
