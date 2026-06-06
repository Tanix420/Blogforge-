import Link from 'next/link';
import { Metadata } from 'next';
import { FadeUp } from '@/components/motion/motion';
import { BookOpen, ChevronLeft, Workflow, Zap, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About – BlogForge AI',
  description: 'Learn about BlogForge AI, the autonomous content platform that writes, ranks, and scales your blog.',
  openGraph: {
    title: 'About – BlogForge AI',
    description: 'Learn about BlogForge AI, the autonomous content platform that writes, ranks, and scales your blog.',
    url: 'https://blogforge.org/about',
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
    title: 'About – BlogForge AI',
    description: 'Learn about BlogForge AI, the autonomous content platform that writes, ranks, and scales your blog.',
    images: [
      'https://images.unsplash.com/photo-1676328179249-b56304e247d3?w=1200&q=80',
    ],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <FadeUp>
          <Link href="/" className="text-xs inline-flex items-center gap-1 text-ink-muted hover:text-ink-primary transition-colors mb-8"><ChevronLeft size={14} /> Back to home</Link>
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: 'var(--ink-primary)' }}>About BlogForge AI</h1>
          <p className="text-lg mb-8" style={{ color: 'var(--ink-tertiary)' }}>
            An autonomous, multi-agent AI content engine built for the next generation of the web.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <section className="card p-8 mb-6">
            <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--ink-primary)' }}>Our Mission</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-tertiary)' }}>
              BlogForge AI was built to close the gap between what AI <em>can</em> produce and what humans actually want to read. We believe intelligent automation should amplify, not replace, human intent. Our pipeline combines research, writing, SEO/AEO optimization, affiliate insertion, and a quality gate — all without human intervention after setup.
            </p>
          </section>
        </FadeUp>

        <FadeUp delay={0.15}>
          <section className="card p-8 mb-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--ink-primary)' }}><Workflow size={20} style={{ color: 'var(--accent-strong)' }} /> How It Works</h2>
            <ol className="space-y-4" style={{ color: 'var(--ink-secondary)' }}>
              <li className="flex gap-4">
                <div className="text-accent-strong font-mono text-sm mt-0.5">01</div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--ink-primary)' }}>Trending Research</h3>
                  <p className="text-sm" style={{ color: 'var(--ink-tertiary)' }}>The engine hunts HN, Reddit, GitHub, and trending search topics without authentication.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="text-accent-strong font-mono text-sm mt-0.5">02</div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--ink-primary)' }}>Deep Research</h3>
                  <p className="text-sm" style={{ color: 'var(--ink-tertiary)' }}>Fetches relevant sources, summarizes context, builds an outline.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="text-accent-strong font-mono text-sm mt-0.5">03</div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--ink-primary)' }}>Write + SEO/AEO</h3>
                  <p className="text-sm" style={{ color: 'var(--ink-tertiary)' }}>Generates human-sounding long-form content with meta tags and schema-ready structure.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="text-accent-strong font-mono text-sm mt-0.5">04</div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--ink-primary)' }}>Quality Gate</h3>
                  <p className="text-sm" style={{ color: 'var(--ink-tertiary)' }}>Heuristic + LLM review to approve or revise — publish or iterate.</p>
                </div>
              </li>
            </ol>
          </section>
        </FadeUp>

        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            { icon: Zap, label: '7 Agents', sub: 'Collaborating in concert' },
            { icon: BarChart3, label: '94%', sub: 'Average SEO score' },
            { icon: BookOpen, label: 'Research-first', sub: 'Rooted in real topics' },
          ].map(k => (
            <FadeUp key={k.label} className="card p-6 text-center">
              <k.icon size={28} style={{ color: 'var(--accent-strong)' }} className="mx-auto mb-3" />
              <p className="text-2xl font-bold" style={{ color: 'var(--ink-primary)' }}>{k.label}</p>
              <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{k.sub}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}
