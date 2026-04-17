import { NextResponse } from 'next/server';
import { buildGraph } from '@/lib/knowledge-graph/builder';

export async function GET() {
  const graph = buildGraph();
  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    stats: { nodes: graph.nodes.length, edges: graph.edges.length },
    ...graph,
  };
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="knowledge-graph-${Date.now()}.json"`,
    },
  });
}
