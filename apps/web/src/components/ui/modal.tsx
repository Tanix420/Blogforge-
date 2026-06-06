'use client';
import { useEffect, useRef } from 'react';

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={['surface w-full max-w-2xl max-h-[90vh] overflow-y-auto', className].filter(Boolean).join(' ')}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          {title && <h3 className="text-lg font-black tracking-tight" style={{ color: 'var(--ink-primary)' }}>{title}</h3>}
          <button
            type="button"
            ref={closeRef}
            onClick={onClose}
            className="btn btn-ghost ml-auto px-3 py-1.5 text-xs"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
