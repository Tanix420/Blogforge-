'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { FadeUp } from '@/components/motion/motion';

type SourceItem = { id: string; title: string; status: string; updatedAt?: string; tags?: string[] };
const DEFAULT_SOURCES: SourceItem[] = [
  { id: 'src-1', title: 'AI Breakthroughs', status: 'completed', updatedAt: new Date().toISOString(), tags: ['ai', 'research'] },
  { id: 'src-2', title: 'Automation Weekly', status: 'completed', updatedAt: new Date().toISOString(), tags: ['automation', 'news'] },
  { id: 'src-3', title: 'AI Tools Radar', status: 'completed', updatedAt: new Date().toISOString(), tags: ['tools', 'ai'] },
  { id: 'src-4', title: 'SaaS Blog Trends', status: 'pending', updatedAt: new Date().toISOString(), tags: ['saas', 'seo'] }
];

export default function SourcesPage() {
  const [items, setItems] = useState<SourceItem[]>(() => {
    try {
      const raw = localStorage.getItem('blogforge.researchSources');
      if (raw) return JSON.parse(raw) as SourceItem[];
    } catch {}
    return DEFAULT_SOURCES;
  });
  const [status, setStatus] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', status: 'pending', tags: '' });

  const sync = (next: SourceItem[]) => {
    setItems(next);
    try {
      localStorage.setItem('blogforge.researchSources', JSON.stringify(next));
    } catch {}
  };

  const startEdit = (item: SourceItem) => {
    setEditingId(item.id);
    setForm({ title: item.title, status: item.status, tags: (item.tags || []).join(', ') });
  };

  const saveEdit = () => {
    if (!editingId) return;
    sync(
      items.map((item) =>
        item.id === editingId
          ? { ...item, title: form.title.trim() || item.title, status: form.status, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }
          : item
      )
    );
    setEditingId(null);
  };

  const addItem = () => {
    if (!form.title.trim()) return;
    const next: SourceItem[] = [...items, {
      id: `src-${Date.now()}`,
      title: form.title.trim(),
      status: form.status,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      updatedAt: new Date().toISOString()
    }];
    sync(next);
    setForm({ title: '', status: 'pending', tags: '' });
  };

  const removeItem = (id: string) => {
    sync(items.filter((item) => item.id !== id));
  };

  const reset = () => sync(DEFAULT_SOURCES);

  useEffect(() => {
    setStatus(`Loaded ${items.length} research sources`);
    const t = setTimeout(() => setStatus(''), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-h3 tracking-tight">Research Sources</h2>
            <p className="text-sm" style={{ color: 'var(--ink-tertiary)' }}>Manage inputs for the research agent.</p>
          </div>
          {status ? <span className="text-xs font-bold text-emerald-300">{status}</span> : null}
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <div className="card space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold" style={{ color: 'var(--ink-muted)' }}>Name</label>
              <input className="input mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Research domain" />
            </div>
            <div>
              <label className="text-xs font-bold" style={{ color: 'var(--ink-muted)' }}>Status</label>
              <select className="input mt-1" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold" style={{ color: 'var(--ink-muted)' }}>Tags</label>
              <input className="input mt-1" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="tag1, tag2" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-primary" onClick={addItem}>
              <Plus size={14} /> Add
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setForm({ title: '', status: 'pending', tags: '' })}>Clear</button>
            <button type="button" className="btn btn-ghost text-rose-400" onClick={reset}>Reset defaults</button>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Updated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-black/40">
                  <td>
                    {editingId === item.id ? (<input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />) : (<span className="text-sm font-bold">{item.title}</span>)}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                    ) : (<span className={`badge ${item.status === 'completed' ? 'badge-accent' : item.status === 'failed' ? 'badge-critical' : ''}`}>{item.status}</span>)}
                  </td>
                  <td>
                    {editingId === item.id ? (<input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />) : (<span className="text-xs" style={{ color: 'var(--ink-muted)' }}>{(item.tags || []).join(', ')}</span>)}
                  </td>
                  <td className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                    {item.updatedAt ? new Date(item.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      {editingId === item.id ? (<button type="button" className="btn btn-ghost text-xs" onClick={saveEdit}><Save size={14} /> Save</button>) : (<button type="button" className="btn btn-ghost text-xs" onClick={() => startEdit(item)}>Edit</button>)}
                      <button type="button" className="btn btn-ghost text-rose-400 text-xs" onClick={() => removeItem(item.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (<tr><td colSpan={5} className="text-sm" style={{ color: 'var(--ink-muted)' }}>No sources yet. Add one above.</td></tr>) : null}
            </tbody>
          </table>
        </div>
      </FadeUp>
    </div>
  );
}