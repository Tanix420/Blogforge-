'use client';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin, Copy as CopyIcon, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function ArticleUI({ article }: { article: any }) {
  const reducedMotion = useReducedMotion();

  if (!article) {
    return <div className="text-sm" style={{ color: 'var(--ink-muted)' }}>Article not found.</div>;
  }

  return (
    <>
      {/* Sticky top header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-xl" style={{ borderColor: 'var(--border-subtle)', background: 'rgba(15,17,19,0.85)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-ink-tertiary hover:text-ink-primary transition-colors">
            <ArrowLeft size={14} /> Back to articles
          </Link>
          <nav className="flex items-center gap-3">
            <ShareButtons title={article.title} slug={article.slug} />
          </nav>
        </div>
      </header>

      {/* Reading progress */}
      <ReadingProgress reducedMotion={!!reducedMotion} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Article header */}
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {article.category && <span className="badge badge-accent">{article.category}</span>}
            <ReadingTime minutes={article.readingTime ?? 0} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4" style={{ color: 'var(--ink-primary)' }}>{article.title}</h1>
          <p className="text-lg mb-6" style={{ color: 'var(--ink-tertiary)' }}>{article.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
            {article.publishedAt && (
              <span className="flex items-center gap-1.5"><Calendar size={14} />{format(new Date(article.publishedAt), 'MMMM d, yyyy')}</span>
            )}
            <span className="flex items-center gap-1.5"><Clock size={14} />{article.readingTime ?? 0} min read</span>
            <span className="text-accent-strong">SEO {article.seoScore ?? 0}/100</span>
          </div>
        </motion.div>

        {/* Featured image */}
        {article.featuredImage && (
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.5 }}
            className="mb-10 rounded-2xl overflow-hidden"
          >
            <img src={article.featuredImage} alt={article.title} className="w-full aspect-video object-cover" />
          </motion.div>
        )}

        {/* Content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reducedMotion ? 0 : 0.2 }}
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
        />

        <TableOfContents content={article.content} />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border-subtle">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <AuthorBio />
            <div className="flex flex-wrap items-center gap-2">
              {(article.tags || []).map((tag: string) => (
                <span key={tag} className="badge badge-accent">#{tag}</span>
              ))}
            </div>
          </div>
          <p className="mt-6 text-xs border-t border-dashed border-border-default pt-4" style={{ color: 'var(--ink-muted)' }}>
            Disclosure: Some links in this article may be affiliate links.
          </p>
        </footer>
      </main>

      <ScrollToTop />
    </>
  );
}

function ReadingProgress({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50" style={{ background: 'var(--bg-input)' }}>
      <motion.div
        className="h-full origin-left"
        style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-strong))' }}
        initial={{ scaleX: reducedMotion ? 1 : 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.4 }}
      />
    </div>
  );
}

function ReadingTime({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs" style={{ background: 'var(--accent-subtle)', color: 'var(--accent-strong)' }}>
      <Clock size={12} /> {minutes} min read
    </span>
  );
}

function AuthorBio() {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-muted))' }}>BF</div>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--ink-primary)' }}>BlogForge AI</p>
        <p className="text-xs" style={{ color: 'var(--ink-tertiary)' }}>AI-powered content creator · Tech enthusiast</p>
      </div>
    </div>
  );
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/articles/${slug}`;
  const share = (kind: 'twitter' | 'linkedin' | 'copy') => {
    if (kind === 'copy') {
      navigator.clipboard.writeText(url).catch(() => {});
      return;
    }
    window.open(
      kind === 'twitter'
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  return (
    <div className="inline-flex items-center gap-1">
      <button type="button" onClick={() => share('twitter')} className="btn btn-ghost text-xs p-2" aria-label="Share on Twitter"><Twitter size={14} /></button>
      <button type="button" onClick={() => share('linkedin')} className="btn btn-ghost text-xs p-2" aria-label="Share on LinkedIn"><Linkedin size={14} /></button>
      <button type="button" onClick={() => share('copy')} className="btn btn-ghost text-xs p-2" aria-label="Copy link"><CopyIcon size={14} /></button>
    </div>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  if (!visible) return null;
  return (
    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn btn-ghost fixed bottom-6 right-6 z-40 rounded-full w-10 h-10 p-0 shadow-lg" aria-label="Scroll to top">
      <ChevronUp size={16} />
    </button>
  );
}

function TableOfContents({ content }: { content: string }) {
  const headings = (content.match(/^##+ .+/gm) ?? []).map((h) => h.replace(/^##+\s/, ''));
  if (!headings.length) return null;
  return (
    <aside className="hidden xl:block fixed top-24 right-8 w-56 space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--ink-muted)' }}>On this page</p>
      {headings.map((text, i) => (
        <a key={i} href={`#h-${i}`} className="block text-xs py-1 transition-colors hover:text-accent-strong truncate" style={{ color: 'var(--ink-tertiary)' }}>{text}</a>
      ))}
    </aside>
  );
}

function renderMarkdown(md: string) {
  let html = md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/^---$/gim, '<hr />')
    .replace(/\|(.+)\|/g, (m) => {
      const cells = m.split('|').filter(Boolean).map((c) => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    });
  html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, '<table>$1</table>');
  const lines = html.split('\n');
  const out: string[] = [];
  let ul = false;
  let ol = false;
  for (const line of lines) {
    const ulM = line.match(/^- (.+)/);
    const olM = line.match(/^\d+\. (.+)/);
    if (ulM) { if (!ul) { out.push('<ul>'); ul = true; } out.push(`<li>${ulM[1]}</li>`); }
    else if (olM) { if (!ol) { out.push('<ol>'); ol = true; } out.push(`<li>${olM[1]}</li>`); }
    else { if (ul) { out.push('</ul>'); ul = false; } if (ol) { out.push('</ol>'); ol = false; } if (line.trim() === '') out.push('<br/>'); else if (!line.match(/^<(h[1-6]|table|blockquote|pre|hr)/)) out.push(`<p>${line}</p>`); else out.push(line); }
  }
  if (ul) out.push('</ul>');
  if (ol) out.push('</ol>');
  return out.join('\n');
}
