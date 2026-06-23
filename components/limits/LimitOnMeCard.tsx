'use client';

import { Ban, ShieldAlert, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn, formatPKR, getCategoryEmoji } from '@/lib/utils';

const CATEGORY_GRADIENTS: Record<string, string> = {
  food: 'from-orange-500/15 to-orange-500/5 border-orange-500/20',
  transport: 'from-blue-500/15 to-blue-500/5 border-blue-500/20',
  shopping: 'from-pink-500/15 to-pink-500/5 border-pink-500/20',
  utilities: 'from-violet-500/15 to-violet-500/5 border-violet-500/20',
  health: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/20',
  entertainment: 'from-amber-500/15 to-amber-500/5 border-amber-500/20',
  other: 'from-gray-500/15 to-gray-500/5 border-gray-500/20',
};

function getStatus(pct: number, exceeded: boolean) {
  if (exceeded) return { label: 'Exceeded', className: 'bg-danger/10 text-danger' };
  if (pct >= 80) return { label: 'Almost there', className: 'bg-warning/10 text-warning' };
  return { label: 'Within limit', className: 'bg-success/10 text-success' };
}

// Card for a limit that applies to the current user
export function LimitOnMeCard({
  limit,
}: {
  limit: {
    id: number;
    category: string;
    monthly_limit: number;
    spent: number;
    owner_name: string;
    is_hard_limit: boolean;
  };
}) {
  const limitAmount = Number(limit.monthly_limit);
  const spent = Number(limit.spent);
  const pct = limitAmount > 0 ? Math.round((spent / limitAmount) * 100) : 0;
  const exceeded = spent > limitAmount;
  const remaining = Math.max(limitAmount - spent, 0);
  const status = getStatus(pct, exceeded);
  const gradient = CATEGORY_GRADIENTS[limit.category] || CATEGORY_GRADIENTS.other;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
        gradient,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-xl shadow-sm">
            {getCategoryEmoji(limit.category)}
          </span>
          <div>
            <p className="font-semibold capitalize text-gray-900">{limit.category}</p>
            <span className={cn('mt-1 inline-block rounded-lg px-2 py-0.5 text-xs font-medium', status.className)}>
              {status.label}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-lg bg-white/60 px-2 py-1 text-xs font-medium text-muted">
          <User size={10} /> {limit.owner_name}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted">Spent</p>
            <p className="font-number text-lg font-bold text-gray-900">{formatPKR(spent)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Limit</p>
            <p className="font-number text-sm font-semibold text-gray-700">{formatPKR(limitAmount)}</p>
          </div>
        </div>

        <Progress
          value={Math.min(pct, 100)}
          className={cn(
            'mt-3 h-2.5 bg-white/60',
            exceeded ? '[&>div]:bg-danger' : pct >= 80 ? '[&>div]:bg-warning' : '[&>div]:bg-success',
          )}
        />

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-medium text-muted">{pct}% used</span>
          <span className={cn('font-semibold', remaining > 0 ? 'text-success' : 'text-danger')}>
            {remaining > 0 ? `${formatPKR(remaining)} left` : `${formatPKR(spent - limitAmount)} over`}
          </span>
        </div>
      </div>

      {exceeded && limit.is_hard_limit && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-danger/15 px-3 py-2 text-xs font-medium text-danger">
          <Ban size={14} />
          Limit reached — transactions blocked in this category
        </div>
      )}

      {!exceeded && limit.is_hard_limit && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/50 px-3 py-2 text-xs text-muted">
          <ShieldAlert size={14} />
          Hard limit — spending will be blocked at cap
        </div>
      )}
    </div>
  );
}
