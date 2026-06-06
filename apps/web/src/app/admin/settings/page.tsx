'use client';

import { useState } from 'react';
import { Save, Bot, Globe, Clock, Tag, Palette } from 'lucide-react';
import { FadeUp } from '@/components/motion/motion';

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    blogTitle: 'My AI Blog',
    blogDescription: 'Autonomous AI-powered content',
    niche: 'Technology',
    provider: 'openrouter',
    model: 'google/gemini-2.5-pro-preview',
    apiKey: '',
    schedule: '0 9 * * *',
    theme: 'dark-prestige',
    publishMode: 'auto',
    affiliateEnabled: true,
    affiliateProgram: 'amazon',
    affiliateId: '',
    maxArticlesPerWeek: '5',
  });

  const save = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
        credentials: 'include',
      });
    } catch {
      // handled
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <FadeUp>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>Settings</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-tertiary)' }}>
              Blog identity, provider, schedule, theme, and affiliate configuration.
            </p>
          </div>
          <button onClick={save} disabled={saving} className="btn btn-primary">
            <Save size={16} /> {saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </FadeUp>

      <div className="grid md:grid-cols-2 gap-6">
        <FadeUp delay={0.05} className="card p-6 space-y-5">
          <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--ink-primary)' }}>
            <Globe size={16} style={{ color: 'var(--accent-strong)' }} /> Blog Identity
          </h2>
          <Field label="Blog Title" value={config.blogTitle} onChange={(v) => setConfig({ ...config, blogTitle: v })} />
          <Field label="Description" value={config.blogDescription} onChange={(v) => setConfig({ ...config, blogDescription: v })} />
          <Field label="Niche" value={config.niche} onChange={(v) => setConfig({ ...config, niche: v })} placeholder="e.g. SaaS, AI, Fitness" />
        </FadeUp>

        <FadeUp delay={0.1} className="card p-6 space-y-5">
          <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--ink-primary)' }}>
            <Bot size={16} style={{ color: 'var(--accent-strong)' }} /> AI Provider &amp; Model
          </h2>
          <SelectField
            label="Provider"
            value={config.provider}
            onChange={(v) => setConfig({ ...config, provider: v })}
            options={[
              { value: 'openrouter', label: 'OpenRouter (recommended)' },
              { value: 'openai', label: 'OpenAI' },
              { value: 'anthropic', label: 'Anthropic' },
              { value: 'groq', label: 'Groq (fast)' },
              { value: 'google', label: 'Google AI' },
            ]}
          />
          <Field label="Model" value={config.model} onChange={(v) => setConfig({ ...config, model: v })} />
          <Field label="API Key" value={config.apiKey} onChange={(v) => setConfig({ ...config, apiKey: v })} placeholder="sk-..." type="password" />
        </FadeUp>

        <FadeUp delay={0.15} className="card p-6 space-y-5">
          <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--ink-primary)' }}>
            <Clock size={16} style={{ color: 'var(--accent-strong)' }} /> Schedule
          </h2>
          <SelectField
            label="Cron schedule"
            value={config.schedule}
            onChange={(v) => setConfig({ ...config, schedule: v })}
            options={[
              { value: '0 * * * *', label: 'Every hour' },
              { value: '0 9 * * *', label: 'Daily at 9 AM' },
              { value: '0 9,15 * * *', label: 'Twice daily (9am, 3pm)' },
              { value: '0 9 * * 1', label: 'Weekly (Monday 9am)' },
            ]}
          />
          <Field label="Articles per week" value={config.maxArticlesPerWeek as string} onChange={(v) => setConfig({ ...config, maxArticlesPerWeek: v })} type="number" />
        </FadeUp>

        <FadeUp delay={0.2} className="card p-6 space-y-5">
          <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--ink-primary)' }}>
            <Palette size={16} style={{ color: 'var(--accent-strong)' }} /> Theme
          </h2>
          <SelectField
            label="Theme"
            value={config.theme}
            onChange={(v) => setConfig({ ...config, theme: v })}
            options={[
              { value: 'dark-prestige', label: 'Dark Prestige' },
              { value: 'neon-glass', label: 'Neon Glass' },
              { value: 'brutalism', label: 'Brutalist' },
              { value: 'editorial', label: 'Editorial' },
              { value: 'polar', label: 'Polar Light' },
            ]}
          />
        </FadeUp>

        <FadeUp delay={0.25} className="md:col-span-2 card p-6 space-y-5">
          <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--ink-primary)' }}>
            <Tag size={16} style={{ color: 'var(--accent-strong)' }} /> Affiliate Program
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={config.affiliateEnabled}
                onChange={(e) => setConfig({ ...config, affiliateEnabled: e.target.checked })}
              />
              Enable affiliate links
            </label>
            <SelectField
              label="Program"
              value={config.affiliateProgram}
              onChange={(v) => setConfig({ ...config, affiliateProgram: v })}
              options={[
                { value: 'amazon', label: 'Amazon Associates' },
                { value: 'shareasale', label: 'ShareASale' },
                { value: 'impact', label: 'Impact' },
                { value: 'custom', label: 'Custom links' },
              ]}
            />
            <Field label="Affiliate ID" value={config.affiliateId} onChange={(v) => setConfig({ ...config, affiliateId: v })} placeholder="your-affiliate-id" />
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={0.3}>
        <div
          className="text-xs p-4 rounded-xl border border-dashed"
          style={{ color: 'var(--ink-tertiary)', borderColor: 'var(--border-default)' }}
        >
          💡 Pro tip: A 3000-word article via OpenRouter costs ~$0.05–0.20 depending on model. Set an API budget and review quality thresholds.
        </div>
      </FadeUp>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--ink-muted)' }}>
        {label}
      </span>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--ink-muted)' }}>
        {label}
      </span>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
