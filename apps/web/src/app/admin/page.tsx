'use client';

import { useEffect, useRef, useState } from 'react';
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
import { FadeUp, StaggerChildren } from '@/components/motion/motion';

const NAV_ITEMS = [
 { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
 { href: '/admin/articles', label: 'Articles', icon: FileText },
 { href: '/admin/queue', label: 'Queue', icon: FileText },
 { href: '/admin/agents', label: 'Agents', icon: Workflow },
 { href: '/admin/settings', label: 'Settings', icon: Settings },
];

type Status = 'idle' | 'loading' | 'error';

interface DashboardData {
 stats: any;
 logs: any[];
 agents: any[];
 queue: any[];
}

export default function AdminPage() {
 const [tab, setTab] = useState<string>('overview');
 const [data, setData] = useState<DashboardData | null>(null);
 const [status, setStatus] = useState<Status>('idle');
 const [recentSlug, setRecentSlug] = useState<string | null>(null);
 const [toast, setToast] = useState<string | null>(null);
 const [running, setRunning] = useState(false);
 const [form, setForm] = useState({ topic: '', niche: 'Technology' });
 const fetchedRef = useRef(false);

 useEffect(() => {
  if (fetchedRef.current) return;
  fetchedRef.current = true;
  loadData();
 }, []);

 async function loadData() {
  setStatus('loading');
  try {
   const res = await fetch('/api/admin/dashboard', { cache: 'no-store', credentials: 'include' });
   if (!res.ok) throw new Error(`HTTP ${res.status}`);
   const json = await res.json();
   setData(json);
   setStatus('idle');
  } catch (err: any) {
   setStatus('error');
  }
 }

 async function runPipeline() {
  if (!form.topic) return;
  setRunning(true);
  try {
   const res = await fetch('/api/admin/jobs/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: form.topic, niche: form.niche, mode: 'full' }),
    credentials: 'include',
   });
   if (!res.ok) throw new Error('Pipeline failed');
   setToast('Pipeline started ??? check the Queue tab for progress.');
   setForm((f) => ({ ...f, topic: '' }));
   setTimeout(() => setToast(null), 4000);
   setTimeout(loadData, 1200);
  } catch {
   setToast('Failed to run pipeline. Check logs.');
   setTimeout(() => setToast(null), 4000);
  } finally {
   setRunning(false);
  }
 }

 const overview = (data?.stats && data?.agents && data?.logs) || null;

 return (
  <div className="min-h-screen" style={{ background: 'var(--bg-panel)' }}>
   <div className="flex">
    <aside
     className="w-64 fixed top-0 left-0 h-screen border-r flex flex-col"
     style={{
      background: 'var(--bg-elevated)',
      borderColor: 'var(--border-default)',
      boxShadow: 'var(--shadow-md)',
      zIndex: 50,
     }}
    >
     <div
      className="h-16 flex items-center gap-3 px-6 border-b"
      style={{ borderColor: 'var(--border-default)' }}
     >
      <div
       className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
       style={{
        background: 'linear-gradient(135deg, var(--accent), var(--accent-muted))',
        boxShadow: 'var(--shadow-md)',
       }}
      >
       BF
      </div>
      <div className="leading-tight">
       <span className="font-bold text-sm block" style={{ color: 'var(--ink-primary)' }}>
        BlogForge
       </span>
       <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>
        Autonomous AI
       </span>
      </div>
     </div>

     <nav className="p-3 space-y-1 flex-1">
      {NAV_ITEMS.map((item) => {
       const Icon = item.icon;
       const isActive = item.exact
        ? tab === 'overview' && item.href === '/admin'
        : tab !== 'overview' && item.href.includes(tab);
       return (
        <button
         key={item.href}
         onClick={() => setTab(item.href.replace('/admin/', '') as any)}
         className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left"
         style={{
          background: isActive ? 'var(--accent-subtle)' : 'transparent',
          color: isActive ? 'var(--accent-strong)' : 'var(--ink-muted)',
          fontWeight: isActive ? 600 : 400,
         }}
        >
         <Icon
          size={16}
          style={{ color: isActive ? 'var(--accent-strong)' : 'var(--ink-muted)' }}
         />
         <span>{item.label}</span>
        </button>
       );
      })}
     </nav>

     <div className="p-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
      <a
       href="/"
       className="flex items-center gap-2 text-xs transition-colors"
       style={{ color: 'var(--ink-muted)' }}
      >
       ← View live blog
      </a>
     </div>
    </aside>

    <main className="ml-64 flex-1 min-h-screen" style={{ background: 'var(--bg-page)' }}>
     <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <FadeUp>
       <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
         <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
          Dashboard
         </h1>
         <p className="text-sm mt-1" style={{ color: 'var(--ink-tertiary)' }}>
          Pipeline status, agent health, and recent logs.
         </p>
        </div>
        <div className="flex items-center gap-2">
         <button onClick={loadData} className="btn btn-ghost">
          <RefreshCcw size={16} /> Refresh
         </button>
         <button onClick={runPipeline} disabled={running} className="btn btn-primary">
          <Play size={18} /> {running ? 'Running???' : 'Run Pipeline'}
         </button>
        </div>
       </div>
      </FadeUp>

      {status === 'error' && (
       <FadeUp delay={0.04}>
        <div className="card p-4 text-sm" style={{ color: 'var(--danger)' }}>
         Failed to load admin data. <button onClick={loadData} className="underline">Retry</button>
        </div>
       </FadeUp>
      )}
{status === 'loading' && (
 <FadeUp delay={0.05} className="card p-5">
  <div className="text-sm" style={{ color: 'var(--ink-muted)' }}>
   Loading live data...
  </div>
 </FadeUp>
 )}

        {overview && (
         <>
          <FadeUp delay={0.05}>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
             { label: 'Total', value: data?.stats?.totalArticles ?? 0 },
             { label: 'Published', value: data?.stats?.publishedArticles ?? 0 },
             { label: 'Drafts', value: data?.stats?.draftArticles ?? 0 },
             { label: 'Queue', value: (data?.queue ?? []).length },
             { label: 'Agents', value: (data?.agents ?? []).length },
             { label: 'Avg SEO', value: (data?.stats?.avgSeo ?? 0) + '%' },
            ].map((s, i) => (
             <div key={i} className="card p-4">
              <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--ink-muted)' }}>
               {s.label}
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--ink-primary)' }}>
               {s.value}
              </div>
             </div>
            ))}
           </div>
          </FadeUp>

          <div className="grid lg:grid-cols-2 gap-5">
           <FadeUp delay={0.1} className="card p-5">
            <div className="flex items-center gap-2 mb-4">
             <Play size={18} style={{ color: 'var(--accent-strong)' }} />
             <h2 className="font-semibold" style={{ color: 'var(--ink-primary)' }}>
              Agent Status
             </h2>
            </div>
            <div className="space-y-2">
             {(data.agents ?? []).slice(0, 6).map((agent: any) => (
              <div
               key={agent.name}
               className="flex items-center justify-between py-2.5 border-b last:border-0"
               style={{ borderColor: 'var(--border-subtle)' }}
              >
               <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: 'var(--ink-primary)' }}>
                 {agent.name}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--ink-muted)' }}>
                 {agent.lastRun
                  ? `${agent.lastRun}${typeof agent.calls !== 'undefined' ? ' . ' + agent.calls + ' calls' : ''}`
                  : 'Not run yet'}
                </div>
               </div>
               <span
                className="badge"
                style={{
                 background: agent.status === 'running' ? 'var(--warn)' : 'var(--accent-subtle)',
                 color: agent.status === 'running' ? '#000' : 'var(--accent-strong)',
                }}
               >
                {agent.status}
               </span>
              </div>
             ))}
            </div>
           </FadeUp>

           <FadeUp delay={0.12} className="card p-5">
            <div className="flex items-center gap-2 mb-4">
             <Workflow size={18} style={{ color: 'var(--accent-strong)' }} />
             <h2 className="font-semibold" style={{ color: 'var(--ink-primary)' }}>Recent Logs</h2>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
             {(data.logs ?? []).length === 0 && (
               <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>No recent logs.</div>
             )}
             {(data.logs ?? []).map((log: any, i: number) => (
              <div
               key={i}
               className="flex gap-3 text-sm py-2 border-b last:border-0"
               style={{ borderColor: 'var(--border-subtle)' }}
              >
               <span className="text-xs shrink-0 mt-0.5 font-mono" style={{ color: 'var(--ink-muted)' }}>
                {new Date(log.ts ?? Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </span>
               <div className="min-w-0">
                <span className="badge mr-2">{log.agent ?? 'system'}</span>
                <span className="text-xs truncate" style={{ color: 'var(--ink-tertiary)' }}>
                 {log.msg ?? log.message ?? ''}
                </span>
               </div>
              </div>
             ))}
            </div>
           </FadeUp>
          </div>

          <FadeUp delay={0.15} className="card p-6">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
             <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--ink-primary)' }}>
              <FileText size={18} style={{ color: 'var(--accent-strong)' }} /> Content Queue
             </h2>
             <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>
              {(data.queue ?? []).length} jobs queued
             </p>
            </div>
            <div className="flex items-center gap-2">
             <input
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              placeholder="New topic title"
              className="input"
              style={{ width: 320 }}
             />
             <select
              value={form.niche}
              onChange={(e) => setForm({ ...form, niche: e.target.value })}
              className="input"
              style={{ width: 160 }}
             >
              <option>Technology</option>
              <option>AI & Machine Learning</option>
              <option>SEO</option>
              <option>Business</option>
              <option>Web Development</option>
             </select>
             <button onClick={runPipeline} disabled={running || !form.topic} className="btn btn-primary">
              {running ? 'Running???' : 'Generate'}
             </button>
            </div>
           </div>

           <div className="space-y-2">
            {(data.queue ?? []).length === 0 && (
             <div className="text-sm" style={{ color: 'var(--ink-muted)' }}>Nothing in the queue yet.</div>
            )}
            {(data.queue ?? []).map((job: any) => (
             <div
              key={job.id}
              className="flex items-center justify-between gap-4 px-4 py-3 border-b last:border-0"
              style={{ borderColor: 'var(--border-subtle)' }}
             >
              <div className="flex items-start gap-3 min-w-0">
               <div
                className="mt-0.5 w-2 h-2 rounded-full"
                style={{
                 background:
                  job.status === 'running'
                   ? 'var(--warn)'
                   : job.status === 'done'
                    ? 'var(--success)'
                    : 'var(--accent-strong)',
                 boxShadow: '0 0 14px rgba(129,140,248,0.4)',
                }}
               />
               <div className="min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: 'var(--ink-primary)' }}>
                 {job.topic}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>
                 {job.niche ?? 'General'} . {job.status ?? 'queued'}
                 {typeof job.progress === 'number' ? ` . ${job.progress}%` : ''}
                </div>
               </div>
              </div>
              <span
               className="badge"
               style={{
                background:
                 job.status === 'running'
                  ? 'var(--warn)'
                  : job.status === 'done'
                   ? 'var(--success)'
                   : 'var(--accent-subtle)',
                color:
                 job.status === 'running'
                  ? '#000'
                  : job.status === 'done'
                   ? '#000'
                   : 'var(--accent-strong)',
               }}
              >
               {job.status ?? 'queued'}
              </span>
             </div>
            ))}
           </div>
          </FadeUp>
         </>
        )}

        {tab !== 'overview' && (
         <FadeUp delay={0.1} className="card p-6">
          <div className="flex items-center justify-between mb-4">
           <h1 className="text-2xl font-bold" style={{ color: 'var(--ink-primary)' }}>
            {tab?.[0].toUpperCase()}{tab?.slice(1)}
           </h1>
           <button onClick={loadData} className="btn btn-ghost text-xs">
            <RefreshCcw size={14} /> Refresh
           </button>
          </div>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
           Full management for {tab} is wired to the live API. Use Dashboard for a quick overview, or open the dedicated page at /admin/{tab}.
          </p>
         </FadeUp>
        )}

        {toast && (
         <div
          className="fixed bottom-5 right-5 card px-4 py-3 text-sm"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
         >
          {toast}
         </div>
        )}
       </div>
      </main>
     </div>
    </div>
   );
  }

