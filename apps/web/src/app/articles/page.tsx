import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { getPublishedArticles } from '@/lib/articles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All Articles — BlogForge AI',
  description: 'Browse the complete archive of AI-generated articles.',
};

export default function ArticlesPage() {
  const articles = getPublishedArticles();

  return (
    <div style={{
      background: 'var(--page-bg)',
      color: 'var(--ink-primary)',
      minHeight: '100vh',
      fontFamily: 'var(--font)',
    }}>
      {/* Nav */}
      <nav className="site-nav">
        <div className="site-nav-inner">
          <Link href="/" className="nav-brand" style={{ color: 'var(--ink-primary)' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 900, fontSize: 12, flexShrink: 0,
            }}>BF</div>
            <span>BlogForge</span>
          </Link>
          <div className="nav-links">
            <Link href="/" style={{ color: 'var(--ink-muted)' }}>Home</Link>
            <Link href="/admin/login" style={{ color: 'var(--accent)' }}>Admin</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section style={{
        maxWidth: 900, margin: '0 auto', padding: '80px 20px 40px', textAlign: 'center',
      }} className="animate-fade-in-up">
        <h1 style={{
          fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em',
          color: 'var(--ink-primary)', margin: '0 0 12px',
        }}>
          All Articles
        </h1>
        <p style={{
          fontSize: 16, color: 'var(--ink-tertiary)', lineHeight: 1.6,
          margin: 0, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto',
        }}>
          Explore the full archive of AI-generated content — researched, written, and optimized autonomously.
        </p>
      </section>

      {/* Articles list */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 96px' }}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--ink-muted)' }}>
            <p style={{ fontSize: 16, fontWeight: 600 }}>No articles published yet</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Check back soon — new content is generated automatically.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {articles.map((article, idx) => (
              <Link
                href={`/articles/${article.slug}`}
                key={article.slug}
                className="animate-fade-in-up"
                style={{
                  display: 'flex', gap: 16, alignItems: 'center',
                  padding: '16px 20px', borderRadius: 12,
                  background: 'var(--elevated-bg)',
                  border: '1px solid var(--border-strong)',
                  textDecoration: 'none',
                  animationDelay: `${idx * 0.04}s`,
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.background = 'var(--elevated-bg)';
                }}
              >
                {article.featuredImage ? (
                  <div style={{
                    width: 72, height: 72, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                    background: 'var(--bg-surface)', position: 'relative',
                  }}>
                    <Image src={article.featuredImage} alt={article.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{
                    width: 72, height: 72, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg, #1a1d28, #11131a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: 'var(--ink-muted)', fontWeight: 700,
                  }}>NO IMG</div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 700, color: 'var(--ink-primary)',
                    letterSpacing: '-0.01em', marginBottom: 4,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {article.title}
                  </div>
                  {article.excerpt && (
                    <div style={{
                      fontSize: 13, color: 'var(--ink-tertiary)', lineHeight: 1.5,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {article.excerpt}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 11, color: 'var(--ink-muted)', fontWeight: 500 }}>
                    {article.category && <span style={{ color: '#949cf7' }}>{article.category}</span>}
                    {article.readingTime && <span>{article.readingTime} min</span>}
                    {article.publishedAt && (
                      <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    )}
                  </div>
                </div>

                <ChevronRight size={16} style={{ color: 'var(--ink-muted)', flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
