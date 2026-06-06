'use client';

export function Avatar({ src, alt, initials, className }: { src?: string; alt?: string; initials?: string; className?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? ''}
        className={['rounded-full object-cover', className].filter(Boolean).join(' ')}
        style={{ width: 32, height: 32, background: 'var(--bg-input)' }}
      />
    );
  }
  return (
    <div
      className={['inline-flex items-center justify-center rounded-full font-black', className].filter(Boolean).join(' ')}
      style={{ width: 32, height: 32, background: 'var(--accent-subtle)', color: 'var(--accent-strong)', fontSize: 12 }}
    >
      {initials ?? '?'}
    </div>
  );
}
