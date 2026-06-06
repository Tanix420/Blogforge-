'use client';

import { useEffect, useState } from 'react';
import { FileText, Clock, AlertTriangle, MoreVertical, Pause, Play, RefreshCw } from 'lucide-react';
import { FadeUp } from '@/components/motion/motion';

type Job = {
  id: string;
  topic: string;
  status: 'researching' | 'queued' | 'writing' | 'review' | 'published' | 'failed';
  priority: 'low' | 'medium' | 'high';
  eta: string;
  updatedAt?: string;
};

export default function AdminQueue() {
  const [items, setItems] = useState<Job[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [jobsRes, articlesRes] = await Promise.all([
          fetch('/api/admin/jobs', { cache: 'no-store', credentials: 'include' }),
          fetch('/api/articles', { cache: 'no-store' }),
        ]);
        if (!jobsRes.ok) throw new Error(`jobs ${jobsRes.status}`);
        const jobs: Job[] = (await jobsRes.json()).map((job: any) => ({
          id: job.id,
          topic: job.topic,
          status: job.status ?? 'queued',
          priority: job.priority ?? 'medium',
          eta: job.eta ?? '—',
          updatedAt: job.updatedAt ?? new Date().toISOString(),
        }));
        let articles: any[] = [];
        if (articlesRes.ok) articles = await articlesRes.json();
        const toJobStatus = (raw: string): Job['status'] => {
          const normalized = raw.toLowerCase();
          if (normalized === 'published') return 'published';
          if (normalized === 'reviewing' || normalized === 'review') return 'review';
          if (normalized === 'writing') return 'writing';
          if (normalized === 'failed') return 'failed';
          if (normalized === 'researching') return 'researching';
          return 'queued';
        };

        const articleJobs: Job[] = articles.slice(0, 6).map((article: any) => ({
          id: article.slug,
          topic: article.title,
          status: toJobStatus(article.status),
          priority: 'medium',
          eta: '—',
          updatedAt: article.updatedAt ?? article.publishedAt ?? new Date().toISOString(),
        }));

        const merged = [...jobs, ...articleJobs];
        if (!cancelled) {
          setItems(merged);
          setStatus('idle');
        }
      } catch (err: any) {
        if (!cancelled) setStatus('error');
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const refresh = async () => {
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 400));
    window.location.reload();
  };

  const togglePriority = (id: string) => {
    setItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const next = item.priority === 'high' ? 'low' : item.priority === 'low' ? 'medium' : 'high';
        return { ...item, priority: next };
      }),
    );
  };

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Content Queue
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-tertiary)' }}>
              Prioritize, pause, or reorder upcoming generation jobs from real admin data.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color: 'var(--ink-muted)' }}>
              {items.length} jobs
            </span>
            <button
              type="button"
              className="btn btn-ghost text-xs"
              onClick={refresh}
              disabled={status === 'loading'}
            >
              <RefreshCw className={status === 'loading' ? 'animate-spin' : ''} size={14} /> Refresh
            </button>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.05} className="card overflow-hidden">
        {status === 'error' ? (
          <div className="p-6 text-sm" style={{ color: 'var(--ink-muted)' }}>
            Failed to load queue. Check the dashboard data source and retry.
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm" style={{ color: 'var(--ink-muted)' }}>No jobs queued yet.</div>
        ) : (
          <div className="space-y-1">
            {items.map((job) => (
              <div
                key={job.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b last:border-0 transition-colors hover:bg-black/40"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="mt-0.5 w-2 h-2 rounded-full"
                    style={{
                      background:
                        job.status === 'researching'
                          ? 'var(--warn)'
                          : job.status === 'published'
                            ? 'var(--success)'
                            : 'var(--accent-strong)',
                      boxShadow: '0 0 14px rgba(129,140,248,0.4)',
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'var(--ink-primary)' }}>
                      {job.topic}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} /> {job.updatedAt ? new Date(job.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : job.eta}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={
                      'badge ' +
                      (job.status === 'published'
                        ? 'badge-accent'
                        : job.status === 'failed'
                          ? 'badge-critical'
                          : job.status === 'review'
                            ? 'badge-accent'
                            : job.status === 'researching'
                              ? 'badge-accent'
                              : '')
                    }
                  >
                    {job.status}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full border border-border-default" style={{ color: 'var(--ink-muted)' }}>
                    {job.priority}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost text-xs"
                    onClick={() => togglePriority(job.id)}
                  >
                    {job.priority === 'high' ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button type="button" className="btn btn-ghost text-xs text-rose-400">
                    <AlertTriangle size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </FadeUp>
    </div>
  );
}
