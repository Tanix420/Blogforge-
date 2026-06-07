import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function isAuthenticated() {
  const session = (await cookies()).get('blogforge_admin')?.value;
  return !!session;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({
    stats: {
      totalArticles: 12,
      publishedArticles: 9,
      draftArticles: 3,
      avgSeo: 87,
    },
    agents: [
      { name: 'Trend Researcher', status: 'idle', lastRun: '2 hours ago', calls: 24 },
      { name: 'Topic Curator', status: 'idle', lastRun: '2 hours ago', calls: 18 },
      { name: 'Content Researcher', status: 'idle', lastRun: '1 hour ago', calls: 31 },
      { name: 'Writer', status: 'idle', lastRun: '1 hour ago', calls: 15 },
      { name: 'SEO Optimizer', status: 'running', lastRun: '12 min ago', calls: 42 },
      { name: 'Quality Gate', status: 'idle', lastRun: '12 min ago', calls: 9 },
    ],
    logs: [
      { ts: Date.now() - 420000, agent: 'Trend Researcher', msg: 'Trend analysis complete: 3 topics identified' },
      { ts: Date.now() - 360000, agent: 'Topic Curator', msg: 'Selected topic: AI Copywriting Tools 2026' },
      { ts: Date.now() - 300000, agent: 'Content Researcher', msg: 'Research complete: 8 sources gathered' },
      { ts: Date.now() - 240000, agent: 'Writer', msg: 'Article generated: 2,400 words' },
      { ts: Date.now() - 180000, agent: 'SEO Optimizer', msg: 'Score: 92/100 — passed' },
    ],
    queue: [
      { id: '1', topic: 'Future of AI Agents in 2026', niche: 'AI & Machine Learning', status: 'queued', progress: 0 },
      { id: '2', topic: 'SEO Best Practices for AI Content', niche: 'SEO', status: 'running', progress: 45 },
    ],
  });
}
