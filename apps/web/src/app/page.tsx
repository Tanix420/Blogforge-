import { Metadata } from 'next';
import { getPublishedArticles } from '@/lib/articles';
import { Container } from '@/components/atoms';
import Link from 'next/link';
import Image from 'next/image';

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
  <div className="min-h-screen" style={{ background: '#0a0b0f', color: '#f1f3f8', fontFamily: "'Geist','Inter',system-ui,sans-serif" }}>
   <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,11,15,0.85)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
    <Container narrow>
     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
       <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 12 }}>BF</div>
       <span style={{ color: '#f1f3f8', fontWeight: 800, fontSize: 14, letterSpacing: '-0.02em' }}>BlogForge</span>
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
       <Link href="/articles" style={{ color: '#a5adc8', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Articles</Link>
       <Link href="/about" style={{ color: '#a5adc8', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>About</Link>
      </nav>
     </div>
    </Container>
   </header>

   <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 80px' }}>
    <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 6px', color: '#f1f3f8' }}>Latest Articles</h1>
    <p style={{ color: '#6a7388', fontSize: 14, marginBottom: 28 }}>AI-generated, human-edited content.</p>

    {articles.length === 0 ? (
     <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6a7388' }}>
      <p style={{ fontSize: 16, fontWeight: 600 }}>No articles yet</p>
      <p style={{ fontSize: 13, marginTop: 8 }}>Articles will appear here once the pipeline runs.</p>
     </div>
    ) : (
     <div className="article-grid">
      {articles.map((article) => (
       <Link href={`/articles/${article.slug}`} key={article.slug} className="article-card">
        {article.featuredImage && (
         <div className="article-img">
          <Image src={article.featuredImage} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
         </div>
        )}
        <div className="article-body">
         <div className="article-meta">
          <span className="article-badge">{article.category || 'Article'}</span>
          <span className="article-time">{article.readingTime || 5} min</span>
          <span className="article-seo">SEO {article.seoScore || 0}/100</span>
         </div>
         <h2 className="article-title">{article.title}</h2>
         <p className="article-excerpt">{article.excerpt}</p>
        </div>
       </Link>
      ))}
     </div>
    )}
   </main>
  </div>
 );
}
