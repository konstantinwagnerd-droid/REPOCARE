import { NextRequest, NextResponse } from 'next/server';
import { buildGraph } from '@/lib/knowledge-graph/builder';
import type { NodeType } from '@/lib/knowledge-graph/types';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const typesParam = url.searchParams.get('nodeTypes');
  const graph = buildGraph();
  if (typesParam) {
    const allowed = new Set(typesParam.split(',') as NodeType[]);
    const nodes = graph.nodes.filter((n) => allowed.has(n.type));
    const nodeIds = new Set(nodes.map((n) => n.id));
    const edges = graph.edges.filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to));
    return NextResponse.json({ graph: { nodes, edges } });
  }
  return NextResponse.json({ graph });
}
