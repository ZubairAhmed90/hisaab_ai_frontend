import { Ban, Lock, LucideIcon, Shield, ShieldAlert, User } from 'lucide-react';
import { cn, formatPKR } from '@/lib/utils';

type SetLimit = {
  monthly_limit: number;
  target_user_id: number;
  owner_id: number;
  is_hard_limit: boolean;
};

type MineLimit = {
  monthly_limit: number;
  spent: number;
  is_hard_limit: boolean;
};

// Summary stats for limits page tabs
export function LimitStats({
  tab,
  setLimits,
  mineLimits,
  userId,
}: {
  tab: 'set' | 'mine';
  setLimits: SetLimit[];
  mineLimits: MineLimit[];
  userId?: number;
}) {
  if (tab === 'set') {
    const hardCount = setLimits.filter((l) => l.is_hard_limit).length;
    const forPartner = setLimits.filter((l) => userId && l.target_user_id !== userId).length;
    const forSelf = setLimits.length - forPartner;

    const stats = [
      { label: 'Total Limits', value: setLimits.length.toString(), icon: Shield, color: 'bg-primary/10 text-primary' },
      { label: 'For Myself', value: forSelf.toString(), icon: User, color: 'bg-accent/10 text-accent' },
      { label: 'For Partner', value: forPartner.toString(), icon: User, color: 'bg-violet-500/10 text-violet-600' },
      { label: 'Hard Limits', value: hardCount.toString(), icon: Lock, color: 'bg-danger/10 text-danger' },
    ];

    return <StatsGrid stats={stats} />;
  }

  const totalCap = mineLimits.reduce((s, l) => s + Number(l.monthly_limit), 0);
  const totalSpent = mineLimits.reduce((s, l) => s + Number(l.spent), 0);
  const exceeded = mineLimits.filter((l) => l.spent > Number(l.monthly_limit)).length;

  const stats = [
    { label: 'Active Limits', value: mineLimits.length.toString(), icon: ShieldAlert, color: 'bg-primary/10 text-primary' },
    { label: 'Total Cap', value: formatPKR(totalCap), icon: Lock, color: 'bg-lime/30 text-gray-800' },
    { label: 'Total Spent', value: formatPKR(totalSpent), icon: Shield, color: 'bg-accent/10 text-accent' },
    {
      label: 'Exceeded',
      value: exceeded.toString(),
      icon: Ban,
      color: exceeded > 0 ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success',
    },
  ];

  return <StatsGrid stats={stats} />;
}

function StatsGrid({
  stats,
}: {
  stats: { label: string; value: string; icon: LucideIcon; color: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-3xl bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
        >
          <div className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', color)}>
              <Icon size={18} strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-muted">{label}</p>
              <p className="font-number mt-0.5 truncate text-lg font-bold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
