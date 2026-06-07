'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 const router = useRouter();
 const pathname = usePathname();
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 let cancelled = false;
 async function check() {
 try {
 const res = await fetch('/api/admin/check', { cache: 'no-store' });
 const data = await res.json();
 if (!data.authenticated && !pathname.startsWith('/admin/login')) {
 if (!cancelled) {
 router.replace('/admin/login');
 }
 }
 } catch {
 if (!cancelled && !pathname.startsWith('/admin/login')) {
 router.replace('/admin/login');
 }
 } finally {
 if (!cancelled) setLoading(false);
 }
 }
 check();
 return () => { cancelled = true; };
 }, [router, pathname]);

 if (loading) {
 return (
 <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--page-bg)' }}>
 <div style={{ color: 'var(--ink-muted)', fontSize: 13 }}>Loading admin…</div>
 </div>
 );
 }

 return <>{children}</>;
}
