import { NextRequest, NextResponse } from 'next/server';
import { icdCategories, searchIcd } from '@/lib/telemedizin/icd';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? '';
  const limit = Number(url.searchParams.get('limit') ?? '50');
  return NextResponse.json({
    entries: searchIcd(q, limit),
    categories: icdCategories(),
  });
}
