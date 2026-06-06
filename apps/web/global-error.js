'use client';
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en" className="dark">
      <body style={{ background: 'var(--bg-page)', color: 'var(--ink-primary)' }}>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="card p-8 space-y-3 text-center">
            <h1 className="text-3xl font-bold">Application error</h1>
            <p className="text-sm" style={{ color: 'var(--ink-tertiary)' }}>{error.message}</p>
            <button onClick={() => reset()} className="btn btn-primary">Try again</button>
          </div>
        </div>
      </body>
    </html>
  );
}
