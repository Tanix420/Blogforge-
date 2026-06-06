'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'subtle';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const buttonVariants = ({
  variant = 'default',
  size = 'default',
}: {
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page disabled:pointer-events-none disabled:opacity-50';

  const variants: Record<string, string> = {
    default:
      'bg-gradient-to-r from-accent to-accent-muted text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98]',
    destructive:
      'bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    outline:
      'border border-border-default bg-transparent text-ink-primary hover:bg-bg-hover hover:border-border-strong',
    ghost:
      'bg-transparent text-ink-secondary hover:bg-bg-hover hover:text-ink-primary',
    subtle:
      'bg-accent-subtle text-accent-strong hover:bg-[rgba(99,102,241,0.22)]',
  };

  const sizes: Record<string, string> = {
    default: 'h-10 px-5 py-2',
    sm: 'h-9 rounded-lg px-3 text-xs',
    lg: 'h-11 rounded-2xl px-8 text-base',
    icon: 'h-10 w-10 rounded-xl',
  };

  return cn(base, variants[variant], sizes[size]);
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
