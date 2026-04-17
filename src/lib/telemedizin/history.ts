/**
 * Historische Auswertungen über abgeschlossene Konsultationen.
 */
import { listConsultations } from './consultation-room';
import { listPrescriptions } from './prescription';
import type { Consultation, Prescription } from './types';

export type HistoryEntry = {
  consultation: Consultation;
  prescriptions: Prescription[];
};

export function getHistoryForResident(residentId: string): HistoryEntry[] {
  const cs = listConsultations({ residentId }).filter((c) => c.status === 'abgeschlossen');
  return cs.map((c) => ({
    consultation: c,
    prescriptions: listPrescriptions({ consultationId: c.id }),
  }));
}

export function getFullHistory(): HistoryEntry[] {
  const cs = listConsultations().filter((c) => c.status === 'abgeschlossen' || c.status === 'abgesagt');
  return cs.map((c) => ({ consultation: c, prescriptions: listPrescriptions({ consultationId: c.id }) }));
}

export function historyStats() {
  const all = listConsultations();
  const doctors = new Set(all.map((c) => c.doctor.id));
  return {
    total: all.length,
    upcoming: all.filter((c) => c.status === 'geplant').length,
    active: all.filter((c) => c.status === 'aktiv').length,
    completed: all.filter((c) => c.status === 'abgeschlossen').length,
    cancelled: all.filter((c) => c.status === 'abgesagt').length,
    uniqueDoctors: doctors.size,
    totalPrescriptions: listPrescriptions().length,
  };
}
