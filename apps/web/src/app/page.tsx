import { Metadata } from 'next';
import { getPublishedArticles } from '@/lib/articles';
import Link from 'next/link';
import Image from 'next/image';

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
  <div style={{ background: '#0a0b0f', color: '#f1f3f8', minHeight: '100vh', fontFamily: "'Geist','Inter',system-ui,sans-serif" }}>
   {/* NAV */}
   <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,11,15,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
     <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 12 }}>BF</div>
      <span style={{ color: '#f1f3f8', fontWeight: 800, fontSize: 14, letterSpacing: '-0.02em' }}>BlogForge</span>
     </Link>
     <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Link href="/articles" style={{ color: '#a5adc8', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Articles</Link>
     </div>
    </div>
   </nav>

   {/* GRID */}
   <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 80px' }}>
    <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6a7388', margin: '0 0 24px' }}>Latest</h2>

    {articles.length === 0 ? (
     <div style={{ textAlign: 'center', padding: 80, color: '#6a7388' }}>
      <p style={{ fontSize: 16, fontWeight: 600 }}>No articles yet</p>
      <p style={{ fontSize: 13, marginTop: 8 }}>Articles will appear here once the pipeline runs.</p>
     </div>
    ) : (
     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
      {articles.map((article) => (
       <Link href={`/articles/${article.slug}`} key={article.slug} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <article style={{
         position: 'relative',
         aspectRatio: '16/10',
         borderRadius: 14,
         overflow: 'hidden',
         display: 'block',
         background: '#11131a',
        }}>
         {/* Full-bleed image */}
         {article.featuredImage ? (
          <Image src={article.featuredImage} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
         ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a1d28, #11131a)' }} />
         )}

         {/* Overlay gradient */}
         <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)',
         }} />

         {/* Text overlay */}
         <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 20,
         }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3, margin: '0 0 6px', color: '#fff' }}>{article.title}</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.excerpt}</p>
         </div>
        </article>
       </Link>
      ))}
     </div>
   )}
   </main>
  </div>
 );
}
