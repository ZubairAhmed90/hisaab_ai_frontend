'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { EditBudgetModal } from '@/components/budgets/EditBudgetModal';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDeleteBudget } from '@/lib/hooks';
import { cn, formatPKR, getCategoryEmoji } from '@/lib/utils';

const CATEGORY_GRADIENTS: Record<string, string> = {
  food: 'from-orange-500/15 to-orange-500/5 border-orange-500/20',
  transport: 'from-blue-500/15 to-blue-500/5 border-blue-500/20',
  shopping: 'from-pink-500/15 to-pink-500/5 border-pink-500/20',
  utilities: 'from-violet-500/15 to-violet-500/5 border-violet-500/20',
  health: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/20',
  entertainment: 'from-amber-500/15 to-amber-500/5 border-amber-500/20',
  education: 'from-cyan-500/15 to-cyan-500/5 border-cyan-500/20',
  other: 'from-gray-500/15 to-gray-500/5 border-gray-500/20',
};

function getStatus(pct: number) {
  if (pct > 100) return { label: 'Over budget', className: 'bg-danger/10 text-danger' };
  if (pct >= 80) return { label: 'Almost there', className: 'bg-warning/10 text-warning' };
  return { label: 'On track', className: 'bg-success/10 text-success' };
}

// Single budget category card with progress and actions
export function BudgetCard({
  budget,
}: {
  budget: { id: number; category: string; monthly_limit: number; spent: number };
}) {
  const deleteBudget = useDeleteBudget();
  const limit = Number(budget.monthly_limit);
  const spent = Number(budget.spent);
  const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const remaining = Math.max(limit - spent, 0);
  const status = getStatus(pct);
  const gradient = CATEGORY_GRADIENTS[budget.category] || CATEGORY_GRADIENTS.other;

  const handleDelete = () => {
    if (!confirm('Delete this budget?')) return;
    deleteBudget.mutate(budget.id, {
      onSuccess: () => toast.success('Budget deleted'),
      onError: () => toast.error('Something went wrong'),
    });
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
        gradient,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-xl shadow-sm">
            {getCategoryEmoji(budget.category)}
          </span>
          <div>
            <p className="font-semibold capitalize text-gray-900">{budget.category}</p>
            <span className={cn('mt-1 inline-block rounded-lg px-2 py-0.5 text-xs font-medium', status.className)}>
              {status.label}
            </span>
          </div>
        </div>
        <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <EditBudgetModal
            budget={budget}
            trigger={
              <Button variant="ghost" size="icon-sm" className="bg-white/60">
                <Pencil size={14} />
              </Button>
            }
          />
          <Button variant="ghost" size="icon-sm" className="bg-white/60" onClick={handleDelete}>
            <Trash2 size={14} className="text-danger" />
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted">Spent</p>
            <p className="font-number text-lg font-bold text-gray-900">{formatPKR(spent)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Limit</p>
            <p className="font-number text-sm font-semibold text-gray-700">{formatPKR(limit)}</p>
          </div>
        </div>

        <Progress
          value={Math.min(pct, 100)}
          className={cn(
            'mt-3 h-2.5 bg-white/60',
            pct > 100 ? '[&>div]:bg-danger' : pct >= 80 ? '[&>div]:bg-warning' : '[&>div]:bg-success',
          )}
        />

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-medium text-muted">{pct}% used</span>
          <span className={cn('font-semibold', remaining > 0 ? 'text-success' : 'text-danger')}>
            {remaining > 0 ? `${formatPKR(remaining)} left` : `${formatPKR(spent - limit)} over`}
          </span>
        </div>
      </div>
    </div>
  );
}
