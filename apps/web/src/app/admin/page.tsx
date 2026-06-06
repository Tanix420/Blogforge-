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

type Status = 'idle' | 'loading' | 'error';

interface DashboardData {
  stats: any;
  logs: any[];
  agents: any[];
  queue: any[];
}

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<Status>('idle');
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
    } catch {
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
      setToast('Pipeline started — check the Queue tab for progress.');
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
    <div className="animate-fade-in-up">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-primary)', margin: '0 0 4px' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-muted)', margin: 0 }}>
            Pipeline status, agent health, and recent logs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={loadData} className="btn btn-ghost">
            <RefreshCcw size={16} /> Refresh
          </button>
          <button onClick={runPipeline} disabled={running} className="btn btn-primary">
            <Play size={16} /> {running ? 'Running…' : 'Run Pipeline'}
          </button>
        </div>
      </div>

      {status === 'error' && (
        <div className="card" style={{ padding: 16, color: 'var(--danger)', marginBottom: 20, fontSize: 14 }}>
          Failed to load admin data. <button onClick={loadData} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }}>Retry</button>
        </div>
      )}

      {status === 'loading' && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div className="skeleton" style={{ height: 16, width: 120, marginBottom: 12 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="skeleton" style={{ height: 72 }} />
            ))}
          </div>
        </div>
      )}

      {overview && (
        <>
          {/* Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12, marginBottom: 24,
          }}>
            {[
              { label: 'Total', value: data?.stats?.totalArticles ?? 0 },
              { label: 'Published', value: data?.stats?.publishedArticles ?? 0 },
              { label: 'Drafts', value: data?.stats?.draftArticles ?? 0 },
              { label: 'Queue', value: (data?.queue ?? []).length },
              { label: 'Agents', value: (data?.agents ?? []).length },
              { label: 'Avg SEO', value: `${data?.stats?.avgSeo ?? 0}%` },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
            {/* Agent Status */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Play size={18} style={{ color: 'var(--accent-strong)' }} />
                <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-primary)', margin: 0 }}>Agent Status</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(data.agents ?? []).slice(0, 6).map((agent: any, i: number) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0', borderBottom: i < Math.min((data.agents ?? []).length, 6) - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {agent.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>
                        {agent.lastRun ? `${agent.lastRun}${typeof agent.calls !== 'undefined' ? ` · ${agent.calls} calls` : ''}` : 'Not run yet'}
                      </div>
                    </div>
                    <span className="badge" style={{
                      background: agent.status === 'running' ? 'var(--warn)' : 'var(--accent-subtle)',
                      color: agent.status === 'running' ? '#000' : 'var(--accent-strong)',
                      marginLeft: 12,
                    }}>{agent.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Logs */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Workflow size={18} style={{ color: 'var(--accent-strong)' }} />
                <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-primary)', margin: 0 }}>Recent Logs</h2>
              </div>
              <div style={{ maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(data.logs ?? []).length === 0 && (
                  <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>No recent logs.</div>
                )}
                {(data.logs ?? []).map((log: any, i: number) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, padding: '8px 0',
                    borderBottom: i < (data.logs ?? []).length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    fontSize: 12,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)',
                      whiteSpace: 'nowrap', flexShrink: 0, marginTop: 1,
                    }}>
                      {new Date(log.ts ?? Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <span className="badge" style={{ marginRight: 6, fontSize: 11 }}>{log.agent ?? 'system'}</span>
                      <span style={{ color: 'var(--ink-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: 200, verticalAlign: 'middle' }}>
                        {log.msg ?? log.message ?? ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Queue */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <FileText size={18} style={{ color: 'var(--accent-strong)' }} />
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-primary)', margin: 0 }}>Content Queue</h2>
                </div>
                <p style={{ fontSize: 12, color: 'var(--ink-muted)', margin: 0 }}>
                  {(data.queue ?? []).length} jobs queued
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <input
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  placeholder="New topic title"
                  className="input"
                  style={{ width: 240 }}
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
                  {running ? 'Running…' : 'Generate'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {(data.queue ?? []).length === 0 && (
                <div style={{ fontSize: 13, color: 'var(--ink-muted)', textAlign: 'center', padding: 32 }}>
                  Nothing in the queue yet.
                </div>
              )}
              {(data.queue ?? []).map((job: any, i: number) => (
                <div key={job.id ?? i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '12px 0', borderBottom: i < (data.queue ?? []).length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0, flex: 1 }}>
                    <div style={{
                      marginTop: 5, width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background:
                        job.status === 'running' ? 'var(--warn)' :
                        job.status === 'done' ? 'var(--success)' :
                        'var(--accent-strong)',
                      boxShadow: job.status === 'running' ? '0 0 12px rgba(251,191,36,0.4)' : 'none',
                    }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {job.topic}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 3 }}>
                        {job.niche ?? 'General'} · {job.status ?? 'queued'}{typeof job.progress === 'number' ? ` · ${job.progress}%` : ''}
                      </div>
                    </div>
                  </div>
                  <span className="badge" style={{
                    background:
                      job.status === 'running' ? 'var(--warn)' :
                      job.status === 'done' ? 'var(--success)' :
                      'var(--accent-subtle)',
                    color:
                      job.status === 'running' ? '#000' :
                      job.status === 'done' ? '#000' :
                      'var(--accent-strong)',
                    flexShrink: 0,
                  }}>
                    {job.status ?? 'queued'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {toast && (
        <div className="card" style={{
          position: 'fixed', bottom: 20, right: 20, padding: '12px 16px',
          fontSize: 13, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
          zIndex: 50,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
