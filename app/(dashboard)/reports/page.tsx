'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Share2 } from 'lucide-react';
import { AiSummary } from '@/components/reports/AiSummary';
import { GradeCard } from '@/components/reports/GradeCard';
import { formatMonthLabel, ReportStats } from '@/components/reports/ReportStats';
import { ScoreBreakdown } from '@/components/reports/ScoreBreakdown';
import { ShareCard } from '@/components/reports/ShareCard';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import { getRecentMonths } from '@/lib/chart.helpers';
import { useReport, useTransactionSummary } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

export default function ReportsPage() {
  const { t } = useTranslation();
  const months = getRecentMonths(6);
  const [month, setMonth] = useState(months[0]);
  const { data, isLoading, isError, refetch, isFetching } = useReport(month);
  const summary = useTransactionSummary();
  const shareRef = useRef<HTMLDivElement>(null);

  const topCategory =
    (summary.data || [])
      .filter((item: { category: string }) => item.category !== 'income')
      .sort((a: { total: number }, b: { total: number }) => b.total - a.total)[0]?.category || 'other';

  const shareWhatsApp = async () => {
    if (shareRef.current) await html2canvas(shareRef.current);
    const grade = data?.overall_grade || 'N/A';
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`My HisaabAI Report: ${grade} this month! Check yours at hisaabai.vercel.app`)}`,
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('reports.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('reports.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl bg-card p-1.5 shadow-card">
        {months.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMonth(m)}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
              month === m
                ? 'bg-primary text-white shadow-[0_2px_10px_rgba(24,95,165,0.3)]'
                : 'text-muted hover:bg-surface hover:text-gray-800',
            )}
          >
            {formatMonthLabel(m)}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} className="h-24 w-full" />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <SkeletonCard className="h-64 w-full" />
            <SkeletonCard className="h-64 w-full" />
          </div>
          <SkeletonCard className="h-32 w-full" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-danger/10 px-6 py-10 text-center">
          <p className="font-medium text-danger">Failed to load report.</p>
          <p className="mt-1 text-sm text-danger/80">Please check your connection and try again.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 border-danger/30 text-danger hover:bg-danger/5"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? 'Loading...' : 'Retry'}
          </Button>
        </div>
      )}

      {data && (
        <>
          <ReportStats report={data} />

          <div className="grid gap-5 lg:grid-cols-2">
            <GradeCard grade={data.overall_grade} month={month} />
            <ScoreBreakdown report={data} />
          </div>

          <AiSummary report={data} />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Share Your Report</h2>
                <p className="text-xs text-muted">Show off your grade on WhatsApp</p>
              </div>
              <Button onClick={shareWhatsApp} className="gap-2 rounded-xl">
                <Share2 size={16} /> Share on WhatsApp
              </Button>
            </div>
            <div ref={shareRef} className="max-w-md">
              <ShareCard
                grade={data.overall_grade}
                month={month}
                topCategory={topCategory}
                savingsRate={data.savings_score}
                improvement="stable"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
