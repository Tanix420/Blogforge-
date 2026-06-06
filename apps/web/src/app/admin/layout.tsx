'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Workflow,
  Settings,
  Search,
  Plus,
  MoreVertical,
  ChevronRight,
  RefreshCcw,
  Play,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/queue', label: 'Queue', icon: FileText },
  { href: '/admin/agents', label: 'Agents', icon: Workflow },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch('/api/admin/check', {
          cache: 'no-store',
          credentials: 'same-origin',
        });
        if (!cancelled) {
          setAuthed(res.ok);
          setReady(true);
        }
      } catch {
        if (!cancelled) setReady(true);
      }
    }
    check();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (pathname.startsWith('/admin/login')) return;
    if (!authed) router.replace('/admin/login');
  }, [ready, authed, pathname, router]);

  if (pathname.startsWith('/admin/login')) return <>{children}</>;
  if (!ready || !authed) return null;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 11, flexShrink: 0,
          }}>BF</div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink-primary)' }}>BlogForge</div>
            <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>Autonomous AI</div>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === '/admin'
              : pathname.startsWith(item.href.replace('/admin/', '') as any) && item.href !== '/admin';
            return (
              <button
                key={item.href}
                onClick={() => {
                  setTab(item.href.replace('/admin/', '') as any);
                  if (item.href === '/admin') {
                    window.location.href = '/admin';
                  } else {
                    window.location.href = item.href;
                  }
                }}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)' }}>
          <a href="/" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'var(--ink-muted)', textDecoration: 'none',
          }}>
            ← View live blog
          </a>
        </div>
      </aside>

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
