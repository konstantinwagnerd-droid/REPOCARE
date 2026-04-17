'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, Filter, Lightbulb, Download, ChevronDown, ChevronRight } from 'lucide-react';
import type { EdgeType, Graph, NodeType } from '@/lib/knowledge-graph/types';
import { nodeColor, nodeTypeLabel, renderSvg } from '@/lib/knowledge-graph/viz';

const ALL_NODE_TYPES: NodeType[] = [
  'resident',
  'staff',
  'family',
  'medication',
  'diagnosis',
  'measure',
  'expert-standard',
  'quality-indicator',
  'room',
  'shift',
];

const ALL_EDGE_TYPES: EdgeType[] = [
  'bezugspflege',
  'angehoeriger-von',
  'nimmt-medikament',
  'hat-diagnose',
  'interagiert-mit',
  'adressiert',
  'gehoert-zu',
  'misst',
  'wohnt-in',
  'arbeitet-in-schicht',
];

type InsightMeta = { id: string; title: string; description: string; category: string };
type InsightResult = {
  summary: string;
  rows: Array<{ label: string; values: string[]; badge?: string }>;
  highlight?: { nodeIds: string[]; edgeIds: string[] };
};

type Props = { graph: Graph; insightsMeta: InsightMeta[] };

const categoryTone: Record<string, 'default' | 'info' | 'warning' | 'accent' | 'success'> = {
  soziales: 'info',
  medikation: 'warning',
  pflege: 'accent',
  qualitaet: 'success',
};

export function GraphClient({ graph, insightsMeta }: Props) {
  const [nodeFilter, setNodeFilter] = useState<Set<NodeType>>(new Set(ALL_NODE_TYPES));
  const [edgeFilter, setEdgeFilter] = useState<Set<EdgeType>>(new Set(ALL_EDGE_TYPES));
  const [expanded, setExpanded] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, InsightResult>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [activeHighlight, setActiveHighlight] = useState<{ nodeIds: string[]; edgeIds: string[] } | null>(null);

  const filteredGraph = useMemo<Graph>(() => {
    const nodes = graph.nodes.filter((n) => nodeFilter.has(n.type));
    const nodeIds = new Set(nodes.map((n) => n.id));
    const edges = graph.edges.filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to) && edgeFilter.has(e.type));
    return { nodes, edges };
  }, [graph, nodeFilter, edgeFilter]);

  const svg = useMemo(
    () =>
      renderSvg(filteredGraph, {
        width: 1100,
        height: 680,
        highlightNodeIds: activeHighlight?.nodeIds,
        highlightEdgeIds: activeHighlight?.edgeIds,
      }),
    [filteredGraph, activeHighlight]
  );

  const runInsight = async (id: string) => {
    if (results[id]) {
      toggle(id);
      return;
    }
    setLoading(id);
    try {
      const res = await fetch(`/api/knowledge-graph/insights?id=${id}`);
      if (!res.ok) return;
      const data = (await res.json()) as { result: InsightResult };
      setResults((prev) => ({ ...prev, [id]: data.result }));
      setExpanded(id);
      if (data.result.highlight) setActiveHighlight(data.result.highlight);
    } finally {
      setLoading(null);
    }
  };

  const toggle = (id: string) => {
    setExpanded((e) => (e === id ? null : id));
    const r = results[id];
    if (r?.highlight && expanded !== id) setActiveHighlight(r.highlight);
    else setActiveHighlight(null);
  };

  const toggleNode = (t: NodeType) => {
    setNodeFilter((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };
  const toggleEdge = (t: EdgeType) => {
    setEdgeFilter((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_400px]">
      <section className="space-y-4 p-6 lg:p-10">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 font-serif text-3xl font-semibold tracking-tight">
              <Network className="h-7 w-7 text-primary" /> Knowledge Graph
            </h1>
            <p className="mt-1 text-muted-foreground">
              {filteredGraph.nodes.length} Nodes · {filteredGraph.edges.length} Edges
              {activeHighlight && <> · <button className="underline" onClick={() => setActiveHighlight(null)}>Hervorhebung entfernen</button></>}
            </p>
          </div>
          <Button asChild variant="outline">
            <a href="/api/knowledge-graph/export"><Download className="mr-2 h-4 w-4" /> JSON-Export</a>
          </Button>
        </header>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4 text-primary" /> Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Node-Typen</div>
              <div className="flex flex-wrap gap-2">
                {ALL_NODE_TYPES.map((t) => (
                  <FilterChip key={t} active={nodeFilter.has(t)} color={nodeColor(t)} onClick={() => toggleNode(t)}>
                    {nodeTypeLabel(t)}
                  </FilterChip>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Edge-Typen</div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_EDGE_TYPES.map((t) => (
                  <FilterChip key={t} active={edgeFilter.has(t)} onClick={() => toggleEdge(t)}>
                    {t}
                  </FilterChip>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-lg border border-border bg-background" dangerouslySetInnerHTML={{ __html: svg }} />
          </CardContent>
        </Card>
      </section>

      <aside className="border-l border-border bg-card p-4 lg:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Lightbulb className="h-5 w-5 text-amber-500" /> Insights
        </h2>
        <div className="space-y-2">
          {insightsMeta.map((i) => {
            const open = expanded === i.id;
            const r = results[i.id];
            return (
              <div key={i.id} className="rounded-lg border border-border bg-background">
                <button
                  onClick={() => runInsight(i.id)}
                  aria-expanded={open}
                  className="flex w-full items-start justify-between gap-2 p-3 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={categoryTone[i.category] ?? 'default'}>{i.category}</Badge>
                      <span className="text-sm font-semibold">{i.title}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{i.description}</p>
                  </div>
                  {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </button>
                {open && r && (
                  <div className="space-y-2 border-t border-border p-3">
                    <p className="text-xs text-muted-foreground">{r.summary}</p>
                    {loading === i.id && <p className="text-xs">Berechne …</p>}
                    <ul className="space-y-1.5">
                      {r.rows.map((row, idx) => (
                        <li key={idx} className="rounded border border-border p-2 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold">{row.label}</span>
                            {row.badge && <Badge variant="outline">{row.badge}</Badge>}
                          </div>
                          <ul className="mt-1 space-y-0.5 text-muted-foreground">
                            {row.values.map((v, i2) => (<li key={i2}>· {v}</li>))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

function FilterChip({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
        active ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-background text-muted-foreground hover:bg-muted'
      }`}
    >
      {color && <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />}
      {children}
    </button>
  );
}
