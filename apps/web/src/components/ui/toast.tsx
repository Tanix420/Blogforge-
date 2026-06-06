'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type Toast = {
  id: string;
  kind: 'success' | 'error' | 'info';
  title: string;
  message?: string;
};

const ToastContext = createContext<{
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
}>({ toasts: [], toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((s) => [...s, { ...t, id }]);
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id));
    }, 4500);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={cn(
                'rounded-xl border border-border-default p-4 shadow-lg backdrop-blur-xl',
                'bg-bg-elevated/90',
                t.kind === 'success' && 'border-[rgba(16,185,129,0.3)]',
                t.kind === 'error' && 'border-[rgba(239,68,68,0.3)]'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {t.kind === 'success' && <CheckCircle2 className="w-5 h-5 text-success" />}
                  {t.kind === 'error' && <AlertTriangle className="w-5 h-5 text-danger" />}
                  {t.kind === 'info' && <Info className="w-5 h-5 text-accent-strong" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-primary">{t.title}</p>
                  {t.message && <p className="text-xs mt-0.5 text-ink-tertiary">{t.message}</p>}
                </div>
                <button className="text-ink-muted hover:text-ink-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
