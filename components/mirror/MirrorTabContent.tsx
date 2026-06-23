'use client';

import { BarChart3, PartyPopper, TrendingDown } from 'lucide-react';
import { InvestCalculator } from '@/components/mirror/InvestCalculator';
import { MirrorComparisonChart } from '@/components/mirror/MirrorComparisonChart';
import { MirrorGrid } from '@/components/mirror/MirrorGrid';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { useMirror } from '@/lib/hooks';
import { formatPKR } from '@/lib/utils';

const PERIOD_LABELS: Record<string, string> = {
  '1m': 'the last month',
  '3m': 'the last 3 months',
  '6m': 'the last 6 months',
  '12m': 'the last 12 months',
};

// Mirror content for a selected time period
export function MirrorTabContent({ period }: { period: '1m' | '3m' | '6m' | '12m' }) {
  const { data, isLoading, isError } = useMirror(period);

  if (isLoading) {
    return (
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SkeletonCard className="h-28 w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} className="h-36 w-full" />
            ))}
          </div>
        </div>
        <SkeletonCard className="h-80 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl bg-danger/10 p-8 text-center text-danger">
        Failed to load mirror data. Please try again later.
      </div>
    );
  }

  const inBudget = !data?.overspend || data.overspend <= 0;
  const investments = data?.investments || [];
  const bestReturn = investments.reduce(
    (best, item) => (item.return_pct > best.return_pct ? item : best),
    investments[0] || { return_pct: 0, current_value: 0, ticker: '' },
  );

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        {inBudget ? (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-accent/10 to-white p-8 shadow-card">
            <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-accent/10" />
            <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
              <div className="mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent/20 sm:mb-0 sm:mr-5">
                <PartyPopper size={32} className="text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">You stayed in budget!</h2>
                <p className="mt-2 max-w-md text-sm text-muted">
                  Great discipline {PERIOD_LABELS[period]}. Keep it up — or explore what investing
                  your savings could earn using the calculator.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-3xl bg-gradient-to-br from-danger/10 via-danger/5 to-white p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-danger/15">
                  <TrendingDown size={22} className="text-danger" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted">Total overspend {PERIOD_LABELS[period]}</p>
                  <p className="font-number mt-1 text-3xl font-bold text-danger">
                    {formatPKR(data!.overspend)}
                  </p>
                  {bestReturn && (
                    <p className="mt-2 text-sm text-gray-600">
                      If invested in <span className="font-semibold">{bestReturn.ticker}</span>, it
                      could be{' '}
                      <span className="font-semibold text-success">
                        {formatPKR(bestReturn.current_value)}
                      </span>{' '}
                      today (+{bestReturn.return_pct.toFixed(1)}%)
                    </p>
                  )}
                </div>
              </div>
            </div>

            <MirrorGrid overspend={data!.overspend} investments={investments} />

            {investments.length > 0 && (
              <div className="rounded-3xl bg-card p-5 shadow-card">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-primary" />
                  <h3 className="font-semibold text-gray-900">Return Comparison</h3>
                </div>
                <MirrorComparisonChart overspend={data!.overspend} investments={investments} />
              </div>
            )}
          </>
        )}
      </div>

      <div className="lg:col-span-1">
        <InvestCalculator key={period} defaultPeriod={period} />
      </div>
    </div>
  );
}
