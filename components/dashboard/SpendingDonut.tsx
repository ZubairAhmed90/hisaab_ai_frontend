'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPKR, getCategoryColor, getCategoryEmoji } from '@/lib/utils';

// Donut chart showing spending breakdown by category
export function SpendingDonut({
  summary,
}: {
  summary: { category: string; total: number }[];
}) {
  const data = summary.filter((item) => item.category !== 'income');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="category" innerRadius={50} outerRadius={80}>
              {data.map((item) => (
                <Cell key={item.category} fill={getCategoryColor(item.category)} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatPKR(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {data.map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <span>{getCategoryEmoji(item.category)}</span>
              <span className="capitalize">{item.category}</span>
              <span className="ml-auto text-gray-500">{formatPKR(item.total)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
