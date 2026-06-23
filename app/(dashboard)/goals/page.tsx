'use client';

import { Plus, Trophy } from 'lucide-react';
import { AddGoalModal } from '@/components/goals/AddGoalModal';
import { GoalCard } from '@/components/goals/GoalCard';
import { GoalStats } from '@/components/goals/GoalStats';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import { useGoals } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';

export default function GoalsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGoals();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <SkeletonCard className="h-16 w-full max-w-lg" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonCard key={i} className="h-56 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl bg-danger/10 p-6 text-center text-danger">
        Failed to load goals. Please try again.
      </div>
    );
  }

  const goals = data || [];
  const hasGoals = goals.length > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('goals.title')}</h1>
          <p className="mt-1 text-sm text-muted">{t('goals.subtitle')}</p>
        </div>
        {hasGoals && (
          <AddGoalModal
            trigger={
              <Button className="gap-2">
                <Plus size={16} /> Add Goal
              </Button>
            }
          />
        )}
      </div>

      {hasGoals && <GoalStats goals={goals} />}

      {!hasGoals ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-card">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime/30">
            <Trophy size={32} className="text-gray-800" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No goals yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Set a savings goal for something you want — a trip, emergency fund, or new gadget — and
            track your progress over time.
          </p>
          <div className="mt-6">
            <AddGoalModal
              trigger={
                <Button className="gap-2 rounded-xl px-6">
                  <Plus size={16} /> Create Your First Goal
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Your Goals</h2>
            <p className="text-xs text-muted">
              {goals.length} active goal{goals.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {goals.map(
              (goal: {
                id: number;
                title: string;
                target_amount: number;
                saved_amount: number;
                deadline: string;
                progress: number;
                days_left: number;
              }) => (
                <GoalCard key={goal.id} goal={goal} />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
