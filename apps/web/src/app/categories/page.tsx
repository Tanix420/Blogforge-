import Link from 'next/link';
import { Metadata } from 'next';
import { getPublishedArticles, getArticles } from '@/lib/articles';
import { FolderOpen, ChevronRight, ChevronLeft, FileText } from 'lucide-react';
import { FadeUp, StaggerChildren } from '@/components/motion/motion';

export const metadata: Metadata = {
  title: 'Categories – BlogForge AI',
  description: 'Browse AI-generated articles by category on BlogForge AI.',
  openGraph: {
    title: 'Categories – BlogForge AI',
    description: 'Browse AI-generated articles by category on BlogForge AI.',
    url: 'https://blogforge.org/categories',
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
    title: 'Categories – BlogForge AI',
    description: 'Browse AI-generated articles by category on BlogForge AI.',
    images: [
      'https://images.unsplash.com/photo-1676328179249-b56304e247d3?w=1200&q=80',
    ],
  },
  alternates: {
    canonical: '/categories',
  },
};

export default function CategoriesPage() {
  const articles = getPublishedArticles();
  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean))) as string[];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <FadeUp>
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="text-xs text-ink-muted hover:text-ink-primary transition-colors"><ChevronLeft size={14} /> Back to home</Link>
          </div>
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>Categories</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-tertiary)' }}>Browse {categories.length} categories on {articles.length} articles</p>
          </div>
        </FadeUp>

        {categories.length === 0 ? (
          <FadeUp>
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📂</div>
              <h3 className="text-xl font-semibold" style={{ color: 'var(--ink-tertiary)' }}>No categories yet</h3>
              <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Articles will appear here once published.</p>
            </div>
          </FadeUp>
        ) : (
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => {
              const count = articles.filter(a => a.category === cat).length;
              return (
                <Link href={`/articles?category=${encodeURIComponent(cat)}`} key={cat} className="card card-interactive group block">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl" style={{ background: 'var(--accent-subtle)' }}>
                        <FolderOpen size={20} style={{ color: 'var(--accent-strong)' }} />
                      </div>
                      <h3 className="font-bold group-hover:text-[var(--accent-strong)] transition-colors" style={{ color: 'var(--ink-primary)' }}>{cat}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
                      <FileText size={12} />
                      <span>{count} article{count !== 1 ? 's' : ''}</span>
                      <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </StaggerChildren>
        )}
      </div>
    </div>
  );
}
