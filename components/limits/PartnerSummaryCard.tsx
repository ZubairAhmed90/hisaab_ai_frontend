'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePartnerSummary } from '@/lib/hooks';
import { cn, formatPKR, getCategoryEmoji } from '@/lib/utils';

// Partner spending summary on dashboard when accounts are linked
export function PartnerSummaryCard() {
  const { data } = usePartnerSummary();
  const limits = data?.limits_i_set ?? data?.categories ?? [];
  if (!data?.partner_name || limits.length === 0) return null;

  const top = limits.slice(0, 3);

  return (
    <Card className="border-primary/15 shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          {data.partner_name}&apos;s spending
        </CardTitle>
        <p className="text-xs text-muted">Shared limits this month</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {top.map((row: { category: string; spent: number; limit: number; exceeded?: boolean; pct?: number }) => {
          const pct = row.pct ?? (row.limit > 0 ? Math.round((row.spent / row.limit) * 100) : 0);
          const exceeded = row.exceeded ?? row.spent > row.limit;
          return (
            <div key={row.category}>
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize text-gray-900">
                  {getCategoryEmoji(row.category)} {row.category}
                </span>
                <span className={cn('font-number text-xs font-semibold', exceeded ? 'text-danger' : 'text-muted')}>
                  {formatPKR(row.spent)} / {formatPKR(row.limit)}
                </span>
              </div>
              <Progress
                value={Math.min(pct, 100)}
                className={cn('mt-1.5 h-1.5', exceeded ? '[&>div]:bg-danger' : '[&>div]:bg-success')}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
