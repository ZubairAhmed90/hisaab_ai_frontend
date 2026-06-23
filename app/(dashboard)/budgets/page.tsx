'use client';

import { Plus, Target } from 'lucide-react';
import { AddBudgetModal } from '@/components/budgets/AddBudgetModal';
import { BudgetCard } from '@/components/budgets/BudgetCard';
import { BudgetStats } from '@/components/budgets/BudgetStats';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import { useBudgets } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';

// Budget management page with stats, cards, and actions
export default function BudgetsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useBudgets();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <SkeletonCard className="h-16 w-full max-w-lg" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl bg-danger/10 p-6 text-center text-danger">
        Failed to load budgets. Please try again.
      </div>
    );
  }

  const budgets = data || [];
  const hasBudgets = budgets.length > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('budgets.title')}</h1>
          <p className="mt-1 text-sm text-muted">{t('budgets.subtitle')}</p>
        </div>
        {hasBudgets && (
          <AddBudgetModal
            trigger={
              <Button className="gap-2">
                <Plus size={16} /> Add Budget
              </Button>
            }
          />
        )}
      </div>

      {hasBudgets && <BudgetStats budgets={budgets} />}

      {!hasBudgets ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-card">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime/30">
            <Target size={32} className="text-gray-800" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No budgets yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Create category budgets to control spending. You&apos;ll get warnings when you&apos;re
            close to your limit.
          </p>
          <div className="mt-6">
            <AddBudgetModal
              trigger={
                <Button className="gap-2 rounded-xl px-6">
                  <Plus size={16} /> Create Your First Budget
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Your Categories</h2>
            <p className="text-xs text-muted">{budgets.length} active budget{budgets.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {budgets.map((budget: { id: number; category: string; monthly_limit: number; spent: number }) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
