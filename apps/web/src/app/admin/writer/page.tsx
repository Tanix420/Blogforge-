'use client';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { FileText, Plus, Loader2 } from 'lucide-react';
import { FadeUp } from '@/components/motion/motion';

type ArticleDraft = { id: string; title: string; status: 'draft' | 'review' | 'scheduled'; updatedAt?: string };

const SAMPLE_DRAFTS: ArticleDraft[] = [
  { id: 'draft-1', title: 'AI Agents That Write Code', status: 'draft', updatedAt: '2026-06-05' },
  { id: 'draft-2', title: '2026 SEO Patterns', status: 'review', updatedAt: '2026-06-04' },
  { id: 'draft-3', title: 'Vercel Deploy Checklist', status: 'scheduled', updatedAt: '2026-06-03' },
  { id: 'draft-4', title: 'Edge AI Workflows', status: 'draft', updatedAt: '2026-06-02' }
];

function cl(expected: ArticleDraft['status'], actual: ArticleDraft['status']) {
  return actual === expected ? `badge-accent` : '';
}

export default function WriterPage() {
  const [drafts, setDrafts] = useState<ArticleDraft[]>(SAMPLE_DRAFTS);
  const [draftTitle, setDraftTitle] = useState('');
  const [status, setStatus] = useState('');
  const [writing, setWriting] = useState(false);

  const persistState = (val: ArticleDraft[]) => {
    setDrafts(val);
    try { localStorage.setItem('blogforge.drafts', JSON.stringify(val)); } catch {}
  };

  const submitDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draftTitle.trim()) return;
    persistState([{ id: `draft-${Date.now()}`, title: draftTitle.trim(), status: 'draft', updatedAt: new Date().toISOString() }, ...drafts]);
    setDraftTitle('');
    setStatus('Draft queued');
    setTimeout(() => setStatus(''), 2000);
  };

  const queueRun = async () => {
    setWriting(true);
    setStatus('Writer running...');
    setTimeout(() => {
      persistState(drafts.map((item) => ({
        ...item,
        status: item.status === 'draft' ? 'review' : item.status === 'review' ? 'scheduled' : item.status,
        updatedAt: new Date().toISOString()
      })));
      setWriting(false);
      setStatus('Writer passed');
      setTimeout(() => setStatus(''), 2200);
    }, 1400);
  };

  const newFromIdea = () => {
    persistState([{ id: `draft-${Date.now()}`, title: `Untitled draft #${drafts.length + 1}`, status: 'draft', updatedAt: new Date().toISOString() }, ...drafts]);
    setStatus('Quick draft created');
    setTimeout(() => setStatus(''), 1800);
  };

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-h3 tracking-tight">Writer Agent</h2>
            <p className="text-sm" style={{ color: 'var(--ink-tertiary)' }}>Draft, review, and queue AI-authored posts.</p>
          </div>
          <span className="text-xs font-bold text-emerald-300">{status || 'Ready'}</span>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <form onSubmit={submitDraft} className="card space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold" style={{ color: 'var(--ink-muted)' }}>Draft title / topic</label>
              <input
                className="input mt-1"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="e.g., AI Trends July 2026"
                required
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full">
                <FileText size={14} /> Save draft
              </button>
            </div>
          </div>
        </form>
      </FadeUp>

      <FadeUp delay={0.08}>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-ghost" onClick={newFromIdea}>
            <Plus size={14} /> New from idea
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setDraftTitle('Autonomous content workflows')}>Sample idea</button>
          <button type="button" className="btn btn-ghost" disabled={writing} onClick={queueRun}>
            {writing ? <><Loader2 size={14} className="animate-spin" /> Running...</> : 'Run writer pass'}
          </button>
        </div>
      </FadeUp>

      <FadeUp delay={0.12}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-black/40">
                  <td className="text-sm font-bold">{item.title}</td>
                  <td><span className={`badge ${cl('draft', item.status) || cl('review', item.status) || cl('scheduled', item.status)}`}>{item.status}</span></td>
                  <td className="text-sm" style={{ color: 'var(--ink-muted)' }}>{item.updatedAt || '—'}</td>
                </tr>
              ))}
              {drafts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-sm" style={{ color: 'var(--ink-muted)' }}>No drafts.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </FadeUp>
    </div>
  );
}