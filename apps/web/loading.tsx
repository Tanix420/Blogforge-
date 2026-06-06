export default function Loading() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }} />
        ))}
      </div>
    </div>
  );
}
