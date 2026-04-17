/**
 * Leichtgewichtiger force-directed SVG-Renderer.
 *
 * Bewusst kein d3/viz.js: wir emittieren reines, serverseitig renderbares SVG
 * und eine Hydrierungs-Variante für den Client. Die Simulation ist ein
 * einfaches Federn-Modell mit Coulomb-Repulsion, 200 Iterationen — für ≤200
 * Nodes reicht das völlig.
 */
import type { Graph, GraphEdge, LayoutNode, NodeType } from './types';

export type RenderOptions = {
  width?: number;
  height?: number;
  iterations?: number;
  /** Node-IDs, die hervorgehoben werden sollen. */
  highlightNodeIds?: string[];
  /** Edge-IDs, die hervorgehoben werden sollen. */
  highlightEdgeIds?: string[];
  /** Nur diese Node-Typen rendern. */
  nodeTypes?: NodeType[];
};

const colorByType: Record<NodeType, string> = {
  resident: '#0F766E',
  staff: '#F97316',
  family: '#EC4899',
  medication: '#8B5CF6',
  diagnosis: '#EF4444',
  measure: '#10B981',
  'expert-standard': '#0EA5E9',
  'quality-indicator': '#F59E0B',
  room: '#64748B',
  shift: '#9CA3AF',
};

const labelByType: Record<NodeType, string> = {
  resident: 'Bewohner:in',
  staff: 'Pflege',
  family: 'Angehörige',
  medication: 'Medikament',
  diagnosis: 'Diagnose',
  measure: 'Maßnahme',
  'expert-standard': 'Expertenstandard',
  'quality-indicator': 'QI',
  room: 'Zimmer',
  shift: 'Schicht',
};

export function nodeColor(type: NodeType) {
  return colorByType[type];
}

export function nodeTypeLabel(type: NodeType) {
  return labelByType[type];
}

/** Pseudozufälliger, deterministischer Hash auf [0, 1). */
function rand(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}

export function layout(graph: Graph, opts: RenderOptions = {}): { nodes: LayoutNode[]; edges: GraphEdge[] } {
  const width = opts.width ?? 1000;
  const height = opts.height ?? 700;
  const iter = opts.iterations ?? 180;
  const allowedTypes = opts.nodeTypes ? new Set(opts.nodeTypes) : null;

  const filteredNodes = allowedTypes ? graph.nodes.filter((n) => allowedTypes.has(n.type)) : graph.nodes;
  const idSet = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = graph.edges.filter((e) => idSet.has(e.from) && idSet.has(e.to));

  const r = rand(42);
  const nodes: LayoutNode[] = filteredNodes.map((n, i) => ({
    ...n,
    x: width / 2 + (r() - 0.5) * width * 0.6,
    y: height / 2 + (r() - 0.5) * height * 0.6,
    vx: 0,
    vy: 0,
    r: 10 + Math.min(18, (filteredEdges.filter((e) => e.from === n.id || e.to === n.id).length) * 1.2),
  }));

  const byId = new Map(nodes.map((n) => [n.id, n] as const));
  const linkLen = 90;
  const repulse = 2400;
  const spring = 0.04;
  const damping = 0.85;

  for (let t = 0; t < iter; t++) {
    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i]!;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j]!;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy + 0.01;
        const f = repulse / d2;
        const d = Math.sqrt(d2);
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
    }
    // Springs
    for (const e of filteredEdges) {
      const a = byId.get(e.from)!;
      const b = byId.get(e.to)!;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
      const f = (d - linkLen) * spring;
      const fx = (dx / d) * f;
      const fy = (dy / d) * f;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    }
    // Integration + center pull
    for (const n of nodes) {
      n.vx = (n.vx + (width / 2 - n.x) * 0.001) * damping;
      n.vy = (n.vy + (height / 2 - n.y) * 0.001) * damping;
      n.x += n.vx;
      n.y += n.vy;
      n.x = Math.max(30, Math.min(width - 30, n.x));
      n.y = Math.max(30, Math.min(height - 30, n.y));
    }
  }

  return { nodes, edges: filteredEdges };
}

export function renderSvg(graph: Graph, opts: RenderOptions = {}): string {
  const width = opts.width ?? 1000;
  const height = opts.height ?? 700;
  const { nodes, edges } = layout(graph, opts);
  const byId = new Map(nodes.map((n) => [n.id, n] as const));
  const hN = new Set(opts.highlightNodeIds ?? []);
  const hE = new Set(opts.highlightEdgeIds ?? []);

  const edgeSvg = edges
    .map((e) => {
      const a = byId.get(e.from);
      const b = byId.get(e.to);
      if (!a || !b) return '';
      const highlighted = hE.has(e.id);
      const color = highlighted ? '#DC2626' : '#D1D5DB';
      const strokeWidth = highlighted ? 2.5 : 1;
      const dash = e.type === 'interagiert-mit' ? ' stroke-dasharray="4 3"' : '';
      return `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${color}" stroke-width="${strokeWidth}"${dash} />`;
    })
    .join('');

  const nodeSvg = nodes
    .map((n) => {
      const highlighted = hN.has(n.id) || hN.size === 0;
      const dim = opts.highlightNodeIds && opts.highlightNodeIds.length > 0 && !hN.has(n.id);
      const fill = colorByType[n.type];
      const opacity = dim ? 0.25 : 1;
      const ring = hN.has(n.id) && opts.highlightNodeIds && opts.highlightNodeIds.length > 0
        ? `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${(n.r + 5).toFixed(1)}" fill="none" stroke="#DC2626" stroke-width="2" />`
        : '';
      const shortLabel = n.label.length > 22 ? n.label.slice(0, 20) + '…' : n.label;
      return `
        <g opacity="${opacity}">
          ${ring}
          <circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(1)}" fill="${fill}" stroke="#fff" stroke-width="1.5" />
          <text x="${n.x.toFixed(1)}" y="${(n.y + n.r + 12).toFixed(1)}" font-family="system-ui,sans-serif" font-size="10" fill="currentColor" text-anchor="middle">${escapeXml(shortLabel)}</text>
        </g>`;
    })
    .join('');

  const legend = Object.entries(colorByType)
    .map(([type, color], i) => {
      const x = 12;
      const y = 20 + i * 18;
      return `<g><circle cx="${x}" cy="${y}" r="6" fill="${color}" /><text x="${x + 14}" y="${y + 4}" font-size="11" font-family="system-ui" fill="currentColor">${labelByType[type as NodeType]}</text></g>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img" aria-label="Knowledge Graph">
    <rect width="${width}" height="${height}" fill="transparent" />
    ${edgeSvg}
    ${nodeSvg}
    <g class="legend">${legend}</g>
  </svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
