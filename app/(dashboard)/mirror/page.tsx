'use client';

import { useState } from 'react';
import { MirrorTabContent } from '@/components/mirror/MirrorTabContent';
import { HoldingsCard } from '@/components/portfolio/HoldingsCard';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

const PERIODS = [
  { value: '1m' as const, label: '1 Month' },
  { value: '3m' as const, label: '3 Months' },
  { value: '6m' as const, label: '6 Months' },
  { value: '12m' as const, label: '12 Months' },
];

// Investment mirror page comparing overspend vs asset returns
export default function MirrorPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]['value']>('1m');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('mirror.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('mirror.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl bg-card p-1.5 shadow-card">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPeriod(p.value)}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
              period === p.value
                ? 'bg-primary text-white shadow-[0_2px_10px_rgba(24,95,165,0.3)]'
                : 'text-muted hover:bg-surface hover:text-gray-800',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <HoldingsCard />

      <MirrorTabContent period={period} />
    </div>
  );
}
