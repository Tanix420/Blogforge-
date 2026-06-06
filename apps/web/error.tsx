'use client';
import { useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24">
        <div className="card p-8 space-y-4">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--ink-primary)' }}>Something went wrong</h1>
          <p className="text-sm" style={{ color: 'var(--ink-tertiary)' }}>
            An unexpected error occurred while loading this page.
          </p>
          <button onClick={() => reset()} className="btn btn-primary">
            <RefreshCcw size={16} /> Try again
          </button>
        </div>
      </div>
    </div>
  );
}
