'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useBudgets } from '@/lib/hooks';
import { cn, formatPKR, getCategoryEmoji } from '@/lib/utils';

const CATEGORY_STYLE: Record<string, { gradient: string; bar: string }> = {
  food: {
    gradient: 'from-orange-500/20 via-orange-500/8 to-card border-orange-500/25',
    bar: '[&>div]:bg-orange-500',
  },
  transport: {
    gradient: 'from-blue-500/20 via-blue-500/8 to-card border-blue-500/25',
    bar: '[&>div]:bg-blue-500',
  },
  shopping: {
    gradient: 'from-pink-500/20 via-pink-500/8 to-card border-pink-500/25',
    bar: '[&>div]:bg-pink-500',
  },
  utilities: {
    gradient: 'from-violet-500/20 via-violet-500/8 to-card border-violet-500/25',
    bar: '[&>div]:bg-violet-500',
  },
  entertainment: {
    gradient: 'from-amber-500/20 via-amber-500/8 to-card border-amber-500/25',
    bar: '[&>div]:bg-amber-500',
  },
  health: {
    gradient: 'from-emerald-500/20 via-emerald-500/8 to-card border-emerald-500/25',
    bar: '[&>div]:bg-emerald-500',
  },
  other: {
    gradient: 'from-gray-500/15 via-gray-500/5 to-card border-gray-500/20',
    bar: '[&>div]:bg-gray-500',
  },
};

function getBudgetPct(spent: number, limit?: number) {
  if (!limit || limit <= 0) return null;
  return Math.min(Math.round((spent / limit) * 100), 999);
}

// Top spending categories with budget progress when available
export function CurrencyMiniCards({
  summary,
}: {
  summary: { category: string; total: number }[];
}) {
  const { data: budgets } = useBudgets();
  const budgetMap = Object.fromEntries(
    (budgets || []).map((b: { category: string; monthly_limit: number }) => [
      b.category,
      Number(b.monthly_limit),
    ]),
  );

  const top = summary
    .filter((item) => item.category !== 'income' && item.category !== 'transfer')
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  if (top.length === 0) return null;

  return (
    <div className="col-span-12">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Top spending</h3>
          <p className="text-xs text-muted">This month by category</p>
        </div>
        <Link
          href="/budgets"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Manage budgets <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {top.map((item) => {
          const spent = Number(item.total);
          const limit = budgetMap[item.category];
          const budgetPct = getBudgetPct(spent, limit);
          const style = CATEGORY_STYLE[item.category] || CATEGORY_STYLE.other;
          const overBudget = budgetPct !== null && budgetPct > 100;

          return (
            <div
              key={item.category}
              className={cn(
                'rounded-2xl border bg-gradient-to-br p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
                style.gradient,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/90 text-2xl shadow-sm">
                    {getCategoryEmoji(item.category)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold capitalize text-gray-900">{item.category}</p>
                    <p className="font-number text-xl font-bold tracking-tight text-gray-900">
                      {formatPKR(spent)}
                    </p>
                  </div>
                </div>
                {budgetPct !== null ? (
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-1 text-xs font-bold',
                      overBudget ? 'bg-danger/15 text-danger' : 'bg-white/80 text-gray-700',
                    )}
                  >
                    {budgetPct}%
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-xs font-medium text-muted">
                    <TrendingUp size={12} /> Spent
                  </span>
                )}
              </div>

              {limit ? (
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-xs text-muted">
                    <span>Budget {formatPKR(limit)}</span>
                    <span className={overBudget ? 'font-medium text-danger' : ''}>
                      {overBudget ? 'Over limit' : `${formatPKR(Math.max(limit - spent, 0))} left`}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(budgetPct ?? 0, 100)}
                    className={cn('h-2 bg-white/60', style.bar, overBudget && '[&>div]:bg-danger')}
                  />
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-white/50 px-3 py-2 text-xs text-muted">
                  No budget set ·{' '}
                  <Link href="/budgets" className="font-medium text-primary hover:underline">
                    Add one
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
