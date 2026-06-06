'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch('/api/admin/check', { cache: 'no-store', credentials: 'same-origin' });
        if (!cancelled) {
          setAuthed(res.ok);
          setReady(true);
        }
      } catch {
        if (!cancelled) setReady(true);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (pathname === '/admin/login') return;
    if (!authed) router.replace('/admin/login');
  }, [ready, authed, pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!ready) return null;
  if (!authed) return null;
  return <>{children}</>;
}
