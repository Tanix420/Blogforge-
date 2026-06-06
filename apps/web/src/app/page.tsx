import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPublishedArticles } from '@/lib/articles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'BlogForge AI — Autonomous AI Blog',
  description: 'AI-powered content ecosystem that writes, ranks, and scales your blog autonomously.',
  openGraph: {
    title: 'BlogForge AI',
    description: 'AI-powered content ecosystem.',
    url: 'https://blogforge.org',
    siteName: 'BlogForge AI',
    type: 'website',
  },
};

export default function HomePage() {
  const articles = getPublishedArticles();

  return (
    <div style={{ background: 'var(--bg-page)', color: 'var(--ink-primary)', minHeight: '100vh', fontFamily: "var(--font-brand)" }}>
      {/* Navigation */}
      <nav className="site-nav">
        <div className="site-nav-inner">
          <Link href="/" className="site-nav-brand" style={{ color: 'var(--ink-primary)' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 900, fontSize: 12, flexShrink: 0,
            }}>BF</div>
            <span>BlogForge</span>
          </Link>
          <div className="site-nav-links">
            <Link href="/articles">Articles</Link>
            <Link href="/admin/login" style={{ color: 'var(--accent)' }}>Admin</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="home-hero animate-fade-in-up">
        <h1 className="home-hero-title">Autonomous AI Blog</h1>
        <p className="home-hero-sub">
          Content that writes, ranks, and scales itself. Powered by BlogForge multi-agent pipeline.
        </p>
      </section>

      {/* Article Grid */}
      <section className="home-grid-wrap">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <h2 style={{
            fontSize: 13, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: 'var(--ink-muted)', margin: 0,
          }}>
            Latest Articles
          </h2>
          <Link href="/articles" className="btn btn-ghost" style={{ fontSize: 13 }}>
            View all →
          </Link>
        </div>

        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--ink-muted)' }}>
            <p style={{ fontSize: 16, fontWeight: 600 }}>No articles yet</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Articles will appear here once the pipeline runs.</p>
          </div>
        ) : (
          <div className="article-grid">
            {articles.map((article, idx) => (
              <Link
                href={`/articles/${article.slug}`}
                key={article.slug}
                className="article-card"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {article.featuredImage ? (
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={idx < 3}
                  />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a1d28, #11131a)' }} />
                )}
                <div className="article-overlay" />
                <div className="article-text">
                  <h3 className="article-title">{article.title}</h3>
                  {article.excerpt && (
                    <p className="article-excerpt">{article.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
