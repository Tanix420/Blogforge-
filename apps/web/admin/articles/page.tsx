'use client';
import { useState } from 'react';
import { FileText, Plus, Trash2, CheckCircle2, Clock, Search } from 'lucide-react';
import { FadeUp } from '@/components/motion/motion';

const MOCK = [
  { slug: 'best-ai-writing-tools', title: 'Best AI Writing Tools', status: 'published', seo: 94 },
  { slug: 'top-productivity-tips', title: 'Top Productivity Tips', status: 'draft', seo: 72 },
  { slug: 'future-of-ai-agents', title: 'Future of AI Agents', status: 'review', seo: 88 },
];

export default function AdminArticles() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState(MOCK);

  const filtered = rows.filter((r) => !q || r.title.toLowerCase().includes(q.toLowerCase()));

  const toggleStatus = (slug: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.slug === slug ? { ...r, status: r.status === 'published' ? 'draft' : 'published' } : r
      )
    );
  };

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>Articles</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-tertiary)' }}>Manage generated and editorial content.</p>
          </div>
          <button className="btn btn-primary">
            <Plus size={16} /> New Article
          </button>
        </div>
      </FadeUp>

      <FadeUp delay={0.08} className="card p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
            <input
              className="input pl-9"
              placeholder="Search articles…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.12} className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>Title</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>Status</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>SEO</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.slug} className="border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--ink-primary)' }}>{row.title}</td>
                <td className="px-4 py-3">
                  <span className="badge">
                    {row.status === 'published' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono" style={{ color: 'var(--accent-strong)' }}>SEO {row.seo}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button className="btn btn-ghost text-xs" onClick={() => toggleStatus(row.slug)}>
                      {row.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button className="btn btn-ghost text-xs" style={{ color: 'var(--danger)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="text-sm py-8 text-center" style={{ color: 'var(--ink-muted)' }}>
            No articles match your search.
          </div>
        )}
      </FadeUp>
    </div>
  );
}
