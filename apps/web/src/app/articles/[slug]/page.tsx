import { Metadata } from 'next';
import { getArticleBySlug } from '@/lib/articles';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
 const articles = (await import('@/lib/articles')).getPublishedArticles();
 return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const article = await getArticleBySlug(slug);
 if (!article) return { title: 'Article Not Found' };
 return {
  title: article.title,
  description: article.excerpt || article.metaDescription,
 };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const article = await getArticleBySlug(slug);

 if (!article || article.status !== 'published') {
  notFound();
 }

 return (
  <div style={{ background: '#0a0b0f', color: '#f1f3f8', minHeight: '100vh' }}>
   {/* NAV */}
   <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,11,15,0.9)', position: 'sticky', top: 0, zIndex: 50 }}>
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
     <Link href="/" style={{ textDecoration: 'none', color: '#f1f3f8', fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>BlogForge</Link>
     <div style={{ display: 'flex', gap: 16 }}>
      <Link href="/articles" style={{ color: '#a5adc8', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Articles</Link>
      <Link href="/" style={{ color: '#a5adc8', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Home</Link>
     </div>
    </div>
   </nav>

   {/* ARTICLE */}
   <article style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 80px' }}>
    {article.featuredImage && (
     <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', borderRadius: 10, marginBottom: 28, background: '#11131a' }}>
      <img
       src={article.featuredImage}
       alt={article.title}
       style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
     </div>
    )}

    <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.2, margin: '0 0 14px', color: '#f1f3f8' }}>{article.title}</h1>

    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 18 }}>
     {article.category && (
      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#949cf7', background: 'rgba(99,102,241,0.15)', padding: '3px 8px', borderRadius: 5 }}>{article.category}</span>
     )}
     <span style={{ fontSize: 12, color: '#6a7388', fontWeight: 500 }}>{article.readingTime || 5} min read</span>
     {article.publishedAt && (
      <span style={{ fontSize: 12, color: '#6a7388', fontWeight: 500 }}>
       {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
     )}
    </div>

    <div style={{ color: '#d4d8e6', fontSize: 16, lineHeight: 1.8 }}>
     {article.content.split('\n').map((para: string, i: number) => {
      if (para.startsWith('# ')) return <h2 key={i} style={{ fontSize: 22, fontWeight: 800, color: '#f1f3f8', margin: '28px 0 10px' }}>{para.slice(2)}</h2>;
      if (para.startsWith('## ')) return <h3 key={i} style={{ fontSize: 18, fontWeight: 800, color: '#f1f3f8', margin: '22px 0 8px' }}>{para.slice(3)}</h3>;
      if (para.startsWith('- ')) return <li key={i} style={{ marginLeft: 18, marginBottom: 5 }}>{para.slice(2)}</li>;
      if (para.trim() === '') return <br key={i} />;
      return <p key={i} style={{ margin: '0 0 14px' }}>{para}</p>;
     })}
    </div>
   </article>
  </div>
 );
}
