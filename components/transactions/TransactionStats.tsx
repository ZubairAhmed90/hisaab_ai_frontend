'use client';

import { ArrowDownLeft, ArrowUpRight, Receipt } from 'lucide-react';
import { cn, formatPKR } from '@/lib/utils';

// Summary stat cards for the transactions page header
export function TransactionStats({
  total,
  income,
  expenses,
}: {
  total: number;
  income: number;
  expenses: number;
}) {
  const stats = [
    {
      label: 'Total Records',
      value: total.toString(),
      icon: Receipt,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Income',
      value: formatPKR(income),
      icon: ArrowDownLeft,
      color: 'bg-success/10 text-success',
    },
    {
      label: 'Expenses',
      value: formatPKR(expenses),
      icon: ArrowUpRight,
      color: 'bg-danger/10 text-danger',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-3xl bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
        >
          <div className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', color)}>
              <Icon size={18} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted">{label}</p>
              <p className="font-number mt-0.5 text-lg font-bold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
