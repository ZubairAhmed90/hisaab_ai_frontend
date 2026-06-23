'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatPKR, getCategoryEmoji } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Progress bars showing spend vs budget limit per category
export function BudgetBars({
  budgets,
}: {
  budgets: { category: string; monthly_limit: number; spent: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Budget Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.length === 0 && (
          <p className="text-sm text-gray-500">No budgets set yet.</p>
        )}
        {budgets.map((budget) => {
          const limit = Number(budget.monthly_limit);
          const spent = Number(budget.spent);
          const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
          return (
            <div key={budget.category}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{getCategoryEmoji(budget.category)} {budget.category}</span>
                <span>{formatPKR(spent)} / {formatPKR(limit)} ({pct}%)</span>
              </div>
              <Progress
                value={Math.min(pct, 100)}
                className={cn('h-2', pct > 100 ? '[&>div]:bg-red-500' : pct >= 80 ? '[&>div]:bg-amber-500' : '[&>div]:bg-green-500')}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
