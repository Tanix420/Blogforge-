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
    <div>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            <div className="nav-brand-mark">BF</div>
            <span>BlogForge</span>
          </Link>
          <div className="nav-links">
            <Link href="/articles" className="nav-link">Articles</Link>
            <Link href="/admin/login" className="nav-link">Admin</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">✨ Autonomous AI Content Engine</div>
        <h1 className="hero-title">Content that writes, ranks, and scales itself.</h1>
        <p className="hero-subtitle">
          BlogForge is a multi-agent pipeline that researches, writes, optimizes, and publishes your content. Powered by AI.
        </p>
      </section>

      {/* Article Grid */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Latest Articles</h2>
          {articles.length > 0 && (
            <Link href="/articles" className="btn btn-ghost btn-sm">
              View all →
            </Link>
          )}
        </div>

        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 24px', color: 'var(--ink-muted)' }}>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No articles yet</p>
            <p style={{ fontSize: 14 }}>Articles will appear here once the pipeline runs.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {articles.map((article, idx) => (
              <Link
                href={`/articles/${article.slug}`}
                key={article.slug}
                className="featured-card animate-in"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                {article.featuredImage ? (
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="featured-card-img"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={idx < 3}
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(135deg, #1a1d28 0%, #11131a 100%)',
                    }}
                  />
                )}
                <div className="featured-card-gradient" />
                <div className="featured-card-body">
                  {article.category && (
                    <span className="featured-card-tag">{article.category}</span>
                  )}
                  <h3 className="featured-card-title">{article.title}</h3>
                  {article.excerpt && (
                    <p className="featured-card-excerpt">{article.excerpt}</p>
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
