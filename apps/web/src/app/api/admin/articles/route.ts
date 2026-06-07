import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getArticles, saveArticles } from '@/lib/storage';

async function requireAuth(): Promise<boolean> {
  const session = (await cookies()).get('blogforge_admin')?.value;
  return session === '1';
}

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(getArticles());
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    const articles = getArticles();
    const article = {
      id: `art-${Date.now()}`,
      slug: body.slug || `article-${Date.now()}`,
      title: body.title || 'Untitled',
      content: body.content || '',
      status: body.status || 'draft',
      ...body,
    };
    articles.unshift(article);
    saveArticles(articles);
    return NextResponse.json(article, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to save article' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const slug = body.slug;
    if (!slug) return NextResponse.json({ ok: false }, { status: 400 });
    const articles = getArticles();
    const idx = articles.findIndex((a: any) => a.slug === slug);
    if (idx < 0) return NextResponse.json({ ok: false }, { status: 404 });
    articles[idx] = { ...articles[idx], ...body, slug };
    saveArticles(articles);
    return NextResponse.json({ ok: true, article: articles[idx] });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
