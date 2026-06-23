'use client';

import { ShieldOff } from 'lucide-react';
import { LimitOnMeCard } from '@/components/limits/LimitOnMeCard';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { useLimitsMine } from '@/lib/hooks';

// Limits that apply to the current user with spend progress
export function LimitsOnMe() {
  const { data, isLoading, isError } = useLimitsMine();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} className="h-52 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl bg-danger/10 p-6 text-center text-danger">
        Failed to load your limits. Please try again.
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-card">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface">
          <ShieldOff size={32} className="text-muted" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">No limits on you</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          You or your partner can set spending caps here. Switch to &quot;Limits I Set&quot; to create
          one.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Limits Applied to You</h2>
        <p className="text-xs text-muted">
          {data.length} active limit{data.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map(
          (limit: {
            id: number;
            category: string;
            monthly_limit: number;
            spent: number;
            owner_name: string;
            is_hard_limit: boolean;
          }) => (
            <LimitOnMeCard key={limit.id} limit={limit} />
          ),
        )}
      </div>
    </div>
  );
}
