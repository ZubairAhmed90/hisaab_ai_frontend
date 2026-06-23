'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPKR } from '@/lib/utils';

// Bar chart of daily spending for the current week
export function WeeklyChart({
  data,
}: {
  data: { day: string; amount: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatPKR(Number(value))} />
            <Bar dataKey="amount" fill="#185FA5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
