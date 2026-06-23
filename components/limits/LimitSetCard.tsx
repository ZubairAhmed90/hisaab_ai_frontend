'use client';

import { Lock, Shield, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useDeleteLimit } from '@/lib/hooks';
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

type Limit = {
  id: number;
  category: string;
  monthly_limit: number;
  alert_at_percent: number;
  is_hard_limit: boolean;
  target_user: { name: string; id: number };
  owner_id: number;
  target_user_id: number;
};

// Card for a limit set by the current user
export function LimitSetCard({ limit, currentUserId }: { limit: Limit; currentUserId?: number }) {
  const remove = useDeleteLimit();
  const isForPartner = currentUserId ? limit.target_user_id !== currentUserId : false;
  const gradient = CATEGORY_GRADIENTS[limit.category] || CATEGORY_GRADIENTS.other;

  const handleDelete = () => {
    if (!confirm('Delete this limit?')) return;
    remove.mutate(limit.id, {
      onSuccess: () => toast.success('Limit deleted'),
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
            {getCategoryEmoji(limit.category)}
          </span>
          <div>
            <p className="font-semibold capitalize text-gray-900">{limit.category}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium',
                  limit.is_hard_limit ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning',
                )}
              >
                {limit.is_hard_limit ? <Lock size={10} /> : <Shield size={10} />}
                {limit.is_hard_limit ? 'Hard limit' : 'Soft limit'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-white/60 px-2 py-0.5 text-xs font-medium text-muted">
                <User size={10} />
                {isForPartner ? limit.target_user.name : 'Myself'}
              </span>
            </div>
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

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-muted">Monthly cap</p>
          <p className="font-number text-xl font-bold text-gray-900">
            {formatPKR(Number(limit.monthly_limit))}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Alert at</p>
          <p className="font-number text-sm font-semibold text-gray-700">{limit.alert_at_percent}%</p>
        </div>
      </div>
    </div>
  );
}
