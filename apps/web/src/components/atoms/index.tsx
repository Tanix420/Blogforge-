'use client';
import { ReactNode } from 'react';

export function MeshGradient({ className }: { className?: string }) {
  return (
    <div className={['absolute inset-0 overflow-hidden pointer-events-none', className].filter(Boolean).join(' ')}>
      <div
        className="absolute top-[-18%] left-[-10%] w-[75%] h-[75%] rounded-full opacity-70"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.32) 0%, transparent 65%)', filter: 'blur(90px)' }}
      />
      <div
        className="absolute bottom-[-14%] right-[-8%] w-[68%] h-[68%] rounded-full opacity-70"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.28) 0%, transparent 65%)', filter: 'blur(90px)' }}
      />
      <div
        className="absolute top-[32%] left-[44%] w-[44%] h-[44%] rounded-full opacity-50 hidden md:block"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)', filter: 'blur(70px)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      />
    </div>
  );
}

export function GlassCard({
  children,
  className,
  hover,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  const base = ['glass p-6', hover ? 'transition-all duration-300 hover:shadow-lg' : '', className]
    .filter(Boolean)
    .join(' ');
  return <div className={base}>{children}</div>;
}

export function Badge({ children, tone }: { children: ReactNode; tone?: 'default' | 'ok' | 'warn' | 'danger' }) {
  const cls = tone === 'default' || !tone ? '' : `badge-${tone}`;
  return <span className={['badge', cls].join(' ')}>{children}</span>;
}

export function Stat({ label, value, suffix, icon }: { label: string; value: number; suffix?: string; icon?: ReactNode }) {
  return (
    <div className="surface p-6 flex items-start gap-4">
      {icon && <div className="p-3 rounded-xl" style={{ background: 'var(--accent-subtle)' }}>{icon}</div>}
      <div>
        <div className="text-caption mb-2">{label}</div>
        <div className="text-3xl font-black tracking-tight" style={{ color: 'var(--ink-primary)' }}>
          {value}{suffix}
        </div>
      </div>
    </div>
  );
}

export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={['py-20', className].filter(Boolean).join(' ')}>{children}</section>;
}

export function Container({ children, narrow }: { children: ReactNode; narrow?: boolean }) {
  return (
    <div className={['max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', narrow ? 'max-w-4xl' : ''].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export function Divider() {
  return <div className="w-full h-px" style={{ background: 'var(--border-subtle)' }} />;
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 rounded-xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
      <div className="text-display font-black" style={{ color: 'var(--ink-primary)' }}>{value}</div>
      <div className="text-caption mt-1">{label}</div>
    </div>
  );
}
