import { BarChart3, PiggyBank, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Quick stat cards from monthly report scores
export function ReportStats({
  report,
}: {
  report: {
    overall_grade: string;
    budget_score: number;
    savings_score: number;
    trend_score: number;
  };
}) {
  const stats = [
    {
      label: 'Overall Grade',
      value: report.overall_grade,
      icon: Target,
      color: 'bg-lime/30 text-gray-900',
    },
    {
      label: 'Budget Score',
      value: `${report.budget_score}/100`,
      icon: BarChart3,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Savings Score',
      value: `${report.savings_score}/100`,
      icon: PiggyBank,
      color: 'bg-accent/10 text-accent',
    },
    {
      label: 'Trend Score',
      value: `${report.trend_score}/100`,
      icon: TrendingUp,
      color: 'bg-violet-500/10 text-violet-600',
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

function formatMonthLabel(month: string) {
  return new Date(`${month}-01`).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' });
}

export { formatMonthLabel };
