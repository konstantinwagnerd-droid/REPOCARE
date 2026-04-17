/**
 * 10 vordefinierte Insight-Queries.
 * Jede Insight liest aus dem Graph, beschreibt Findings und markiert einen
 * Subgraph für die Visualisierung.
 */
import { buildGraph } from './builder';
import { degree, findNodesByType, incomingEdges, neighbors, outgoingEdges } from './query';
import type { Insight, InsightResult } from './types';

const run = (fn: () => InsightResult) => fn;

export const INSIGHTS: Insight[] = [
  {
    id: 'shared-carer',
    title: 'Bewohner:innen mit gemeinsamer Bezugspflege',
    description: 'Welche Bewohner:innen werden von derselben Pflegekraft als Bezugspflege betreut?',
    category: 'soziales',
    run: run(() => {
      const g = buildGraph();
      const rows: InsightResult['rows'] = [];
      const highlightNodes = new Set<string>();
      const highlightEdges = new Set<string>();
      for (const staff of findNodesByType(g, 'staff')) {
        const residents = outgoingEdges(g, staff.id, ['bezugspflege']);
        if (residents.length >= 2) {
          const names = residents
            .map((e) => g.nodes.find((n) => n.id === e.to)?.label)
            .filter(Boolean) as string[];
          rows.push({ label: staff.label, values: names, badge: `${residents.length} Bew.` });
          highlightNodes.add(staff.id);
          residents.forEach((e) => {
            highlightNodes.add(e.to);
            highlightEdges.add(e.id);
          });
        }
      }
      return {
        summary: rows.length === 0 ? 'Keine Doppel-Bezugspflege gefunden.' : `${rows.length} Pflegekräfte betreuen je ≥2 Bewohner:innen.`,
        rows,
        highlight: { nodeIds: Array.from(highlightNodes), edgeIds: Array.from(highlightEdges) },
      };
    }),
  },
  {
    id: 'med-interactions',
    title: 'Medikamenten-Wechselwirkungen bei konkreten Bewohner:innen',
    description: 'Bewohner:innen, die zwei interagierende Medikamente gleichzeitig nehmen.',
    category: 'medikation',
    run: run(() => {
      const g = buildGraph();
      const interactions = g.edges.filter((e) => e.type === 'interagiert-mit');
      const rows: InsightResult['rows'] = [];
      const hn = new Set<string>();
      const he = new Set<string>();
      for (const ia of interactions) {
        const patientsA = incomingEdges(g, ia.from, ['nimmt-medikament']).map((e) => e.from);
        const patientsB = incomingEdges(g, ia.to, ['nimmt-medikament']).map((e) => e.from);
        const both = patientsA.filter((p) => patientsB.includes(p));
        const medA = g.nodes.find((n) => n.id === ia.from)?.label ?? '?';
        const medB = g.nodes.find((n) => n.id === ia.to)?.label ?? '?';
        both.forEach((pid) => {
          const pName = g.nodes.find((n) => n.id === pid)?.label ?? pid;
          rows.push({
            label: pName,
            values: [medA, medB],
            badge: String(ia.props?.severity ?? 'mittel'),
          });
          hn.add(pid);
          hn.add(ia.from);
          hn.add(ia.to);
          he.add(ia.id);
        });
      }
      return {
        summary: rows.length === 0 ? 'Keine Wechselwirkungen gefunden.' : `${rows.length} kritische Kombinationen.`,
        rows,
        highlight: { nodeIds: Array.from(hn), edgeIds: Array.from(he) },
      };
    }),
  },
  {
    id: 'isolated-residents',
    title: 'Wer ist sozial isoliert?',
    description: 'Bewohner:innen ohne Bezugspflege und/oder ohne Angehörige im System.',
    category: 'soziales',
    run: run(() => {
      const g = buildGraph();
      const rows: InsightResult['rows'] = [];
      const hn = new Set<string>();
      for (const r of findNodesByType(g, 'resident')) {
        const hasCarer = incomingEdges(g, r.id, ['bezugspflege']).length > 0;
        const hasFam = incomingEdges(g, r.id, ['angehoeriger-von']).length > 0;
        if (!hasCarer || !hasFam) {
          const tags: string[] = [];
          if (!hasCarer) tags.push('keine Bezugspflege');
          if (!hasFam) tags.push('keine Angehörigen');
          rows.push({ label: r.label, values: tags, badge: !hasCarer && !hasFam ? 'hoch' : 'mittel' });
          hn.add(r.id);
        }
      }
      return {
        summary: rows.length === 0 ? 'Alle Bewohner:innen sozial angebunden.' : `${rows.length} potenzielle Isolations-Fälle.`,
        rows,
        highlight: { nodeIds: Array.from(hn), edgeIds: [] },
      };
    }),
  },
  {
    id: 'medication-clusters',
    title: 'Medikations-Cluster',
    description: 'Welche Medikamente werden häufig zusammen verschrieben?',
    category: 'medikation',
    run: run(() => {
      const g = buildGraph();
      const combo = new Map<string, number>();
      for (const r of findNodesByType(g, 'resident')) {
        const meds = outgoingEdges(g, r.id, ['nimmt-medikament']).map((e) => e.to).sort();
        for (let i = 0; i < meds.length; i++) {
          for (let j = i + 1; j < meds.length; j++) {
            const a = meds[i]!;
            const b = meds[j]!;
            const key = `${a}|${b}`;
            combo.set(key, (combo.get(key) ?? 0) + 1);
          }
        }
      }
      const rows: InsightResult['rows'] = [];
      const hn = new Set<string>();
      Array.from(combo.entries())
        .filter(([, c]) => c >= 2)
        .sort((a, b) => b[1] - a[1])
        .forEach(([key, c]) => {
          const [a, b] = key.split('|');
          const la = g.nodes.find((n) => n.id === a)?.label ?? a!;
          const lb = g.nodes.find((n) => n.id === b)?.label ?? b!;
          rows.push({ label: `${la} + ${lb}`, values: [`${c} Bewohner:innen`], badge: String(c) });
          hn.add(a!);
          hn.add(b!);
        });
      return {
        summary: rows.length === 0 ? 'Keine Cluster ≥2.' : `${rows.length} Medikamenten-Paare in ≥2 Fällen.`,
        rows,
        highlight: { nodeIds: Array.from(hn), edgeIds: [] },
      };
    }),
  },
  {
    id: 'diagnosis-measures-coverage',
    title: 'Abdeckung Diagnose → Maßnahme',
    description: 'Welche Diagnosen haben keine zugeordnete Pflege-Maßnahme?',
    category: 'pflege',
    run: run(() => {
      const g = buildGraph();
      const rows: InsightResult['rows'] = [];
      const hn = new Set<string>();
      for (const dx of findNodesByType(g, 'diagnosis')) {
        const measures = incomingEdges(g, dx.id, ['adressiert']);
        rows.push({
          label: dx.label,
          values: measures.length > 0
            ? measures.map((e) => g.nodes.find((n) => n.id === e.from)?.label ?? '?')
            : ['— keine Maßnahme —'],
          badge: measures.length > 0 ? 'ok' : 'lücke',
        });
        if (measures.length === 0) hn.add(dx.id);
      }
      return {
        summary: `${rows.filter((r) => r.badge === 'lücke').length} Diagnosen ohne Maßnahme.`,
        rows,
        highlight: { nodeIds: Array.from(hn), edgeIds: [] },
      };
    }),
  },
  {
    id: 'standards-coverage',
    title: 'Expertenstandards — Umsetzung',
    description: 'Welche Expertenstandards werden durch ≥1 Maßnahme umgesetzt und durch QIs gemessen?',
    category: 'qualitaet',
    run: run(() => {
      const g = buildGraph();
      const rows: InsightResult['rows'] = [];
      const hn = new Set<string>();
      for (const st of findNodesByType(g, 'expert-standard')) {
        const measures = incomingEdges(g, st.id, ['gehoert-zu']).length;
        const qis = incomingEdges(g, st.id, ['misst']).length;
        rows.push({
          label: st.label,
          values: [`${measures} Maßnahmen`, `${qis} QIs`],
          badge: measures > 0 && qis > 0 ? 'ok' : 'lücke',
        });
        if (measures === 0 || qis === 0) hn.add(st.id);
      }
      return {
        summary: `${rows.filter((r) => r.badge === 'lücke').length} Standards mit Lücken.`,
        rows,
        highlight: { nodeIds: Array.from(hn), edgeIds: [] },
      };
    }),
  },
  {
    id: 'polypharmacy',
    title: 'Polypharmazie-Screening',
    description: 'Bewohner:innen mit ≥3 Dauermedikamenten — erhöhtes Risiko.',
    category: 'medikation',
    run: run(() => {
      const g = buildGraph();
      const rows: InsightResult['rows'] = [];
      const hn = new Set<string>();
      for (const r of findNodesByType(g, 'resident')) {
        const meds = outgoingEdges(g, r.id, ['nimmt-medikament']);
        if (meds.length >= 3) {
          rows.push({
            label: r.label,
            values: meds.map((e) => g.nodes.find((n) => n.id === e.to)?.label ?? '?'),
            badge: `${meds.length} Med.`,
          });
          hn.add(r.id);
          meds.forEach((e) => hn.add(e.to));
        }
      }
      return {
        summary: `${rows.length} Bewohner:innen mit Polypharmazie.`,
        rows,
        highlight: { nodeIds: Array.from(hn), edgeIds: [] },
      };
    }),
  },
  {
    id: 'high-degree-staff',
    title: 'Pflegekräfte mit hoher Netzwerkzentralität',
    description: 'Mitarbeiter:innen, die am meisten Verbindungen haben (Key-Person-Risiko).',
    category: 'pflege',
    run: run(() => {
      const g = buildGraph();
      const staff = findNodesByType(g, 'staff')
        .map((n) => ({ n, d: degree(g, n.id) }))
        .sort((a, b) => b.d - a.d);
      const hn = new Set<string>();
      const rows = staff.slice(0, 5).map((s) => {
        hn.add(s.n.id);
        return { label: s.n.label, values: [`Grad ${s.d}`], badge: s.d >= 3 ? 'key' : 'ok' };
      });
      return {
        summary: `Top ${rows.length} nach Zentralität.`,
        rows,
        highlight: { nodeIds: Array.from(hn), edgeIds: [] },
      };
    }),
  },
  {
    id: 'room-clusters',
    title: 'Zimmer-Cluster (gleiche Bezugspflege im Sektor)',
    description: 'Gibt es Sektoren, die von derselben Pflegekraft dominiert betreut werden?',
    category: 'pflege',
    run: run(() => {
      const g = buildGraph();
      const rows: InsightResult['rows'] = [];
      const sectors = new Map<string, string[]>();
      for (const r of findNodesByType(g, 'resident')) {
        const roomId = outgoingEdges(g, r.id, ['wohnt-in'])[0]?.to;
        if (!roomId) continue;
        const sector = (g.nodes.find((n) => n.id === roomId)?.label ?? '?').split(' ')[1]?.[0] ?? '?';
        const carer = incomingEdges(g, r.id, ['bezugspflege'])[0]?.from;
        const carerName = carer ? g.nodes.find((n) => n.id === carer)?.label ?? '-' : '-';
        const key = `${sector}::${carerName}`;
        sectors.set(key, [...(sectors.get(key) ?? []), r.label]);
      }
      for (const [key, residents] of sectors) {
        if (residents.length >= 2) {
          const [sector, carer] = key.split('::');
          rows.push({ label: `Sektor ${sector} · ${carer}`, values: residents, badge: `${residents.length}` });
        }
      }
      return {
        summary: rows.length === 0 ? 'Keine dominanten Cluster.' : `${rows.length} Sektor-Cluster erkannt.`,
        rows,
        highlight: { nodeIds: [], edgeIds: [] },
      };
    }),
  },
  {
    id: 'family-reach',
    title: 'Angehörigen-Reichweite',
    description: 'Wie viele Bewohner:innen haben mind. eine:n angebundene:n Angehörige:n?',
    category: 'soziales',
    run: run(() => {
      const g = buildGraph();
      const residents = findNodesByType(g, 'resident');
      const rows: InsightResult['rows'] = [];
      const hn = new Set<string>();
      for (const r of residents) {
        const fam = incomingEdges(g, r.id, ['angehoeriger-von']);
        const rels = neighbors(g, r.id, ['angehoeriger-von'])
          .map((x) => `${x.node.label} (${x.edge.props?.relation ?? '-'})`);
        rows.push({
          label: r.label,
          values: rels.length > 0 ? rels : ['— niemand —'],
          badge: fam.length > 0 ? String(fam.length) : '0',
        });
        if (fam.length === 0) hn.add(r.id);
      }
      const covered = rows.filter((r) => r.badge !== '0').length;
      return {
        summary: `${covered}/${rows.length} Bewohner:innen mit Angehörigen im System.`,
        rows,
        highlight: { nodeIds: Array.from(hn), edgeIds: [] },
      };
    }),
  },
];

export function getInsight(id: string): Insight | undefined {
  return INSIGHTS.find((i) => i.id === id);
}
