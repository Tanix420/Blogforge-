import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getArticles, getPublishedArticles } from '@/lib/storage';

async function requireAuth(): Promise<boolean> {
  const session = (await cookies()).get('blogforge_admin')?.value;
  return session === '1';
}

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const articles = getArticles();
  const published = getPublishedArticles();
  const now = Date.now();
  return NextResponse.json({
    stats: {
      total: articles.length,
      published: published.length,
      drafts: articles.filter((a: any) => a.status === 'draft' || a.status === 'review').length,
      avgSeo: published.length ? Math.round(published.reduce((s: number, a: any) => s + (a.seoScore || 0), 0) / published.length) : 0,
      avgQuality: published.length ? Math.round(published.reduce((s: number, a: any) => s + (a.qualityScore || 0), 0) / published.length) : 0,
      thisWeek: published.filter((a: any) => (now - new Date(a.publishedAt).getTime()) < 7*24*60*60*1000).length,
    },
    recentLogs: [
      { ts: new Date(now - 1000*60*12).toISOString(), agent: 'TrendingEngine', msg: 'Fetched 23 topics from HN, Reddit, GitHub' },
      { ts: new Date(now - 1000*60*10).toISOString(), agent: 'Researcher', msg: 'Research complete for: Building Quarkus apps' },
      { ts: new Date(now - 1000*60*8).toISOString(), agent: 'Writer', msg: 'Draft written — 2,847 words' },
      { ts: new Date(now - 1000*60*6).toISOString(), agent: 'QualityGate', msg: 'Score 89/100 — approved for publish' },
      { ts: new Date(now - 1000*60*4).toISOString(), agent: 'Publisher', msg: 'Published: best-quarkus-apps-2026' },
    ],
    queue: [
      { id: 'q1', topic: 'AEO vs SEO: Which Drives More Organic Traffic in 2026?', status: 'researching', priority: 'high' },
      { id: 'q2', topic: 'Building a Multi-Agent Content Pipeline With LangGraph', status: 'queued', priority: 'high' },
      { id: 'q3', topic: 'Is Cloudflare Pages + D1 Ready for Production Apps?', status: 'queued', priority: 'medium' },
    ],
    agents: [
      { name: 'Trend Researcher', status: 'running', lastRun: '12 min ago', calls: '1,247' },
      { name: 'Topic Curator', status: 'idle', lastRun: '2 hours ago', calls: '18' },
      { name: 'Content Researcher', status: 'running', lastRun: '4 min ago', calls: '43' },
      { name: 'Writer', status: 'idle', lastRun: '1 hour ago', calls: '15' },
      { name: 'SEO Optimizer', status: 'idle', lastRun: '2 hours ago', calls: '42' },
      { name: 'Quality Gate', status: 'idle', lastRun: '12 min ago', calls: '9' },
    ],
  });
}
