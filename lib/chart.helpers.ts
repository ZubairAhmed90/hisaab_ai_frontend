const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Aggregate transaction amounts by weekday for the current week
export function getWeeklySpending(
  transactions: { transaction_date: string; amount: number | string; category: string }[],
) {
  const totals = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);

  for (const txn of transactions) {
    if (txn.category === 'income') continue;
    const date = new Date(txn.transaction_date);
    if (date < weekStart) continue;
    const dayIndex = (date.getDay() + 6) % 7;
    totals[dayIndex] += Number(txn.amount);
  }

  return WEEK_DAYS.map((day, index) => ({ day, amount: totals[index] }));
}

// Sum expense categories this month (always a positive number for display)
export function sumSpending(summary: { category: string; total: number }[]) {
  return summary
    .filter((item) => item.category !== 'income')
    .reduce((sum, item) => {
      const total = Number(item.total);
      if (total === 0) return sum;
      // Wallet debits are negative; legacy seed rows are positive expenses
      if (total < 0) return sum + Math.abs(total);
      // Positive totals on invest are stock sale credits — not spending
      if (item.category === 'invest') return sum;
      return sum + total;
    }, 0);
}

// Aggregate spending by month for the last N months
export function getMonthlySpending(
  transactions: { transaction_date: string; amount: number | string; category: string }[],
  count = 6,
) {
  const months = getRecentMonths(count).reverse();
  const totals: Record<string, number> = Object.fromEntries(months.map((m) => [m, 0]));

  for (const txn of transactions) {
    if (txn.category === 'income') continue;
    const key = txn.transaction_date.slice(0, 7);
    if (key in totals) totals[key] += Number(txn.amount);
  }

  return months.map((m) => ({
    name: new Date(`${m}-01`).toLocaleDateString('en-PK', { month: 'short' }),
    amount: totals[m],
  }));
}

// Aggregate spending by month for the current year
export function getYearlySpending(
  transactions: { transaction_date: string; amount: number | string; category: string }[],
) {
  const year = new Date().getFullYear();
  const totals = Array.from({ length: 12 }, () => ({ name: '', amount: 0 }));

  for (let i = 0; i < 12; i++) {
    totals[i].name = new Date(year, i, 1).toLocaleDateString('en-PK', { month: 'short' });
  }

  for (const txn of transactions) {
    if (txn.category === 'income') continue;
    const date = new Date(txn.transaction_date);
    if (date.getFullYear() !== year) continue;
    totals[date.getMonth()].amount += Number(txn.amount);
  }

  return totals;
}

// Build last N months as YYYY-MM strings
export function getRecentMonths(count = 6) {
  const months = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.push(month);
  }
  return months;
}
