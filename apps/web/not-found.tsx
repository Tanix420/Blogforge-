import Link from 'next/link';
import { Metadata } from 'next';
import { FadeUp } from '@/components/motion/motion';
import { FileText } from 'lucide-react';

export const metadata: Metadata = { title: '404 – Not Found' };

export default function NotFound() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
        <FadeUp className="text-center">
          <div className="text-6xl mb-6">🧭</div>
          <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ color: 'var(--ink-primary)' }}>We hit a dead end.</h1>
          <p className="text-sm mb-10" style={{ color: 'var(--ink-tertiary)' }}>
            The page you’re looking for doesn’t exist or has been moved.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary">Back to homepage</Link>
            <Link href="/articles" className="btn btn-ghost">
              <FileText size={16} /> Browse articles
            </Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
