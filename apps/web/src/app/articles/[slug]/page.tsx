import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getPublishedArticles } from '@/lib/articles';

export async function generateStaticParams() {
  const articles = getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.title,
    description: article.excerpt || article.metaDescription,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || article.status !== 'published') {
    notFound();
  }

  const allArticles = getPublishedArticles();
  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const prev = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const next = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const renderContent = () => {
    if (!article.content) return null;
    const lines = article.content.split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: string[] = [];
    let listKey = 0;

    const flushList = (keyPrefix: string) => {
      if (listItems.length === 0) return null;
      const ul = (
        <ul key={`${keyPrefix}-ul`} style={{ margin: '0 0 18px', paddingLeft: 26 }}>
          {listItems.map((item, i) => (
            <li key={i} style={{ marginBottom: 8, color: 'var(--ink-secondary)', lineHeight: 1.7 }}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
      return ul;
    };

    lines.forEach((line, i) => {
      if (line.startsWith('# ')) {
        elements.push(flushList(`h2-${i}`));
        elements.push(
          <h2 key={i} style={{
            fontSize: 28, fontWeight: 800, color: 'var(--ink-primary)',
            margin: '48px 0 16px', letterSpacing: '-.025em', lineHeight: 1.25,
          }}>{line.slice(2)}</h2>
        );
      } else if (line.startsWith('## ')) {
        elements.push(flushList(`h3-${i}`));
        elements.push(
          <h3 key={i} style={{
            fontSize: 20, fontWeight: 750, color: 'var(--ink-primary)',
            margin: '36px 0 12px', letterSpacing: '-.015em', lineHeight: 1.35,
          }}>{line.slice(3)}</h3>
        );
      } else if (line.startsWith('- ')) {
        inList = true;
        listItems.push(line.slice(2));
      } else if (line.trim() === '') {
        elements.push(flushList(`br-${i}`));
        elements.push(<br key={i} />);
      } else {
        elements.push(flushList(`p-${i}`));
        elements.push(
          <p key={i} style={{ margin: '0 0 18px', color: 'var(--ink-secondary)', lineHeight: 1.8, fontSize: 17 }}>
            {line}
          </p>
        );
      }
    });
    elements.push(flushList('final'));
    return elements;
  };

  return (
    <div style={{ background: 'var(--page-bg)', color: 'var(--ink-primary)', minHeight: '100vh', fontFamily: 'var(--font)' }}>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" style={{ color: 'var(--ink-primary)', fontWeight: 800, fontSize: 15, letterSpacing: '-.02em', textDecoration: 'none' }}>
            BlogForge
          </Link>
          <div className="nav-links">
            <Link href="/articles" className="nav-link">Articles</Link>
            <Link href="/" className="nav-link">Home</Link>
          </div>
        </div>
      </nav>

      {/* Featured Image Hero */}
      {article.featuredImage && (
        <div className="article-hero animate-in">
          <Image src={article.featuredImage} alt={article.title} fill priority style={{ objectFit: 'cover' }} />
          <div className="article-hero-fade" />
        </div>
      )}

      {/* Article Header */}
      <header className="article-header animate-in-d1">
        <div>
          {article.category && (
            <span className="article-category">{article.category}</span>
          )}
          <h1 style={{
            fontSize: 40, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.15,
            margin: '0 0 20px', color: 'var(--ink-primary)',
          }}>
            {article.title}
          </h1>
          {article.excerpt && (
            <p style={{
              fontSize: 18, color: 'var(--ink-secondary)', lineHeight: 1.6,
              margin: '0 0 24px', fontWeight: 400,
            }}>
              {article.excerpt}
            </p>
          )}
        </div>
        <div className="article-meta">
          {article.readingTime && (
            <span>{article.readingTime} min read</span>
          )}
          {article.readingTime && article.publishedAt && (
            <span className="article-meta-divider" />
          )}
          {article.publishedAt && (
            <span>
              {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>
      </header>

      {/* Article Body */}
      <article className="content article-body animate-in-d2">
        {renderContent()}
      </article>

      {/* Pagination */}
      {(prev || next) && (
        <nav style={{
          maxWidth: 'var(--article-max)', margin: '0 auto', padding: '0 24px 100px',
          display: 'flex', gap: 16,
        }} className="animate-in-d3">
          {prev ? (
            <Link href={`/articles/${prev.slug}`} className="btn btn-ghost" style={{ flex: 1 }}>
              ← {prev.title.slice(0, 45)}{prev.title.length > 45 ? '…' : ''}
            </Link>
          ) : <div style={{ flex: 1 }} />}
          {next ? (
            <Link href={`/articles/${next.slug}`} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'flex-end' }}>
              {next.title.slice(0, 45)}{next.title.length > 45 ? '…' : ''} →
            </Link>
          ) : <div style={{ flex: 1 }} />}
        </nav>
      )}
    </div>
  );
}
