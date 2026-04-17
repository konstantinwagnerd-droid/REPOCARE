import { NextRequest, NextResponse } from 'next/server';
import { INSIGHTS, getInsight } from '@/lib/knowledge-graph/insights';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (id) {
    const ins = getInsight(id);
    if (!ins) return NextResponse.json({ error: 'Unbekannte Insight' }, { status: 404 });
    const result = ins.run();
    return NextResponse.json({
      insight: { id: ins.id, title: ins.title, description: ins.description, category: ins.category },
      result,
    });
  }
  return NextResponse.json({
    insights: INSIGHTS.map((i) => ({
      id: i.id,
      title: i.title,
      description: i.description,
      category: i.category,
    })),
  });
}
