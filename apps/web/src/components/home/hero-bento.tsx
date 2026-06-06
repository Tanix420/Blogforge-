import Link from 'next/link';
import { Metadata } from 'next';
import { getPublishedArticles } from '@/lib/articles';
import { MeshGradient, Container, GlassCard, Stat, Section, Divider, Badge } from '@/components/atoms';
import { FadeUp, StaggerChildren } from '@/components/motion/motion';
import {
  FileText,
  TrendingUp,
  Zap,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  Quote,
  Users,
  Globe,
  Star,
  Sparkles,
  Clock,
  ChevronRight,
  Mail,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'BlogForge AI — Autonomous AI Blog',
  description: 'AI-powered content ecosystem that writes, ranks, and grows itself. Research, write, SEO, and publish — fully autonomous.',
};

const STATS = [
  { label: 'Pipeline Agents', value: 7 },
  { label: 'Avg SEO Score', value: 94, suffix: '%' },
  { label: 'Quality Gate', value: 91, suffix: '%' },
  { label: 'Auto-Publish', value: 24, suffix: '/ 7' },
];

const BENTO = [
  {
    title: 'Trending Discovery',
    desc: 'Mines HN, Reddit, GitHub, and DDG trends in real time — zero auth required.',
    icon: TrendingUp,
    accent: 'accent',
  },
  {
    title: 'Deep Research',
    desc: 'Compares 5–7 sources, extracts insights, and builds a structured outline.',
    icon: FileText,
    accent: 'success',
  },
  {
    title: 'Writer + SEO/AEO',
    desc: 'Drafts long-form content optimized for search and answer engines.',
    icon: Sparkles,
    accent: 'warn',
  },
  {
    title: 'Quality Gate',
    desc: 'Multi-stage review — heuristics + LLM — confirm or revise before publish.',
    icon: ShieldCheck,
    accent: 'accent',
  },
  {
    title: 'Affiliate Insertion',
    desc: 'Contextual affiliate links placed naturally without disrupting flow.',
    icon: Zap,
    accent: 'accent',
  },
  {
    title: 'Analytics',
    desc: 'Tracks impressions, clicks, rankings, and revenue per article.',
    icon: BarChart3,
    accent: 'success',
  },
];

const HERO_BADGES = [
  'Fully autonomous 7-agent pipeline',
  'Zero human intervention after setup',
  'Schema-ready · AEO optimized',
  'Self-improving ranking loop',
];

const TESTIMONIALS = [
  {
    quote: 'We replaced 3 content writers and saw organic traffic jump 340% in 90 days. The quality gate is real.',
    name: 'Maya Chen',
    title: 'Head of Growth, Meridian Labs',
  },
  {
    quote: 'The self-improving loop is remarkable. Articles rank higher because the system learns from performance.',
    name: 'David Park',
    title: 'CTO, StackBridge IO',
  },
  {
    quote: 'Finally an AI blog that sounds human. Our readers don\'t even notice the difference.',
    name: 'Sarah Lindström',
    title: 'Editor in Chief, Northbase Media',
  },
];

const CLIENTS = ['Vercel', 'Netlify', 'Railway', 'Fly.io', 'Docker', 'Supabase'];

export default function HomePage() {
  const articles = getPublishedArticles();
  const featured = articles[0];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--ink-primary)' }}>
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-40">
        <div className="glass">
          <Container narrow>
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-muted))' }}>BF</div>
                <span className="text-sm font-black tracking-tight" style={{ color: 'var(--ink-primary)' }}>BlogForge</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
                <Link href="/articles" className="transition-colors" style={{ color: 'var(--ink-secondary)' }}>Articles</Link>
                <Link href="/about" className="transition-colors" style={{ color: 'var(--ink-secondary)' }}>About</Link>
                <Link href="/status" className="transition-colors" style={{ color: 'var(--ink-secondary)' }}>Status</Link>
                <Link href="/admin" className="btn btn-primary px-4 py-2">Admin →</Link>
              </nav>
            </div>
          </Container>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg-page)' }}>
        <MeshGradient />
        <Container>
          <div className="pt-32 pb-24">
            <FadeUp>
              <div className="flex flex-wrap gap-2 mb-7">
                {HERO_BADGES.slice(0, 2).map(b => (
                  <span key={b} className="glass px-3 py-1.5 rounded-full text-[11px] font-bold" style={{ color: 'var(--accent-strong)', borderColor: 'rgba(129,140,248,0.3)' }}>
                    {b}
                  </span>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h1 className="text-display font-black tracking-tight leading-[1.02] mb-8">
                Content that writes,<br /> ranks, and grows <span className="gradient-text">itself</span>.
              </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="text-lead max-w-2xl mb-10" style={{ color: 'var(--ink-tertiary)' }}>
                Research → Write → SEO/AEO → Affiliate insertion → Quality gate → Publish — a fully autonomous, multi-agent content engine built for the modern web.
              </p>
            </FadeUp>
            <FadeUp delay={0.24}>
              <div className="flex flex-wrap gap-4 mb-16">
                <Link href="/articles" className="btn btn-primary text-base px-7 py-3.5">
                  <FileText size={20} /> Browse Articles <ArrowRight size={18} />
                </Link>
                <Link href="/admin" className="btn btn-ghost text-base px-7 py-3.5">
                  <Zap size={20} /> Open Admin
                </Link>
                <Link href="/about" className="btn btn-subtle text-base px-7 py-3.5">
                  See how it works <ChevronRight size={18} />
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.32}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATS.map(s => (
                  <Stat key={s.label} label={s.label} value={s.value} suffix={s.suffix} />
                ))}
              </div>
            </FadeUp>
          </div>
        </Container>
      </section>

      {/* BENTO */}
      <Section>
        <Container narrow>
          <div className="text-center mb-14">
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5" style={{ background: 'var(--accent-subtle)', border: '1px solid rgba(129,140,248,0.22)' }}>
                <Sparkles size={13} style={{ color: 'var(--accent-strong)' }} />
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--accent-strong)' }}>How it works</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2 className="text-h2 font-black tracking-tight mb-4">A pipeline that thinks like an editorial team</h2>
            </FadeUp>
            <FadeUp delay={0.12}>
              <p className="text-lead max-w-2xl mx-auto" style={{ color: 'var(--ink-tertiary)' }}>
                Six specialized agents collaborate to deliver articles that are accurate, engaging, and optimized for real readers.
              </p>
            </FadeUp>
          </div>
        </Container>
        <Container>
          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENTO.map(b => {
              const Icon = b.icon;
              return (
                <GlassCard key={b.title} hover className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl" style={{ background: 'var(--accent-subtle)' }}>
                      <Icon size={20} style={{ color: 'var(--accent-strong)' }} />
                    </div>
                    <h3 className="text-lg font-black tracking-tight">{b.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-tertiary)' }}>{b.desc}</p>
                </GlassCard>
              );
            })}
          </StaggerChildren>
        </Container>
      </Section>

      {/* SOCIAL PROOF */}
      <Section>
        <Container>
          <div className="mb-10">
            <h2 className="text-h2 font-black tracking-tight mb-3">Trusted by modern content teams</h2>
            <p className="text-lead" style={{ color: 'var(--ink-tertiary)' }}>From YC startups to enterprise teams — choose freedom from content bottlenecks.</p>
          </div>
          <div className="surface overflow-hidden mb-12">
            <StaggerChildren className="divide-y">
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="p-6 md:p-8 grid md:grid-cols-[1fr_auto] gap-6">
                  <div>
                    <Quote className="mb-3" size={18} style={{ color: 'var(--accent-strong)' }} />
                    <p className="text-base leading-relaxed font-medium mb-4" style={{ color: 'var(--ink-primary)' }}>{t.quote}</p>
                    <div>
                      <span className="text-sm font-black" style={{ color: 'var(--ink-primary)' }}>{t.name}</span>
                      <span className="text-caption block">{t.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </StaggerChildren>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-70">
            {CLIENTS.map(c => (
              <span key={c} className="text-caption font-black tracking-widest">{c}</span>
            ))}
          </div>
        </Container>
      </Section>

      {/* FEATURED */}
      {featured && (
        <Section>
          <Container>
            <div className="flex items-end justify-between mb-10">
              <div>
                <Badge>Toy Featured</Badge>
              </div>
              <Link href="/articles" className="btn btn-subtle text-sm">View all <ArrowRight size={14} /></Link>
            </div>
            <article className="surface overflow-hidden lg:grid lg:grid-cols-2">
              {featured.featuredImage && (
                <div className="aspect-video lg:aspect-auto lg:min-h-[420px] overflow-hidden">
                  <img src={featured.featuredImage} alt={featured.title} className="w-full h-full object-cover" loading="eager" />
                </div>
              )}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <h3 className="text-h3 font-black tracking-tight mb-3">{featured.title}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--ink-tertiary)' }}>{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-xs font-bold" style={{ color: 'var(--ink-muted)' }}>
                  <span className="inline-flex items-center gap-2"><Clock size={14} />{featured.readingTime} min read</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-2 font-mono font-black" style={{ color: 'var(--accent-strong)' }}><BarChart3 size={14} />SEO {featured.seoScore}/100</span>
                </div>
                <Link href={`/articles/${featured.slug}`} className="btn btn-primary mt-8 w-full md:w-auto">Read article →</Link>
              </div>
            </article>
          </Container>
        </Section>
      )}

      {/* LATEST */}
      <Section>
        <Container>
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-h2 font-black tracking-tight">Latest articles</h2>
            <Link href="/articles" className="btn btn-subtle text-sm">View all <ArrowRight size={14} /></Link>
          </div>
          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.slice(0, 6).map(article => (
              <Link href={`/articles/${article.slug}`} key={article.slug} className="surface surface-interactive group block">
                {article.featuredImage && (
                  <div className="aspect-video overflow-hidden">
                    <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Badge>{article.category}</Badge>
                    <span className="text-caption">{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight mb-2 line-clamp-2 transition-colors group-hover:text-[var(--accent-strong)]">{article.title}</h3>
                  <p className="text-sm line-clamp-2 mb-5" style={{ color: 'var(--ink-tertiary)' }}>{article.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs font-bold" style={{ color: 'var(--ink-muted)' }}>
                    <span className="inline-flex items-center gap-1.5"><Clock size={14} />{article.readingTime} min</span>
                    <span className="ml-auto inline-flex items-center gap-1.5 font-mono font-black" style={{ color: 'var(--accent-strong)' }}><ShieldCheck size={14} />{article.seoScore}/100</span>
                  </div>
                </div>
              </Link>
            ))}
          </StaggerChildren>
        </Container>
      </Section>

      {/* NEWSLETTER */}
      <Section>
        <Container narrow>
          <GlassCard className="p-8 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between gap-8">
            <div>
              <Badge tone="ok"><Star size={13} /> Weekly digest</Badge>
              <h3 className="text-h3 font-black tracking-tight mt-4 mb-3">Get AI-native content tactics</h3>
              <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--ink-tertiary)' }}>
                Join operators who get one sharp insight per week — no fluff. We cover ranking systems, AEO, and content operations.
              </p>
            </div>
            <form className="mt-6 md:mt-0 w-full md:w-auto flex flex-col gap-3" action="#" method="post">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-muted)' }} />
                  <input placeholder="you@company.com" className="input pl-9" />
                </div>
                <button type="submit" className="btn btn-primary px-6">Subscribe free</button>
              </div>
              <span className="text-caption">Unsubscribe anytime. No spam.</span>
            </form>
          </GlassCard>
        </Container>
      </Section>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-panel)' }}>
        <Container>
          <div className="py-14 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-muted))' }}>BF</div>
              <div>
                <span className="text-sm font-black block" style={{ color: 'var(--ink-primary)' }}>BlogForge AI</span>
                <span className="text-caption">Autonomous Content Studio</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs font-bold">
              <Link href="/articles" style={{ color: 'var(--ink-muted)' }}>Articles</Link>
              <Link href="/rss.xml" style={{ color: 'var(--ink-muted)' }}>RSS</Link>
              <Link href="/sitemap.xml" style={{ color: 'var(--ink-muted)' }}>Sitemap</Link>
              <Link href="/status" style={{ color: 'var(--ink-muted)' }}>Status</Link>
              <span className="text-caption opacity-75">FTC: some links may be affiliate links.</span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
