'use client';

import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'card rounded-2xl border border-border-subtle bg-bg-elevated p-6',
          'shadow-sm backdrop-blur-xl',
          'transition-all duration-300',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export const CardMedia = ({
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-bg-input">
      <img
        className={cn(
          'h-full w-full object-cover',
          'transition-transform duration-500',
          'group-hover:scale-105',
          className
        )}
        {...props}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};
