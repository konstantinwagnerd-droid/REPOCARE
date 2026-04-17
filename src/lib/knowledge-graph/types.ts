/**
 * Knowledge-Graph-Domäne.
 *
 * Ein Graph aus typisierten Nodes und Edges. Angelehnt an Property-Graph-Modelle
 * (Neo4j / Cypher), aber bewusst minimal: nur String-Props, keine Queries mit
 * mehr als zwei Hops.
 */

export type NodeType =
  | 'resident'
  | 'staff'
  | 'family'
  | 'medication'
  | 'diagnosis'
  | 'measure'
  | 'expert-standard'
  | 'quality-indicator'
  | 'room'
  | 'shift';

export type EdgeType =
  | 'bezugspflege'         // staff → resident
  | 'angehoeriger-von'     // family → resident
  | 'nimmt-medikament'     // resident → medication
  | 'hat-diagnose'         // resident → diagnosis
  | 'interagiert-mit'      // medication → medication (Wechselwirkung)
  | 'adressiert'           // measure → diagnosis
  | 'gehoert-zu'           // measure → expert-standard
  | 'misst'                // quality-indicator → expert-standard
  | 'wohnt-in'             // resident → room
  | 'arbeitet-in-schicht'; // staff → shift

export type GraphNode = {
  id: string;
  type: NodeType;
  label: string;
  /** Zusätzliche Attribute, z.B. { age: 82, sector: "A1" }. */
  props?: Record<string, string | number | boolean>;
};

export type GraphEdge = {
  id: string;
  type: EdgeType;
  from: string;
  to: string;
  props?: Record<string, string | number | boolean>;
  /** Gewicht (0..1) — z.B. Intensität der Bezugspflege. */
  weight?: number;
};

export type Relation = {
  node: GraphNode;
  edge: GraphEdge;
};

export type GraphQuery = {
  /** Start-Node-IDs. */
  startNodeIds?: string[];
  /** Filter nach Node-Typen. */
  nodeTypes?: NodeType[];
  /** Filter nach Edge-Typen. */
  edgeTypes?: EdgeType[];
  /** Maximale Tiefe der Traversierung. Default 1. */
  depth?: number;
};

export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type Insight = {
  id: string;
  title: string;
  description: string;
  category: 'soziales' | 'medikation' | 'pflege' | 'qualitaet';
  /** Ergebnis der Ausführung — Rendering-fähig. */
  run: () => InsightResult;
};

export type InsightResult = {
  summary: string;
  rows: Array<{ label: string; values: string[]; badge?: string }>;
  /** Optional: Subgraph-Hervorhebung für die Visualisierung. */
  highlight?: { nodeIds: string[]; edgeIds: string[] };
};

export type Point = { x: number; y: number };
export type LayoutNode = GraphNode & Point & { vx: number; vy: number; r: number };
