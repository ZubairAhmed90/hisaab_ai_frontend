'use client';

import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { CurrencyMiniCards } from '@/components/dashboard/CurrencyMiniCards';
import { LimitWarningBanner } from '@/components/dashboard/LimitWarningBanner';
import { QuickPanel } from '@/components/dashboard/QuickPanel';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { PartnerSummaryCard } from '@/components/limits/PartnerSummaryCard';
import { InvestmentPortfolioCard } from '@/components/portfolio/InvestmentPortfolioCard';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { getMonthlySpending, getWeeklySpending, getYearlySpending, sumSpending } from '@/lib/chart.helpers';
import { useTransactionSummary, useTransactions } from '@/lib/hooks';
import { useGreeting, useTranslation } from '@/lib/i18n';
import { useAuthStore } from '@/lib/store';

// Main dashboard with reference-style grid layout
export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  const greeting = useGreeting();
  const summary = useTransactionSummary();
  const transactions = useTransactions(1, 100);

  if (summary.isLoading || transactions.isLoading) {
    return (
      <div className="space-y-5">
        <SkeletonCard className="h-16 w-full max-w-md" />
        <div className="grid grid-cols-12 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} className="col-span-12 h-64 lg:col-span-4" />
          ))}
        </div>
        <SkeletonCard className="h-72 w-full" />
      </div>
    );
  }

  if (summary.isError || transactions.isError) {
    return <p className="text-danger">{t('common.error')}</p>;
  }

  const items = transactions.data?.items || [];
  const totalSpent = sumSpending(summary.data || []);
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {greeting}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted">{t('dashboard.overview')}</p>
      </div>

      <LimitWarningBanner />

      <PartnerSummaryCard />

      <div className="grid grid-cols-12 items-start gap-5">
        <div className="col-span-12 lg:col-span-4">
          <BalanceCard spentThisMonth={totalSpent} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <RecentTransactions transactions={items} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <QuickPanel />
        </div>
        <CurrencyMiniCards summary={summary.data || []} />
      </div>

      <InvestmentPortfolioCard />

      <SpendingChart
        weekly={getWeeklySpending(items).map((d) => ({ name: d.day, amount: d.amount }))}
        monthly={getMonthlySpending(items)}
        yearly={getYearlySpending(items)}
      />
    </div>
  );
}
