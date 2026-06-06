'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function isAuthorized(): boolean {
 try {
  return document.cookie.split('; ').some(c => c.startsWith('blogforge_admin='));
 } catch { return false; }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 const router = useRouter();
 const [authorized, setAuthorized] = useState(false);
 const [checking, setChecking] = useState(true);

 useEffect(() => {
  const check = () => {
   if (isAuthorized()) {
    setAuthorized(true);
   } else {
    router.replace('/admin/login');
   }
   setChecking(false);
  };
  check();
 }, [router]);

 if (checking) {
  return (
   <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0b0f' }}>
    <div className="text-sm" style={{ color: '#6a7388' }}>Loading...</div>
   </div>
  );
 }

 if (!authorized) return null;

 return <>{children}</>;
}
