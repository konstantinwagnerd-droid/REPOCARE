/**
 * Erzeugt einen Knowledge-Graph aus den (mock-basierten) In-Memory-Daten
 * der CareAI-App. Der Builder ist deterministisch: gleiche Eingaben → gleicher Graph.
 *
 * Für echte Daten: diese Funktion durch Drizzle-Queries ersetzen. Die öffentliche
 * API (`buildGraph()`) bleibt stabil.
 */
import type { Graph, GraphEdge, GraphNode } from './types';

type SeedData = {
  residents: Array<{ id: string; name: string; room: string; age: number }>;
  staff: Array<{ id: string; name: string; role: string }>;
  family: Array<{ id: string; name: string; residentId: string; relation: string }>;
  medications: Array<{ id: string; name: string; atc: string }>;
  diagnoses: Array<{ code: string; label: string }>;
  measures: Array<{ id: string; label: string; diagnoses: string[]; standardId?: string }>;
  standards: Array<{ id: string; label: string }>;
  qis: Array<{ id: string; label: string; standardId: string }>;
  // Beziehungen
  bezugspflege: Array<{ staffId: string; residentId: string; weight?: number }>;
  hatDiagnose: Array<{ residentId: string; code: string }>;
  nimmtMedikament: Array<{ residentId: string; medId: string }>;
  interaktion: Array<{ a: string; b: string; severity: 'mild' | 'mittel' | 'schwer' }>;
  shifts: Array<{ id: string; label: string; staffIds: string[] }>;
};

/** Demo-Daten, die realistische Cluster liefern. */
export const SEED: SeedData = {
  residents: [
    { id: 'res_1', name: 'Frau Huber', room: 'A 201', age: 82 },
    { id: 'res_2', name: 'Herr Berger', room: 'A 202', age: 79 },
    { id: 'res_3', name: 'Frau Steiner', room: 'A 205', age: 88 },
    { id: 'res_4', name: 'Herr Wagner', room: 'B 108', age: 74 },
    { id: 'res_5', name: 'Frau Novak', room: 'B 112', age: 91 },
    { id: 'res_6', name: 'Herr Lang', room: 'B 115', age: 77 },
  ],
  staff: [
    { id: 'st_anna', name: 'Anna Berger', role: 'pflege' },
    { id: 'st_markus', name: 'Markus Huber', role: 'pflege' },
    { id: 'st_claudia', name: 'Claudia Weber', role: 'pdl' },
    { id: 'st_tom', name: 'Tom Fischer', role: 'pflege' },
  ],
  family: [
    { id: 'fam_1', name: 'Lisa Huber', residentId: 'res_1', relation: 'tochter' },
    { id: 'fam_2', name: 'Max Berger', residentId: 'res_2', relation: 'sohn' },
    { id: 'fam_3', name: 'Eva Wagner', residentId: 'res_4', relation: 'tochter' },
  ],
  medications: [
    { id: 'med_ramipril', name: 'Ramipril 5mg', atc: 'C09AA05' },
    { id: 'med_amlodipin', name: 'Amlodipin 5mg', atc: 'C08CA01' },
    { id: 'med_metformin', name: 'Metformin 1000mg', atc: 'A10BA02' },
    { id: 'med_warfarin', name: 'Warfarin 5mg', atc: 'B01AA03' },
    { id: 'med_ibuprofen', name: 'Ibuprofen 400mg', atc: 'M01AE01' },
    { id: 'med_donepezil', name: 'Donepezil 10mg', atc: 'N06DA02' },
  ],
  diagnoses: [
    { code: 'I10', label: 'Hypertonie' },
    { code: 'E11.9', label: 'Diabetes mellitus Typ 2' },
    { code: 'F01.9', label: 'Vaskuläre Demenz' },
    { code: 'I48.0', label: 'Vorhofflimmern' },
    { code: 'L89.2', label: 'Dekubitus Grad 3' },
    { code: 'M81.9', label: 'Osteoporose' },
  ],
  measures: [
    { id: 'm_blutdruckmess', label: 'Tägl. Blutdruckmessung', diagnoses: ['I10'], standardId: 'st_chroniker' },
    { id: 'm_wundversorg', label: 'Wundversorgung nach Expertenstandard', diagnoses: ['L89.2'], standardId: 'st_dekubitus' },
    { id: 'm_sturzpraev', label: 'Sturzprävention', diagnoses: ['M81.9'], standardId: 'st_sturz' },
    { id: 'm_biographie', label: 'Biographiearbeit', diagnoses: ['F01.9'], standardId: 'st_demenz' },
    { id: 'm_bz_kontrolle', label: 'Blutzucker-Monitoring', diagnoses: ['E11.9'], standardId: 'st_chroniker' },
  ],
  standards: [
    { id: 'st_dekubitus', label: 'Expertenstandard Dekubitus-Prophylaxe' },
    { id: 'st_sturz', label: 'Expertenstandard Sturzprophylaxe' },
    { id: 'st_demenz', label: 'Expertenstandard Demenz' },
    { id: 'st_chroniker', label: 'Expertenstandard chron. Wunden / Chronik' },
  ],
  qis: [
    { id: 'qi_dekubitus_inzidenz', label: 'QI: Dekubitus-Inzidenz', standardId: 'st_dekubitus' },
    { id: 'qi_sturz_rate', label: 'QI: Sturzrate pro 1000 PT', standardId: 'st_sturz' },
    { id: 'qi_bewegung', label: 'QI: Mobilitätsförderung', standardId: 'st_sturz' },
  ],
  bezugspflege: [
    { staffId: 'st_anna', residentId: 'res_1', weight: 0.9 },
    { staffId: 'st_anna', residentId: 'res_2', weight: 0.8 },
    { staffId: 'st_markus', residentId: 'res_3', weight: 0.9 },
    { staffId: 'st_markus', residentId: 'res_4', weight: 0.7 },
    { staffId: 'st_tom', residentId: 'res_5', weight: 0.85 },
    // res_6 (Hr Lang) bewusst ohne Bezugspflege — Insight-Fall "Wer ist isoliert?"
  ],
  hatDiagnose: [
    { residentId: 'res_1', code: 'I10' },
    { residentId: 'res_1', code: 'E11.9' },
    { residentId: 'res_2', code: 'I10' },
    { residentId: 'res_2', code: 'I48.0' },
    { residentId: 'res_3', code: 'F01.9' },
    { residentId: 'res_3', code: 'L89.2' },
    { residentId: 'res_4', code: 'E11.9' },
    { residentId: 'res_4', code: 'M81.9' },
    { residentId: 'res_5', code: 'F01.9' },
    { residentId: 'res_6', code: 'I10' },
  ],
  nimmtMedikament: [
    { residentId: 'res_1', medId: 'med_ramipril' },
    { residentId: 'res_1', medId: 'med_metformin' },
    { residentId: 'res_2', medId: 'med_ramipril' },
    { residentId: 'res_2', medId: 'med_warfarin' },
    { residentId: 'res_2', medId: 'med_ibuprofen' }, // bewusst — Warfarin+Ibuprofen-Interaktion
    { residentId: 'res_3', medId: 'med_donepezil' },
    { residentId: 'res_4', medId: 'med_metformin' },
    { residentId: 'res_4', medId: 'med_amlodipin' },
    { residentId: 'res_5', medId: 'med_donepezil' },
    { residentId: 'res_6', medId: 'med_ramipril' },
  ],
  interaktion: [
    { a: 'med_warfarin', b: 'med_ibuprofen', severity: 'schwer' },
    { a: 'med_ramipril', b: 'med_amlodipin', severity: 'mild' },
  ],
  shifts: [
    { id: 'shift_fruh', label: 'Frühdienst', staffIds: ['st_anna', 'st_markus'] },
    { id: 'shift_spaet', label: 'Spätdienst', staffIds: ['st_tom', 'st_claudia'] },
  ],
};

function nid(type: string, id: string) {
  return `${type}:${id}`;
}

export function buildGraph(seed: SeedData = SEED): Graph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  seed.residents.forEach((r) =>
    nodes.push({ id: nid('resident', r.id), type: 'resident', label: r.name, props: { room: r.room, age: r.age } })
  );
  seed.staff.forEach((s) =>
    nodes.push({ id: nid('staff', s.id), type: 'staff', label: s.name, props: { role: s.role } })
  );
  seed.family.forEach((f) =>
    nodes.push({ id: nid('family', f.id), type: 'family', label: f.name, props: { relation: f.relation } })
  );
  seed.medications.forEach((m) =>
    nodes.push({ id: nid('medication', m.id), type: 'medication', label: m.name, props: { atc: m.atc } })
  );
  seed.diagnoses.forEach((d) =>
    nodes.push({ id: nid('diagnosis', d.code), type: 'diagnosis', label: `${d.code} — ${d.label}` })
  );
  seed.measures.forEach((m) =>
    nodes.push({ id: nid('measure', m.id), type: 'measure', label: m.label })
  );
  seed.standards.forEach((s) =>
    nodes.push({ id: nid('expert-standard', s.id), type: 'expert-standard', label: s.label })
  );
  seed.qis.forEach((q) =>
    nodes.push({ id: nid('quality-indicator', q.id), type: 'quality-indicator', label: q.label })
  );
  const rooms = new Set<string>();
  seed.residents.forEach((r) => rooms.add(r.room));
  rooms.forEach((room) =>
    nodes.push({ id: nid('room', room), type: 'room', label: `Zimmer ${room}` })
  );
  seed.shifts.forEach((sh) =>
    nodes.push({ id: nid('shift', sh.id), type: 'shift', label: sh.label })
  );

  let eid = 0;
  const mk = (type: GraphEdge['type'], from: string, to: string, props?: GraphEdge['props'], weight?: number): GraphEdge => ({
    id: `e${++eid}`,
    type,
    from,
    to,
    props,
    weight,
  });

  seed.bezugspflege.forEach((b) =>
    edges.push(mk('bezugspflege', nid('staff', b.staffId), nid('resident', b.residentId), undefined, b.weight))
  );
  seed.family.forEach((f) =>
    edges.push(mk('angehoeriger-von', nid('family', f.id), nid('resident', f.residentId), { relation: f.relation }))
  );
  seed.nimmtMedikament.forEach((nm) =>
    edges.push(mk('nimmt-medikament', nid('resident', nm.residentId), nid('medication', nm.medId)))
  );
  seed.hatDiagnose.forEach((hd) =>
    edges.push(mk('hat-diagnose', nid('resident', hd.residentId), nid('diagnosis', hd.code)))
  );
  seed.interaktion.forEach((i) => {
    edges.push(mk('interagiert-mit', nid('medication', i.a), nid('medication', i.b), { severity: i.severity }));
  });
  seed.measures.forEach((m) => {
    m.diagnoses.forEach((code) =>
      edges.push(mk('adressiert', nid('measure', m.id), nid('diagnosis', code)))
    );
    if (m.standardId) edges.push(mk('gehoert-zu', nid('measure', m.id), nid('expert-standard', m.standardId)));
  });
  seed.qis.forEach((q) => edges.push(mk('misst', nid('quality-indicator', q.id), nid('expert-standard', q.standardId))));
  seed.residents.forEach((r) => edges.push(mk('wohnt-in', nid('resident', r.id), nid('room', r.room))));
  seed.shifts.forEach((sh) => sh.staffIds.forEach((st) => edges.push(mk('arbeitet-in-schicht', nid('staff', st), nid('shift', sh.id)))));

  return { nodes, edges };
}

export function residentNodeId(residentId: string): string {
  return nid('resident', residentId);
}
