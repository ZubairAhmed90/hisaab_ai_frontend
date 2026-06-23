'use client';

import Link from 'next/link';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { usePortfolio } from '@/lib/hooks';
import { cn, formatPKR } from '@/lib/utils';

/** Dashboard investment summary — wallet + invested stocks with live up/down */
export function InvestmentPortfolioCard() {
  const { data, isLoading, isError } = usePortfolio();

  if (isLoading) return <SkeletonCard className="h-80 w-full" />;
  if (isError || !data) return null;

  const { holdings, summary, wallet_balance, account_balance, account_number } = data;
  const up = summary.total_return_pct >= 0;

  return (
    <div className="rounded-3xl bg-card p-6 shadow-card">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Stock Investment</p>
          <p className="font-number mt-1 text-3xl font-bold text-gray-900">
            {formatPKR(summary.total_value)}
          </p>
          <p className={cn('mt-1 flex items-center gap-1 text-sm font-semibold', up ? 'text-success' : 'text-danger')}>
            {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {up ? '+' : ''}{summary.total_return_pct}% overall
          </p>
        </div>
        <div className="rounded-2xl bg-lime/30 px-4 py-3 text-right">
          <p className="flex items-center justify-end gap-1 text-xs text-muted">
            <Wallet size={12} /> Wallet
          </p>
          <p className="font-number text-lg font-bold text-gray-900">{formatPKR(wallet_balance)}</p>
          <p className="mt-1 text-xs text-muted">Account {formatPKR(account_balance)}</p>
          <p className="font-mono text-[10px] text-muted">{account_number}</p>
        </div>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Your holdings ({summary.count})
      </p>
      {holdings.length === 0 ? (
        <p className="rounded-xl bg-surface/60 px-4 py-6 text-center text-sm text-muted">
          No stocks yet.{' '}
          <Link href="/invest" className="font-semibold text-primary hover:underline">
            Browse 20 PSX stocks →
          </Link>
        </p>
      ) : (
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {holdings.map((h: {
            ticker: string;
            display_name: string;
            quantity: number;
            current_value: number;
            return_pct: number;
            change_1d: number;
            price_pkr: number;
          }) => (
            <div
              key={h.ticker}
              className="flex items-center justify-between rounded-xl bg-surface/60 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{h.ticker}</p>
                <p className="text-xs text-muted">
                  {h.display_name} · {h.quantity} sh · Rs {h.price_pkr}
                </p>
              </div>
              <div className="text-right">
                <p className="font-number text-sm font-bold">{formatPKR(h.current_value)}</p>
                <p className={cn('text-xs font-medium', h.return_pct >= 0 ? 'text-success' : 'text-danger')}>
                  {h.return_pct >= 0 ? '+' : ''}{h.return_pct}%
                </p>
                <p className={cn('text-[10px]', (h.change_1d ?? 0) >= 0 ? 'text-success' : 'text-danger')}>
                  Today {(h.change_1d ?? 0) >= 0 ? '+' : ''}{h.change_1d ?? 0}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/invest"
        className="mt-4 block text-center text-sm font-semibold text-primary hover:underline"
      >
        Trade stocks — buy & sell →
      </Link>
    </div>
  );
}
