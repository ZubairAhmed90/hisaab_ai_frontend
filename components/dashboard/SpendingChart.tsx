'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { formatPKR } from '@/lib/utils';

type ChartPoint = { name: string; amount: number };

const PERIODS = [
  { value: 'weekly' as const, label: 'Weekly' },
  { value: 'monthly' as const, label: 'Monthly' },
  { value: 'yearly' as const, label: 'Yearly' },
];

// Dotted-style spending bar chart with period selector
export function SpendingChart({
  weekly,
  monthly,
  yearly,
}: {
  weekly: ChartPoint[];
  monthly: ChartPoint[];
  yearly: ChartPoint[];
}) {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  const data = useMemo(() => {
    const source = period === 'weekly' ? weekly : period === 'monthly' ? monthly : yearly;
    const max = Math.max(...source.map((d) => d.amount), 0);
    return source.map((d) => ({ ...d, isHighest: d.amount === max && max > 0 }));
  }, [period, weekly, monthly, yearly]);

  const total = useMemo(() => data.reduce((sum, d) => sum + d.amount, 0), [data]);
  const hasData = total > 0;

  return (
    <div className="mt-5 rounded-3xl bg-card p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">Spending Overview</h3>
          <p className="mt-0.5 text-sm text-muted">
            {hasData ? (
              <>
                Total: <span className="font-number font-semibold text-gray-800">{formatPKR(total)}</span>
              </>
            ) : (
              'No spending data yet'
            )}
          </p>
        </div>
        <div className="flex rounded-xl bg-surface p-1">
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                period === value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-muted hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barSize={period === 'yearly' ? 28 : 22}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8A94A6' }} />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'rgba(24, 95, 165, 0.06)', radius: 8 }}
              contentStyle={{ background: '#1A1A2E', border: 'none', borderRadius: '12px', color: 'white' }}
              formatter={(value) => [formatPKR(Number(value)), 'Spent']}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.isHighest ? '#E8FF57' : '#E2E8F0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
            <BarChart3 size={22} className="text-muted" />
          </div>
          <p className="text-sm font-medium text-gray-700">Chart will appear here</p>
          <p className="mt-1 text-xs text-muted">Add transactions to track your spending</p>
        </div>
      )}
    </div>
  );
}
