/**
 * Mock-Daten für Demo-Betrieb ohne Live-Backend.
 */

export type Resident = {
  id: string;
  name: string;
  room: string;
  station: string;
  pflegegrad: 1 | 2 | 3 | 4 | 5;
  birthdate: string;
  emergencyContact: { name: string; relation: string; phone: string };
  photo?: string;
  tags: string[];
};

export type Report = {
  id: string;
  residentId: string;
  author: string;
  createdAt: string;
  text: string;
  sisFields: string[];
  signed: boolean;
};

export type VitalPoint = { t: string; v: number };

export type Medication = {
  id: string;
  residentId: string;
  name: string;
  dose: string;
  schedule: string[];
  taken: Record<string, boolean>;
};

export const MOCK_RESIDENTS: Resident[] = [
  {
    id: 'r1',
    name: 'Anna Weber',
    room: '104',
    station: 'Station 1',
    pflegegrad: 3,
    birthdate: '1938-05-12',
    emergencyContact: { name: 'Michael Weber', relation: 'Sohn', phone: '+43 660 1234567' },
    tags: ['Diabetes', 'Sturzrisiko'],
  },
  {
    id: 'r2',
    name: 'Heinrich Gruber',
    room: '106',
    station: 'Station 1',
    pflegegrad: 4,
    birthdate: '1932-09-03',
    emergencyContact: { name: 'Sabine Gruber', relation: 'Tochter', phone: '+43 676 2345678' },
    tags: ['Demenz', 'Gehhilfe'],
  },
  {
    id: 'r3',
    name: 'Margarete Huber',
    room: '201',
    station: 'Station 2',
    pflegegrad: 2,
    birthdate: '1945-02-20',
    emergencyContact: { name: 'Klaus Huber', relation: 'Ehemann', phone: '+43 699 3456789' },
    tags: ['Hypertonie'],
  },
  {
    id: 'r4',
    name: 'Josef Berger',
    room: '203',
    station: 'Station 2',
    pflegegrad: 5,
    birthdate: '1929-11-08',
    emergencyContact: { name: 'Maria Berger', relation: 'Ehefrau', phone: '+43 660 4567890' },
    tags: ['Palliativ', 'Dekubitus'],
  },
  {
    id: 'r5',
    name: 'Elisabeth Mayr',
    room: '305',
    station: 'Station 3',
    pflegegrad: 3,
    birthdate: '1941-07-16',
    emergencyContact: { name: 'Thomas Mayr', relation: 'Sohn', phone: '+43 676 5678901' },
    tags: ['COPD'],
  },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'rep1',
    residentId: 'r1',
    author: 'Eva Müller',
    createdAt: '2026-04-17T06:30:00Z',
    text: 'Frau Weber hat gut geschlafen, Vitalwerte stabil. Blutzucker morgens 118 mg/dl.',
    sisFields: ['themenfeld-2', 'themenfeld-4'],
    signed: true,
  },
  {
    id: 'rep2',
    residentId: 'r1',
    author: 'Peter Schmidt',
    createdAt: '2026-04-16T14:15:00Z',
    text: 'Teilnahme an Gedächtnisrunde, aktiv und orientiert. Spaziergang im Garten.',
    sisFields: ['themenfeld-3', 'themenfeld-6'],
    signed: true,
  },
  {
    id: 'rep3',
    residentId: 'r2',
    author: 'Eva Müller',
    createdAt: '2026-04-17T07:00:00Z',
    text: 'Herr Gruber wirkt heute morgens unruhig, lehnt Frühstück teilweise ab.',
    sisFields: ['themenfeld-3', 'themenfeld-5'],
    signed: true,
  },
];

export const MOCK_VITALS: Record<string, { hr: VitalPoint[]; bp: VitalPoint[]; temp: VitalPoint[] }> = {
  r1: {
    hr: [
      { t: '07:00', v: 72 },
      { t: '11:00', v: 78 },
      { t: '15:00', v: 75 },
      { t: '19:00', v: 74 },
    ],
    bp: [
      { t: '07:00', v: 132 },
      { t: '15:00', v: 128 },
      { t: '19:00', v: 135 },
    ],
    temp: [
      { t: '07:00', v: 36.5 },
      { t: '15:00', v: 36.8 },
      { t: '19:00', v: 36.6 },
    ],
  },
  r2: {
    hr: [
      { t: '07:00', v: 88 },
      { t: '11:00', v: 92 },
      { t: '15:00', v: 85 },
    ],
    bp: [
      { t: '07:00', v: 148 },
      { t: '15:00', v: 142 },
    ],
    temp: [
      { t: '07:00', v: 37.2 },
      { t: '15:00', v: 37.0 },
    ],
  },
};

export const MOCK_MEDICATIONS: Medication[] = [
  {
    id: 'm1',
    residentId: 'r1',
    name: 'Metformin 500mg',
    dose: '1 Tbl.',
    schedule: ['08:00', '20:00'],
    taken: { '08:00': true, '20:00': false },
  },
  {
    id: 'm2',
    residentId: 'r1',
    name: 'Ramipril 5mg',
    dose: '1 Tbl.',
    schedule: ['08:00'],
    taken: { '08:00': true },
  },
  {
    id: 'm3',
    residentId: 'r2',
    name: 'Memantin 10mg',
    dose: '1 Tbl.',
    schedule: ['08:00', '20:00'],
    taken: { '08:00': true, '20:00': false },
  },
];

export const SIS_FIELDS = [
  { key: 'themenfeld-1', title: 'Kognition & Kommunikation' },
  { key: 'themenfeld-2', title: 'Mobilität & Bewegung' },
  { key: 'themenfeld-3', title: 'Krankheitsbezogene Anforderungen' },
  { key: 'themenfeld-4', title: 'Selbstversorgung' },
  { key: 'themenfeld-5', title: 'Leben in sozialen Beziehungen' },
  { key: 'themenfeld-6', title: 'Wohnen / Häuslichkeit' },
];

export const EMERGENCY_TYPES = [
  { key: 'sturz', label: 'Sturz', icon: 'alert-triangle' },
  { key: 'zustand', label: 'Zustandsverschlechterung', icon: 'activity' },
  { key: 'verletzung', label: 'Verletzung', icon: 'heart-pulse' },
  { key: 'feuer', label: 'Feuer / Evakuierung', icon: 'flame' },
] as const;
