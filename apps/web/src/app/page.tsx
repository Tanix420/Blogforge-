import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPublishedArticles } from '@/lib/articles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
 title: 'BlogForge AI — Autonomous AI Blog',
 description: 'Curated AI-powered articles about the future of content, marketing, and automation.',
};

export default function HomePage() {
 const articles = getPublishedArticles();

 return (
 <div className="home-canvas">
 <nav className="nav" style={{ position: 'fixed' }}>
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

 <div className="container" style={{ paddingTop: 12 }}>
 <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
 <div>
 <p style={{ fontSize: 13, color: 'var(--ink-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 6 }}>Latest</p>
 <h1 className="animate-in" style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.05, color: 'var(--ink-primary)' }}>Articles</h1>
 </div>
 {articles.length > 0 && (
 <Link href="/articles" className="btn btn-ghost btn-sm" style={{ borderRadius: 'var(--r-full)' }}>View all →</Link>
 )}
 </div>
 </div>

 {articles.length === 0 ? (
 <div className="container" style={{ textAlign: 'center', paddingTop: 120, color: 'var(--ink-muted)' }}>
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
 style={{ animationDelay: `${idx * 0.05}s` }}
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
 </div>
 );
}
