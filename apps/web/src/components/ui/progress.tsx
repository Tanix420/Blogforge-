'use client';

export function Progress({ value, className }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={['relative h-2 rounded-full overflow-hidden', className].filter(Boolean).join(' ')}
      style={{ background: 'var(--bg-input)' }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--accent), var(--accent-strong))',
          transition: 'width 600ms cubic-bezier(0.2,0,0,1)',
        }}
      />
    </div>
  );
}
