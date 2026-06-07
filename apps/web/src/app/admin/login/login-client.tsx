'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginClient() {
 const router = useRouter();
 const [password, setPassword] = useState('');
 const [error, setError] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);

 async function onSubmit(e: React.FormEvent) {
 e.preventDefault();
 setLoading(true);
 setError(null);
 try {
 const res = await fetch('/api/admin/auth', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ password }),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'Invalid credentials');
 router.push('/admin');
 router.refresh();
 } catch (err) {
 setError(err instanceof Error ? err.message : 'Failed to sign in');
 } finally {
 setLoading(false);
 }
 }

 return (
 <div className="auth-shell">
 <div className="auth-card">
 <h1 className="auth-title">BlogForge Admin</h1>
 <p className="auth-subtitle">Enter your password to access the dashboard.</p>
 <form onSubmit={onSubmit}>
 {error && <div className="auth-error">{error}</div>}
 <label className="auth-label" htmlFor="password">Password</label>
 <input
 id="password"
 type="password"
 className="auth-input"
 placeholder="Enter admin password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 autoFocus
 />
 <button className="auth-submit" type="submit" disabled={loading}>
 {loading ? 'Signing in…' : 'Sign in'}
 </button>
 </form>
 <p className="auth-back">
 <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>← Back to blog</a>
 </p>
 </div>
 </div>
 );
}
