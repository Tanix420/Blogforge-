'use client';
import { useState, type ReactNode } from 'react';

export function Tabs({
  items,
  defaultTab,
  onChange,
  className,
}: {
  items: { id: string; label: string; content: ReactNode }[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}) {
  const [active, setActive] = useState(defaultTab || items[0]?.id);
  const current = items.find(i => i.id === active) ?? items[0];

  return (
    <div className={className}>
      <div
        className="flex items-center gap-1 p-1 rounded-xl"
        style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}
      >
        {items.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setActive(item.id);
              onChange?.(item.id);
            }}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: active === item.id ? 'var(--bg-panel)' : 'transparent',
              color: active === item.id ? 'var(--ink-primary)' : 'var(--ink-muted)',
              boxShadow: active === item.id ? 'var(--shadow-sm)' : 'none',
              border: active === item.id ? '1px solid var(--border-default)' : '1px solid transparent',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-5">{current?.content}</div>
    </div>
  );
}
