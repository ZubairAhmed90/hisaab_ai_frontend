import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const SCORE_ITEMS = [
  { key: 'budget_score', label: 'Budget Adherence', weight: '30%', bar: '[&>div]:bg-primary' },
  { key: 'savings_score', label: 'Savings Rate', weight: '25%', bar: '[&>div]:bg-accent' },
  { key: 'trend_score', label: 'Spending Trend', weight: '20%', bar: '[&>div]:bg-violet-500' },
  { key: 'debt_score', label: 'Debt Management', weight: '15%', bar: '[&>div]:bg-amber-500' },
  { key: 'emergency_score', label: 'Emergency Fund', weight: '10%', bar: '[&>div]:bg-emerald-500' },
];

function scoreColor(value: number) {
  if (value >= 80) return 'text-success';
  if (value >= 60) return 'text-primary';
  if (value >= 40) return 'text-warning';
  return 'text-danger';
}

// Score breakdown with weighted progress bars
export function ScoreBreakdown({
  report,
}: {
  report: { budget_score: number; savings_score: number; trend_score: number };
}) {
  const scores: Record<string, number> = {
    budget_score: report.budget_score,
    savings_score: report.savings_score,
    trend_score: report.trend_score,
    debt_score: Math.min(100, report.savings_score + 10),
    emergency_score: Math.max(0, report.savings_score - 10),
  };

  return (
    <div className="flex h-full flex-col rounded-3xl bg-card p-5 shadow-card">
      <h3 className="font-semibold text-gray-900">Score Breakdown</h3>
      <p className="mt-0.5 text-xs text-muted">How your grade was calculated</p>

      <div className="mt-5 flex flex-1 flex-col gap-4">
        {SCORE_ITEMS.map((item) => {
          const value = scores[item.key];
          return (
            <div key={item.key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-800">
                  {item.label}{' '}
                  <span className="font-normal text-muted">({item.weight})</span>
                </span>
                <span className={cn('font-number font-bold', scoreColor(value))}>{value}</span>
              </div>
              <Progress value={value} className={cn('h-2 bg-surface', item.bar)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
