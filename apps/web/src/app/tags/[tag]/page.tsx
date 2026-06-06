import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPublishedArticles, getArticles } from '@/lib/articles';
import { ChevronLeft, Clock, BarChart3, Search } from 'lucide-react';
import { FadeUp } from '@/components/motion/motion';

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const articles = getPublishedArticles();
  const tags = new Set<string>();
  articles.forEach(a => (a.tags ?? []).forEach((t: string) => tags.add(t)));
  return Array.from(tags).map(t => ({ tag: t }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag} – BlogForge AI`,
    description: `Articles tagged with #${tag} on BlogForge AI.`,
    openGraph: {
      title: `#${tag} – BlogForge AI`,
      description: `Articles tagged with #${tag} on BlogForge AI.`,
      url: `https://blogforge.org/tags/${encodeURIComponent(tag)}`,
      siteName: 'BlogForge AI',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1676328179249-b56304e247d3?w=1200&q=80',
          width: 1200,
          height: 630,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `#${tag} – BlogForge AI`,
      description: `Articles tagged with #${tag} on BlogForge AI.`,
      images: ['https://images.unsplash.com/photo-1676328179249-b56304e247d3?w=1200&q=80'],
    },
    alternates: { canonical: `/tags/${tag}` },
  };
}

export default function TagPage({ params }: PageProps) {
  const { tag } = params instanceof Promise ? { tag: '' } : params;
  const resolvedTag = (tag as string) || '';

  const articles = getPublishedArticles().filter(a => (a.tags ?? []).includes(resolvedTag));

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <FadeUp>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
                #{resolvedTag}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--ink-tertiary)' }}>
                {articles.length} article{articles.length !== 1 ? 's' : ''} tagged
              </p>
            </div>
            <Link href="/articles" className="text-xs inline-flex items-center gap-1 text-ink-muted hover:text-ink-primary transition-colors">
              <ChevronLeft size={14} /> All articles
            </Link>
          </div>
        </FadeUp>

        {articles.length === 0 ? (
          <FadeUp>
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏷️</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--ink-tertiary)' }}>No articles here</h3>
              <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                <Link href="/articles" className="text-accent-strong underline">Browse all articles</Link> to find what you're looking for.
              </p>
            </div>
          </FadeUp>
        ) : (
          <div className="space-y-4">
            {articles.map((a, i) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} className="block card card-interactive p-5 group">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {a.category && <span className="badge badge-accent">{a.category}</span>}
                    <span className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>{a.readingTime ?? '?'} min</span>
                  </div>
                  <h2 className="text-base font-bold group-hover:text-[var(--accent-strong)] transition-colors" style={{ color: 'var(--ink-primary)' }}>{a.title}</h2>
                  {a.excerpt && <p className="text-sm line-clamp-2" style={{ color: 'var(--ink-tertiary)' }}>{a.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
