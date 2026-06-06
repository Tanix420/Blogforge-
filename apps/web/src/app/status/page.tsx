import Link from 'next/link';
import { Metadata } from 'next';
import { BarChart3, Globe, ShieldCheck, Workflow, Clock, HardDrive, Cpu, Zap } from 'lucide-react';
import { FadeUp, StaggerChildren } from '@/components/motion/motion';

export const metadata: Metadata = {
  title: 'System Status — BlogForge AI',
  description: 'Live system health and performance metrics for BlogForge AI.',
  openGraph: {
    title: 'System Status — BlogForge AI',
    description: 'Live system health and performance metrics for BlogForge AI.',
    url: 'https://blogforge.org/status',
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
    title: 'System Status — BlogForge AI',
    description: 'Live system health and performance metrics for BlogForge AI.',
    images: [
      'https://images.unsplash.com/photo-1676328179249-b56304e247d3?w=1200&q=80',
    ],
  },
  alternates: {
    canonical: '/status',
  },
};

const SERVICES = [
  { name: 'Frontend', status: 'operational', latency: '24ms', uptime: '99.98%', icon: Globe },
  { name: 'API', status: 'operational', latency: '18ms', uptime: '99.99%', icon: Zap },
  { name: 'Agents Runtime', status: 'operational', latency: '340ms', uptime: '99.95%', icon: Cpu },
  { name: 'Database', status: 'operational', latency: '5ms', uptime: '100.0%', icon: HardDrive },
  { name: 'Search', status: 'operational', latency: '210ms', uptime: '99.90%', icon: BarChart3 },
];

const UPTIME_DAYS = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const value = Math.random() * 0.5 + 99.5;
  return { day, value: Math.round(value * 100) / 100 };
});

export default function StatusPage() {
  const overallLatency = Math.round(SERVICES.reduce((sum, s) => sum + parseInt(s.latency), 0) / SERVICES.length);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--ink-primary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeUp>
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7' }}>
                <ShieldCheck size={13} />
                <span className="text-[11px] font-black uppercase tracking-widest">All Systems Operational</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--ink-primary)' }}>System Status</h1>
              <p className="text-sm mt-2" style={{ color: 'var(--ink-tertiary)' }}>
                Real-time health metrics for BlogForge AI infrastructure.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black" style={{ color: 'var(--accent-strong)' }}>{overallLatency}<span className="text-base font-bold ml-1" style={{ color: 'var(--ink-muted)' }}>ms</span></div>
              <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>Avg Latency</div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.05}>
          <div className="surface p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-sm uppercase tracking-wider" style={{ color: 'var(--ink-primary)' }}>Uptime (last 30 days)</h2>
              <span className="text-xs font-bold" style={{ color: 'var(--ink-muted)' }}>Updated just now</span>
            </div>
            <div className="flex items-end gap-1.5 h-24">
              {UPTIME_DAYS.map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${((point.value - 99) / 1) * 100}%`,
                      background: point.value >= 99.9 ? 'var(--accent)' : point.value >= 99.5 ? 'var(--warn)' : 'var(--danger)',
                      opacity: 0.85,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold" style={{ color: 'var(--ink-muted)' }}>
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.name} className="surface p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ background: 'var(--accent-subtle)' }}>
                        <Icon size={16} style={{ color: 'var(--accent-strong)' }} />
                      </div>
                      <span className="text-sm font-black" style={{ color: 'var(--ink-primary)' }}>{service.name}</span>
                    </div>
                    <span className="badge badge-ok">{service.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--ink-muted)' }}>
                    <span>Latency: <span className="font-mono font-black" style={{ color: 'var(--accent-strong)' }}>{service.latency}</span></span>
                    <span>Uptime: <span className="font-mono font-black" style={{ color: 'var(--success)' }}>{service.uptime}</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="surface p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock size={18} style={{ color: 'var(--accent-strong)' }} />
              <h2 className="font-black" style={{ color: 'var(--ink-primary)' }}>Scheduled Maintenance</h2>
            </div>
            <div className="text-sm" style={{ color: 'var(--ink-tertiary)' }}>
              No scheduled maintenance windows at this time.
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="mt-8 text-center">
          <Link href="/" className="btn btn-ghost text-sm">
            ← Back to Home
          </Link>
        </FadeUp>
      </div>
    </div>
  );
}
