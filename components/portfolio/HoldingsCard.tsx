'use client';

import Link from 'next/link';
import { TrendingDown, TrendingUp } from 'lucide-react';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { usePortfolio } from '@/lib/hooks';
import { cn, formatPKR } from '@/lib/utils';

export function HoldingsCard() {
  const { data, isLoading, isError } = usePortfolio();

  if (isLoading) return <SkeletonCard className="h-64 w-full" />;
  if (isError || !data) return null;

  const { holdings, summary } = data;
  const top = holdings;

  return (
    <div className="rounded-3xl bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Your PSX Holdings</h2>
          <p className="text-xs text-muted">{summary.count} stocks · invested {formatPKR(summary.total_invested ?? summary.total_cost ?? 0)}</p>
        </div>
        <div className="text-right">
          <p className="font-number text-lg font-bold text-gray-900">
            {formatPKR(summary.total_value)}
          </p>
          <p
            className={cn(
              'flex items-center justify-end gap-0.5 text-xs font-semibold',
              summary.total_return_pct >= 0 ? 'text-success' : 'text-danger',
            )}
          >
            {summary.total_return_pct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {summary.total_return_pct >= 0 ? '+' : ''}
            {summary.total_return_pct}%
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {top.map((h: {
          ticker: string;
          display_name: string;
          quantity: number;
          current_value: number;
          return_pct: number;
        }) => (
          <div
            key={h.ticker}
            className="flex items-center justify-between rounded-xl bg-surface/60 px-3 py-2.5"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{h.ticker}</p>
              <p className="text-xs text-muted">{h.display_name} · {h.quantity} shares</p>
            </div>
            <div className="text-right">
              <p className="font-number text-sm font-bold text-gray-900">
                {formatPKR(h.current_value)}
              </p>
              <p
                className={cn(
                  'text-xs font-medium',
                  h.return_pct >= 0 ? 'text-success' : 'text-danger',
                )}
              >
                {h.return_pct >= 0 ? '+' : ''}{h.return_pct}%
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/invest"
        className="mt-4 block text-center text-sm font-semibold text-primary hover:underline"
      >
        Trade stocks →
      </Link>
    </div>
  );
}
