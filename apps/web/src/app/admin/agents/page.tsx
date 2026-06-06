'use client';

import { useEffect, useState } from 'react';
import { Workflow, Activity, Search, Power, ChevronRight, RefreshCw } from 'lucide-react';
import { FadeUp, StaggerChildren } from '@/components/motion/motion';

type Agent = {
  name: string;
  status: 'running' | 'idle' | 'error';
  lastRun: string;
  successRate: number;
  calls: string;
  desc: string;
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/dashboard', { cache: 'no-store', credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const mapped: Agent[] = (json.agents || []).map((item: any) => ({
          name: item.name,
          status: (item.status || 'idle').toLowerCase(),
          lastRun: item.lastRun || '—',
          successRate: item.successRate ?? 0,
          calls: item.calls ?? '0',
          desc: item.desc || 'Agent module',
        }));
        setAgents(mapped);
        setStatus('idle');
      } catch (err) {
        setStatus('error');
      }
    };
    load();
  }, []);

  const refresh = async () => {
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 400));
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Agents
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-tertiary)' }}>
              Pipeline health from real admin telemetry.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color: 'var(--ink-muted)' }}>
              {agents.filter((a) => a.status === 'running').length} live
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

      {status === 'error' ? (
        <FadeUp className="card p-6 text-sm" style={{ color: 'var(--ink-muted)' }}>
          Failed to load agents. Check the admin dashboard API and retry.
        </FadeUp>
      ) : agents.length === 0 ? (
        <FadeUp className="card p-6 text-sm" style={{ color: 'var(--ink-muted)' }}>
          No agents reported.
        </FadeUp>
      ) : (
        <FadeUp delay={0.05}>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Last run</th>
                  <th>Success rate</th>
                  <th>Calls</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent, idx) => (
                  <tr
                    key={agent.name + idx}
                    className="transition-colors hover:bg-black/40"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: 'var(--accent-subtle)', color: 'var(--accent-strong)' }}
                        >
                          <Workflow size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: 'var(--ink-primary)' }}>
                            {agent.name}
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>
                            {agent.desc}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={
                          'badge ' +
                          (agent.status === 'running' ? 'badge-accent' : agent.status === 'error' ? 'badge-critical' : '')
                        }
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                      {agent.lastRun}
                    </td>
                    <td>
                      <span className="text-sm font-bold" style={{ color: 'var(--ink-primary)' }}>
                        {agent.successRate}%
                      </span>
                    </td>
                    <td className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                      {agent.calls}
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button type="button" className="btn btn-ghost text-xs">
                          <Power size={14} />
                        </button>
                        <button type="button" className="btn btn-ghost text-xs">
                          <Search size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      )}
    </div>
  );
}
