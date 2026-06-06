'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
   const res = await fetch('/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
    credentials: 'include',
   });
   const data = await res.json().catch(() => ({}));
   if (res.ok) {
    window.location.href = '/admin';
   } else {
    setError(data?.error || 'Access denied');
   }
  } catch {
   setError('Login failed');
  }
  setLoading(false);
 };

 return (
  <div
   className="min-h-screen flex items-center justify-center px-4"
   style={{
    background:
     'radial-gradient(circle at 25% 20%, rgba(99,102,241,0.16), transparent 40%), var(--bg-page)',
   }}
  >
   <form onSubmit={submit} className="card p-8 w-full max-w-sm space-y-5">
    <div className="text-center">
     <div
      className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
      style={{
       background: 'linear-gradient(135deg, var(--accent), var(--accent-muted))',
       boxShadow: 'var(--shadow-lg)',
      }}
     >
      <Shield className="text-white" size={20} />
     </div>
     <h1 className="text-xl font-bold" style={{ color: 'var(--ink-primary)' }}>
      BlogForge Admin
     </h1>
     <p className="text-sm mt-1" style={{ color: 'var(--ink-tertiary)' }}>
      Sign in to manage your pipeline
     </p>
    </div>

    {error && (
     <div
      className="text-sm text-center py-2 rounded-lg"
      style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}
     >
      {error}
     </div>
    )}

    <input
     type="password"
     value={password}
     onChange={(e) => setPassword(e.target.value)}
     placeholder="Admin password"
     className="input"
     autoFocus
    />

    <button type="submit" disabled={loading} className="btn btn-primary w-full">
     {loading ? 'Signing in…' : 'Sign In'}
    </button>

    <p className="text-xs text-center" style={{ color: 'var(--ink-muted)' }}>
     <Link href="/" className="inline-flex items-center gap-1 hover:text-[var(--accent-strong)]">
      <ArrowLeft size={12} /> Back
     </Link>
    </p>
   </form>
  </div>
 );
}
