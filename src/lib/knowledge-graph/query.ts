/**
 * Minimale Graph-Traversal-API — Cypher-inspired, aber stark reduziert:
 *  - `neighbors(node)` — 1-Hop
 *  - `traverse(query)` — BFS bis Tiefe N, optional gefiltert
 *  - `findNodesByType(type)` / `findNodeById(id)`
 *  - `incomingEdges(node)` / `outgoingEdges(node)`
 *
 * Kein Optimizer, keine Indizes — für < 10 000 Nodes ausreichend.
 */
import type { EdgeType, Graph, GraphEdge, GraphNode, GraphQuery, NodeType, Relation } from './types';

export function findNodeById(g: Graph, id: string): GraphNode | undefined {
  return g.nodes.find((n) => n.id === id);
}

export function findNodesByType(g: Graph, type: NodeType): GraphNode[] {
  return g.nodes.filter((n) => n.type === type);
}

export function outgoingEdges(g: Graph, nodeId: string, edgeTypes?: EdgeType[]): GraphEdge[] {
  return g.edges.filter((e) => e.from === nodeId && (!edgeTypes || edgeTypes.includes(e.type)));
}

export function incomingEdges(g: Graph, nodeId: string, edgeTypes?: EdgeType[]): GraphEdge[] {
  return g.edges.filter((e) => e.to === nodeId && (!edgeTypes || edgeTypes.includes(e.type)));
}

export function neighbors(g: Graph, nodeId: string, edgeTypes?: EdgeType[]): Relation[] {
  const rels: Relation[] = [];
  for (const e of g.edges) {
    if (edgeTypes && !edgeTypes.includes(e.type)) continue;
    if (e.from === nodeId) {
      const n = findNodeById(g, e.to);
      if (n) rels.push({ node: n, edge: e });
    } else if (e.to === nodeId) {
      const n = findNodeById(g, e.from);
      if (n) rels.push({ node: n, edge: e });
    }
  }
  return rels;
}

export function traverse(g: Graph, q: GraphQuery): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const depth = q.depth ?? 1;
  const start = q.startNodeIds && q.startNodeIds.length > 0
    ? q.startNodeIds
    : q.nodeTypes
    ? g.nodes.filter((n) => q.nodeTypes!.includes(n.type)).map((n) => n.id)
    : g.nodes.map((n) => n.id);

  const visited = new Set<string>();
  const edgeIds = new Set<string>();
  const queue: Array<{ id: string; d: number }> = start.map((id) => ({ id, d: 0 }));

  while (queue.length > 0) {
    const { id, d } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    if (d >= depth) continue;
    const rels = neighbors(g, id, q.edgeTypes);
    for (const r of rels) {
      if (q.nodeTypes && !q.nodeTypes.includes(r.node.type)) continue;
      edgeIds.add(r.edge.id);
      if (!visited.has(r.node.id)) queue.push({ id: r.node.id, d: d + 1 });
    }
  }

  return {
    nodes: g.nodes.filter((n) => visited.has(n.id)),
    edges: g.edges.filter((e) => edgeIds.has(e.id)),
  };
}

/** Gemeinsame Nachbarn zweier Nodes. */
export function commonNeighbors(g: Graph, aId: string, bId: string): GraphNode[] {
  const aN = new Set(neighbors(g, aId).map((r) => r.node.id));
  return neighbors(g, bId)
    .map((r) => r.node)
    .filter((n) => aN.has(n.id));
}

/** Grad eines Nodes (Anzahl ein- und ausgehender Edges). */
export function degree(g: Graph, nodeId: string): number {
  return g.edges.reduce((sum, e) => sum + (e.from === nodeId || e.to === nodeId ? 1 : 0), 0);
}
