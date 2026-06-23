'use client';

import { useLimitsMine } from '@/lib/hooks';
import { formatPKR, getCategoryEmoji } from '@/lib/utils';

// Show warning when any spending limit is near or exceeded
export function LimitWarningBanner() {
  const { data } = useLimitsMine();
  const warnings = (data || []).filter((limit: { spent: number; monthly_limit: number }) => {
    const pct = (limit.spent / Number(limit.monthly_limit)) * 100;
    return pct >= 80;
  });

  if (!warnings.length) return null;

  return (
    <div className="mb-4 space-y-2">
      {warnings.map((limit: { id: number; category: string; spent: number; monthly_limit: number }) => (
        <div key={limit.id} className="rounded-3xl border border-danger/20 bg-red-50 px-4 py-3 text-sm text-danger shadow-card">
          ⚠️ Your {getCategoryEmoji(limit.category)} {limit.category} limit is{' '}
          {Math.round((limit.spent / Number(limit.monthly_limit)) * 100)}% reached (
          {formatPKR(limit.spent)} of {formatPKR(Number(limit.monthly_limit))})
        </div>
      ))}
    </div>
  );
}
