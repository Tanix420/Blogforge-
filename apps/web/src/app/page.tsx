import { Metadata } from 'next';
import HeroBento from '@/components/home/hero-bento';

export const metadata: Metadata = {
  title: 'BlogForge AI — Autonomous AI Blog',
  description: 'AI-powered content ecosystem that writes, ranks, and scales your blog autonomously. Research, generate, and publish SEO-optimized articles without manual intervention.',
  openGraph: {
    title: 'BlogForge AI — Autonomous AI Blog',
    description: 'AI-powered content ecosystem that writes, ranks, and scales your blog autonomously.',
    url: 'https://blogforge.org/',
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
    title: 'BlogForge AI — Autonomous AI Blog',
    description: 'AI-powered content ecosystem that writes, ranks, and scales your blog autonomously.',
    images: [
      'https://images.unsplash.com/photo-1676328179249-b56304e247d3?w=1200&q=80',
    ],
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return <HeroBento />;
}
