'use client';

import { cn } from '@/lib/utils';

function SkeletonBase({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-theme-input', className)}
      style={style}
    />
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <SkeletonBase className="aspect-video w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <SkeletonBase className="h-5 w-16 rounded-full" />
          <SkeletonBase className="h-3 w-20" />
        </div>
        <SkeletonBase className="h-5 w-full" />
        <SkeletonBase className="h-4 w-4/5" />
        <SkeletonBase className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-6 space-y-3">
      <SkeletonBase className="h-4 w-20" />
      <SkeletonBase className="h-8 w-16" />
    </div>
  );
}

export function RowSkeleton({ lines = 1 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase key={i} className="h-4 w-full" style={{ width: i === lines - 1 ? '70%' : '100%' }} />
      ))}
    </div>
  );
}

export { SkeletonBase as Skeleton };
