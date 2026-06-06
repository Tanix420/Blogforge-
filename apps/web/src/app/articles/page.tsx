import Link from 'next/link';
import { Metadata } from 'next';
import { getPublishedArticles } from '@/lib/articles';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Articles – BlogForge AI',
  description: 'Browse all AI-generated articles on BlogForge AI — research, writing, SEO, AEO, automation, and more.',
  openGraph: {
    title: 'Articles – BlogForge AI',
    description: 'Browse all AI-generated articles on BlogForge AI — research, writing, SEO, AEO, automation, and more.',
    url: 'https://blogforge.org/articles',
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
    title: 'Articles – BlogForge AI',
    description: 'Browse all AI-generated articles on BlogForge AI — research, writing, SEO, AEO, automation, and more.',
    images: [
      'https://images.unsplash.com/photo-1676328179249-b56304e247d3?w=1200&q=80',
    ],
  },
  alternates: {
    canonical: '/articles',
  },
};

export default async function ArticlesPage({
 searchParams,
}: {
 searchParams: Promise<{ cursor?: string; q?: string; category?: string }>;
}) {
 const sp = await searchParams;
 const q = (sp.q ?? '').toLowerCase();
 const category = (sp.category ?? '').toLowerCase();
 const cursor = sp.cursor ?? '';
 const PAGE = 9;

 const all = getPublishedArticles();
 const filtered = all.filter((a: any) => {
  if (q) {
   const hay = `${a.title} ${a.excerpt ?? ''} ${(a.tags ?? []).join(' ')}`.toLowerCase();
   if (!hay.includes(q)) return false;
  }
  if (category && !(a.category?.toLowerCase() === category)) return false;
  return true;
 });

 const startIdx = cursor ? filtered.findIndex((a: any) => a.slug === cursor) + 1 : 0;
 const si = Math.max(startIdx, 0);
 const visible = filtered.slice(si, si + PAGE);
 const total = filtered.length;

 const prevCursor =
  si - PAGE >= 0 ? filtered[si - PAGE]?.slug ?? null : null;
 const nextCursor =
  si + PAGE < total ? filtered[si + PAGE - 1]?.slug ?? null : null;

 const showingFirst = si + 1;
 const showingLast = Math.min(si + PAGE, total);

 const categories = Array.from(
  new Set(all.map((a: any) => a.category).filter(Boolean))
 );

 return (
  <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
   <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
     <div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
       Articles
      </h1>
      <p className="text-sm mt-1" style={{ color: 'var(--ink-tertiary)' }}>
       {total} {total === 1 ? 'article' : 'articles'} found
      </p>
     </div>
     <Link href="/" className="text-xs inline-flex items-center gap-1" style={{ color: 'var(--ink-muted)' }}>
      <ChevronLeft size={14} /> Back to home
     </Link>
    </div>

    {total === 0 ? (
     <div className="text-center py-20">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold" style={{ color: 'var(--ink-tertiary)' }}>No articles found</h3>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>Try adjusting your search or filter.</p>
      <Link href="/articles" className="btn btn-primary">View all articles</Link>
     </div>
    ) : (
     <>
      <p className="text-xs mb-4" style={{ color: 'var(--ink-muted)' }}>
       Showing {showingFirst}–{showingLast} of {total}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
       {visible.map((article: any) => (
        <Link
         href={`/articles/${article.slug}`}
         key={article.slug}
         className="surface surface-interactive group block"
        >
         {article.featuredImage && (
          <div className="aspect-video overflow-hidden">
           <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
           />
          </div>
         )}
         <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
           {article.category && <span className="badge">{article.category}</span>}
           <span className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>
            {article.readingTime ?? '?'} min
           </span>
          </div>
          <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-[var(--accent-strong)] transition-colors" style={{ color: 'var(--ink-primary)' }}>
           {article.title}
          </h3>
          {article.excerpt && (
           <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--ink-tertiary)' }}>
            {article.excerpt}
           </p>
          )}
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--ink-muted)' }}>
           <span className="inline-flex items-center gap-1.5 font-mono" style={{ color: 'var(--accent-strong)' }}>
            SEO {article.seoScore ?? 0}/100
           </span>
          </div>
         </div>
        </Link>
       ))}
      </div>

      {total > PAGE && (
       <div className="mt-12 flex items-center justify-between">
        <div className="flex gap-3">
         {prevCursor ? (
          <Link
           href={`/articles?cursor=${encodeURIComponent(prevCursor)}${q ? `&q=${encodeURIComponent(q)}` : ''}${category ? `&category=${encodeURIComponent(category)}` : ''}`}
           className="btn btn-ghost"
          >
           <ChevronLeft size={16} /> Previous
          </Link>
         ) : (
          <span />
         )}
         {nextCursor ? (
          <Link
           href={`/articles?cursor=${encodeURIComponent(nextCursor)}${q ? `&q=${encodeURIComponent(q)}` : ''}${category ? `&category=${encodeURIComponent(category)}` : ''}`}
           className="btn btn-primary"
          >
           Next <ChevronRight size={16} />
          </Link>
         ) : (
          <span />
         )}
        </div>
       </div>
      )}

      {categories.length > 0 && (
       <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--ink-primary)' }}>
         Browse by Category
        </h2>
        <div className="flex flex-wrap gap-2">
         {categories.map((c: string) => (
          <Link
           key={c}
           href={category?.toLowerCase() === c.toLowerCase() ? '/articles' : `/articles?category=${encodeURIComponent(c)}`}
           className="btn text-xs"
           style={{
            background: category?.toLowerCase() === c.toLowerCase() ? 'var(--accent-subtle)' : 'var(--bg-input)',
            color: category?.toLowerCase() === c.toLowerCase() ? 'var(--accent-strong)' : 'var(--ink-secondary)',
            border: '1px solid var(--border-default)',
           }}
          >
           {c}
          </Link>
         ))}
        </div>
       </div>
      )}
     </>
    )}
   </div>
  </div>
 );
}
