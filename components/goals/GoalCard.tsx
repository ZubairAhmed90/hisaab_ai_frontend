'use client';

import { Calendar, Plus, Trash2, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { UpdateGoalModal } from '@/components/goals/UpdateGoalModal';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDeleteGoal } from '@/lib/hooks';
import { cn, formatDate, formatPKR } from '@/lib/utils';

function getStatus(progress: number, daysLeft: number) {
  if (progress >= 100) return { label: 'Completed!', className: 'bg-success/10 text-success' };
  if (daysLeft < 0) return { label: 'Overdue', className: 'bg-danger/10 text-danger' };
  if (daysLeft <= 7) return { label: `${daysLeft}d left`, className: 'bg-warning/10 text-warning' };
  return { label: `${daysLeft}d left`, className: 'bg-primary/10 text-primary' };
}

function getGradient(progress: number) {
  if (progress >= 100) return 'from-success/20 to-success/5 border-success/20';
  if (progress >= 70) return 'from-lime/30 to-lime/5 border-lime/30';
  if (progress >= 40) return 'from-primary/15 to-primary/5 border-primary/20';
  return 'from-amber-500/15 to-amber-500/5 border-amber-500/20';
}

// Goal card with progress, deadline, and actions
export function GoalCard({
  goal,
}: {
  goal: {
    id: number;
    title: string;
    target_amount: number;
    saved_amount: number;
    deadline: string;
    progress: number;
    days_left: number;
  };
}) {
  const deleteGoal = useDeleteGoal();
  const status = getStatus(goal.progress, goal.days_left);
  const remaining = Math.max(Number(goal.target_amount) - Number(goal.saved_amount), 0);
  const gradient = getGradient(goal.progress);

  const handleDelete = () => {
    if (!confirm('Delete this goal?')) return;
    deleteGoal.mutate(goal.id, {
      onSuccess: () => toast.success('Goal deleted'),
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
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 shadow-sm">
            <Trophy size={22} className={goal.progress >= 100 ? 'text-success' : 'text-primary'} />
          </span>
          <div>
            <p className="font-semibold text-gray-900">{goal.title}</p>
            <span className={cn('mt-1 inline-block rounded-lg px-2 py-0.5 text-xs font-medium', status.className)}>
              {status.label}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="bg-white/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          onClick={handleDelete}
        >
          <Trash2 size={14} className="text-danger" />
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        <Calendar size={14} />
        <span>Due {formatDate(goal.deadline)}</span>
      </div>

      <div className="mt-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted">Saved</p>
            <p className="font-number text-xl font-bold text-gray-900">
              {formatPKR(Number(goal.saved_amount))}
            </p>
          </div>
          <div className="text-right">
            <p className="font-number text-2xl font-bold text-primary">{goal.progress}%</p>
            <p className="text-xs text-muted">of {formatPKR(Number(goal.target_amount))}</p>
          </div>
        </div>

        <Progress
          value={Math.min(goal.progress, 100)}
          className={cn(
            'mt-3 h-2.5 bg-white/60',
            goal.progress >= 100
              ? '[&>div]:bg-success'
              : goal.days_left < 0
                ? '[&>div]:bg-danger'
                : goal.progress >= 70
                  ? '[&>div]:bg-success'
                  : '[&>div]:bg-primary',
          )}
        />

        <p className="mt-2 text-xs text-muted">
          {goal.progress >= 100 ? (
            <span className="font-semibold text-success">Goal reached!</span>
          ) : (
            <>
              <span className="font-semibold text-gray-700">{formatPKR(remaining)}</span> left to save
            </>
          )}
        </p>
      </div>

      <div className="mt-4">
        <UpdateGoalModal
          goal={goal}
          trigger={
            <Button variant="soft" size="sm" className="w-full gap-1.5 bg-white/70">
              <Plus size={14} /> Update Progress
            </Button>
          }
        />
      </div>
    </div>
  );
}
