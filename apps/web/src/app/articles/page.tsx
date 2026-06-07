import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
 <div style={{ background: 'var(--page-bg)', color: 'var(--ink-primary)', minHeight: '100vh', fontFamily: 'var(--font)' }}>
 <nav className="nav" style={{ position: 'fixed' }}>
 <div className="nav-inner">
 <Link href="/" className="nav-brand">
 <div className="nav-brand-mark">BF</div>
 <span>BlogForge</span>
 </Link>
 <div className="nav-links">
 <Link href="/" className="nav-link">Home</Link>
 <Link href="/admin/login" className="nav-link">Admin</Link>
 </div>
 </div>
 </nav>

 <div className="container" style={{ paddingTop: 100 }}>
 <div style={{ textAlign: 'center', marginBottom: 40 }}>
 <h1 className="animate-in" style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.15 }}>All Articles</h1>
 <p className="animate-in-d1" style={{ fontSize: 15, color: 'var(--ink-muted)', marginTop: 10, lineHeight: 1.6 }}>The complete archive of AI-generated content — researched, written, and optimized autonomously.</p>
 </div>

 {articles.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 100, color: 'var(--ink-muted)' }}>
 <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No articles published yet</p>
 <p style={{ fontSize: 13 }}>Check back soon — new content is generated automatically.</p>
 </div>
 ) : (
 <div className="cards-grid">
 {articles.map((article, idx) => (
 <Link
 href={`/articles/${article.slug}`}
 key={article.slug}
 className="featured-card animate-in"
 style={{ animationDelay: `${idx * 0.05}s` }}
 >
 {article.featuredImage ? (
 <Image
 src={article.featuredImage}
 alt={article.title}
 fill
 className="featured-card-img"
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
 <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 11, color: 'rgba(255,255,255,.55)', fontWeight: 500 }}>
 {article.readingTime && <span>{article.readingTime} min</span>}
 {article.publishedAt && <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
 </div>
 </div>
 </Link>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
