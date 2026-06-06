'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // Check for non-httpOnly auth flag cookie set by login page
    const hasAuth = document.cookie.split(';').some(c => c.trim().startsWith('blogforge_admin_flag='));
    setAuthed(hasAuth);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (pathname.startsWith('/admin/login')) return;
    if (!authed) router.replace('/admin/login');
  }, [ready, authed, pathname, router]);

  if (pathname.startsWith('/admin/login')) return <>{children}</>;
  if (!ready || !authed) return null;
  return <>{children}</>;
}
