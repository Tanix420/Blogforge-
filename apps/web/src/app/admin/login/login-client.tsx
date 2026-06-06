'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginClient() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Invalid password');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0b0f',
        fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: '32px 28px',
          boxShadow: 'rgba(0,0,0,0.3) 0 8px 32px',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 900,
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          BF
        </div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#f1f3f8',
            letterSpacing: '-0.02em',
            marginBottom: 6,
            marginTop: 0,
          }}
        >
          BlogForge Admin
        </h1>
        <p
          style={{
            fontSize: 13,
            color: '#6a7388',
            marginBottom: 24,
            marginTop: 0,
          }}
        >
          Enter your admin password to access the dashboard.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              color: '#f1f3f8',
              fontSize: 14,
              outline: 'none',
              marginBottom: 8,
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <div
              style={{
                color: '#f87171',
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: loading ? 'rgba(99,102,241,0.5)' : '#6366f1',
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Checking…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
