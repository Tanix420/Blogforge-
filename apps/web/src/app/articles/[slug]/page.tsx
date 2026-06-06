import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticles } from '@/lib/articles';
import { ArticleUI } from '@/components/article-ui';
import { Container, Divider } from '@/components/atoms';
import { FadeUp } from '@/components/motion/motion';
import Link from 'next/link';
import { Clock, ArrowLeft, Share2, Bookmark, BookOpen } from 'lucide-react';

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  readingTime?: number;
  seoScore?: number;
  featuredImage?: string;
};

export async function generateStaticParams() {
  try {
    const articles = getArticles();
    return articles.filter((a: any) => a.slug).map((a: any) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

function loadArticle(slug: string): Article | null {
  try {
    const articles = getArticles();
    return articles.find((a: any) => a.slug === slug) ?? null;
  } catch {
    return null;
  }
}

function getCanonicalUrl(slug: string): string {
  return `https://blogforge.org/articles/${slug}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = loadArticle(slug);
  if (!article) return { title: 'Not Found' };
  const imageUrl = article.featuredImage || 'https://images.unsplash.com/photo-1676328179249-b56304e247d3?w=1200&q=80';
  const url = getCanonicalUrl(slug);
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      siteName: 'BlogForge AI',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: 'article',
      publishedTime: article.publishedAt,
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/articles/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = loadArticle(slug);
  if (!article) notFound();

  const readingTime = Math.max(1, Math.round((article.content?.length ?? 0) / 220));

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--ink-primary)' }}>
      <Container narrow>
        <div className="py-10">
          <FadeUp>
            <Link href="/articles" className="inline-flex items-center gap-2 text-xs font-bold mb-8" style={{ color: 'var(--ink-muted)' }}>
              <ArrowLeft size={14} /> Back to articles
            </Link>
          </FadeUp>

          <article>
            <header className="mb-10">
              <FadeUp delay={0.05}>
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="badge">{article.category}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--ink-muted)' }}>
                    <BookOpen size={14} /> {readingTime} min read
                  </span>
                  <time className="text-xs font-bold" style={{ color: 'var(--ink-muted)' }}>
                     {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                   </time>
                </div>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h1 className="text-display tracking-tight mb-6">{article.title}</h1>
              </FadeUp>
              <FadeUp delay={0.14}>
                <p className="text-lead max-w-2xl" style={{ color: 'var(--ink-tertiary)' }}>{article.excerpt}</p>
              </FadeUp>
              <FadeUp delay={0.18}>
                <div className="flex flex-wrap items-center gap-3 mt-8">
                  <button type="button" className="btn btn-ghost text-xs py-2">
                    <Share2 size={14} /> Share
                  </button>
                  <button type="button" className="btn btn-ghost text-xs py-2">
                    <Bookmark size={14} /> Bookmark
                  </button>
                </div>
              </FadeUp>
            </header>

            <Divider />

            <div className="py-10">
              <ArticleUI article={article} />
            </div>

            <Divider />

            <FadeUp delay={0.2} className="py-10 text-center">
              <h3 className="text-h3 font-black tracking-tight mb-3">Ready to dominate your niche?</h3>
              <p className="text-sm max-w-xl mx-auto mb-6" style={{ color: 'var(--ink-tertiary)' }}>
                Start your autonomous blog and publish your first article in 24 hours. One-click deploy on Vercel, Netlify, or Railway.
              </p>
              <div className="inline-flex flex-wrap justify-center gap-3">
                <Link href="/admin" className="btn btn-primary">Open Admin</Link>
                <Link href="/articles" className="btn btn-ghost">Browse Articles</Link>
              </div>
            </FadeUp>
          </article>
        </div>
      </Container>
    </div>
  );
}
