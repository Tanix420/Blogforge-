'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

function isAuthorized(): boolean {
 try {
  return document.cookie.split('; ').some(c => c.startsWith('blogforge_admin='));
 } catch { return false; }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 const router = useRouter();
 const pathname = usePathname();
 const [authorized, setAuthorized] = useState(() => isAuthorized());
 const [checking, setChecking] = useState(true);

 // Never block the login page itself
 const isLoginPage = pathname === '/admin/login';

 useEffect(() => {
  if (isLoginPage) {
   setChecking(false);
   return;
  }
  if (isAuthorized()) {
   setAuthorized(true);
   setChecking(false);
  } else {
   router.replace('/admin/login');
  }
 }, [router, isLoginPage]);

 if (isLoginPage) return <>{children}</>;
 if (checking) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0b0f', color: '#6a7388', fontSize: 14 }}>Loading…</div>;
 if (!authorized) return null;

 return <>{children}</>;
}
