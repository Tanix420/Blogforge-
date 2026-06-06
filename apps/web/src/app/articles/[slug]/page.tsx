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
        <ul key={`${keyPrefix}-ul`} style={{ margin: '0 0 16px', paddingLeft: 24 }}>
          {listItems.map((item, i) => (
            <li key={i} style={{ marginBottom: 6, color: 'var(--ink-secondary)' }}>{item}</li>
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
            fontSize: 22, fontWeight: 800, color: 'var(--ink-primary)',
            margin: '36px 0 12px', letterSpacing: '-0.02em', lineHeight: 1.3,
          }}>{line.slice(2)}</h2>
        );
      } else if (line.startsWith('## ')) {
        elements.push(flushList(`h3-${i}`));
        elements.push(
          <h3 key={i} style={{
            fontSize: 18, fontWeight: 800, color: 'var(--ink-primary)',
            margin: '28px 0 10px', letterSpacing: '-0.01em', lineHeight: 1.4,
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
          <p key={i} style={{ margin: '0 0 16px', color: 'var(--ink-secondary)', lineHeight: 1.8 }}>
            {line}
          </p>
        );
      }
    });
    elements.push(flushList('final'));
    return elements;
  };

  return (
    <div style={{ background: 'var(--bg-page)', color: 'var(--ink-primary)', minHeight: '100vh', fontFamily: "var(--font-brand)" }}>
      {/* Navigation */}
      <nav className="site-nav">
        <div className="site-nav-inner">
          <Link href="/" style={{ color: 'var(--ink-primary)', fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em', textDecoration: 'none' }}>
            BlogForge
          </Link>
          <div className="site-nav-links">
            <Link href="/articles">Articles</Link>
            <Link href="/">Home</Link>
          </div>
        </div>
      </nav>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="article-hero animate-fade-in-up">
          <Image src={article.featuredImage} alt={article.title} fill style={{ objectFit: 'cover' }} priority />
        </div>
      )}

      {/* Article Header */}
      <header style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 0' }} className="animate-fade-in-up">
        <h1 style={{
          fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.2,
          margin: '0 0 16px', color: 'var(--ink-primary)',
        }}>
          {article.title}
        </h1>

        {article.excerpt && (
          <p style={{
            fontSize: 17, color: 'var(--ink-tertiary)', lineHeight: 1.6,
            margin: '0 0 24px', fontWeight: 400,
          }}>
            {article.excerpt}
          </p>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          paddingBottom: 20, borderBottom: '1px solid var(--border-subtle)',
        }}>
          {article.category && (
            <span style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: '#949cf7', background: 'rgba(99,102,241,0.15)',
              padding: '3px 10px', borderRadius: 6,
            }}>
              {article.category}
            </span>
          )}
          {article.readingTime && (
            <span style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 500 }}>
              {article.readingTime} min read
            </span>
          )}
          {article.publishedAt && (
            <span style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 500 }}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>
      </header>

      {/* Article Body */}
      <article className="article-body">
        {renderContent()}
      </article>

      {/* Pagination */}
      {(prev || next) && (
        <nav style={{
          maxWidth: 720, margin: '0 auto', padding: '0 20px 80px',
          display: 'flex', gap: 16, justifyContent: 'space-between',
        }}>
          {prev ? (
            <Link href={`/articles/${prev.slug}`} className="btn btn-ghost" style={{ flex: 1 }}>
              ← {prev.title.slice(0, 40)}{prev.title.length > 40 ? '…' : ''}
            </Link>
          ) : <div style={{ flex: 1 }} />}
          {next ? (
            <Link href={`/articles/${next.slug}`} className="btn btn-ghost" style={{ flex: 1, textAlign: 'right', justifyContent: 'flex-end' }}>
              {next.title.slice(0, 40)}{next.title.length > 40 ? '…' : ''} →
            </Link>
          ) : <div style={{ flex: 1 }} />}
        </nav>
      )}
    </div>
  );
}
