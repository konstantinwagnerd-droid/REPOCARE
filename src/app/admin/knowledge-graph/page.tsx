import { buildGraph } from '@/lib/knowledge-graph/builder';
import { INSIGHTS } from '@/lib/knowledge-graph/insights';
import { GraphClient } from './graph-client';

export const metadata = { title: 'Knowledge Graph · CareAI Admin' };

export default function KnowledgeGraphPage() {
  const graph = buildGraph();
  const insightsMeta = INSIGHTS.map((i) => ({
    id: i.id,
    title: i.title,
    description: i.description,
    category: i.category,
  }));
  return <GraphClient graph={graph} insightsMeta={insightsMeta} />;
}
