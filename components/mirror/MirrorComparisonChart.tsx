'use client';

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatPKR } from '@/lib/utils';

const BAR_COLORS = ['#185FA5', '#E8FF57', '#1D9E75', '#F59E0B', '#8B5CF6'];

// Bar chart comparing hypothetical returns across assets
export function MirrorComparisonChart({
  overspend,
  investments,
}: {
  overspend: number;
  investments: { asset: string; ticker: string; current_value: number; return_pct: number }[];
}) {
  const data = investments.map((item) => ({
    name: item.ticker,
    value: item.current_value,
    gain: item.current_value - overspend,
    return_pct: item.return_pct,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={36}>
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#8A94A6' }}
        />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: 'rgba(24, 95, 165, 0.06)', radius: 8 }}
          contentStyle={{
            background: '#1A1A2E',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
          }}
          formatter={(value, _name, props) => {
            const payload = props.payload as { return_pct: number; gain: number };
            return [
              `${formatPKR(Number(value))} (+${payload.return_pct.toFixed(1)}%)`,
              'Projected value',
            ];
          }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
