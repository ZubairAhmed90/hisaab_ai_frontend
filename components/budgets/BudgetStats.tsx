import { AlertTriangle, PiggyBank, Target, Wallet } from 'lucide-react';
import { cn, formatPKR } from '@/lib/utils';

// Summary stat cards for the budgets page
export function BudgetStats({
  budgets,
}: {
  budgets: { monthly_limit: number; spent: number }[];
}) {
  const totalLimit = budgets.reduce((sum, b) => sum + Number(b.monthly_limit), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent), 0);
  const remaining = Math.max(totalLimit - totalSpent, 0);
  const overCount = budgets.filter(
    (b) => Number(b.spent) > Number(b.monthly_limit),
  ).length;

  const stats = [
    {
      label: 'Total Budget',
      value: formatPKR(totalLimit),
      icon: Wallet,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Total Spent',
      value: formatPKR(totalSpent),
      icon: Target,
      color: 'bg-accent/10 text-accent',
    },
    {
      label: 'Remaining',
      value: formatPKR(remaining),
      icon: PiggyBank,
      color: 'bg-lime/30 text-gray-800',
    },
    {
      label: 'Over Budget',
      value: overCount.toString(),
      icon: AlertTriangle,
      color: overCount > 0 ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success',
    },
  ];

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
