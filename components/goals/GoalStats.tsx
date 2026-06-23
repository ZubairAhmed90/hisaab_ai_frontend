import { CheckCircle2, PiggyBank, Target, Trophy } from 'lucide-react';
import { cn, formatPKR } from '@/lib/utils';

type Goal = {
  target_amount: number;
  saved_amount: number;
  progress: number;
};

// Summary stat cards for the goals page
export function GoalStats({ goals }: { goals: Goal[] }) {
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.saved_amount), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const completed = goals.filter((g) => g.progress >= 100).length;

  const stats = [
    {
      label: 'Active Goals',
      value: goals.length.toString(),
      icon: Target,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Total Saved',
      value: formatPKR(totalSaved),
      icon: PiggyBank,
      color: 'bg-lime/30 text-gray-800',
    },
    {
      label: 'Overall Progress',
      value: `${overallProgress}%`,
      icon: Trophy,
      color: 'bg-accent/10 text-accent',
    },
    {
      label: 'Completed',
      value: completed.toString(),
      icon: CheckCircle2,
      color: completed > 0 ? 'bg-success/10 text-success' : 'bg-gray-500/10 text-gray-600',
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
