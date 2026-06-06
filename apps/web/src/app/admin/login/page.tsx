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
   if (res.ok && data.authenticated) {
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
  <div className="login-shell">
   <form onSubmit={submit} className="login-card">
    <div style={{ textAlign: 'center' }}>
     <div style={{
      width: 48, height: 48,
      borderRadius: 14,
      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
     }}>
      <Shield size={22} color="#fff" />
     </div>
     <h1 className="login-title">BlogForge Admin</h1>
     <p className="login-subtitle">Sign in to manage your pipeline</p>
    </div>

    {error && <p className="login-error">{error}</p>}

    <div>
     <label className="login-field-label">Password</label>
     <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter admin password"
      className="login-input"
      autoFocus
     />
    </div>

    <button type="submit" disabled={loading} className="login-submit">
     {loading ? 'Signing in…' : 'Sign In'}
    </button>

    <Link href="/" className="login-back">
     <ArrowLeft size={12} /> Back to home
    </Link>
   </form>
  </div>
 );
}
