'use client';

import { useState } from 'react';
import { LimitsISet } from '@/components/limits/LimitsISet';
import { LimitsOnMe } from '@/components/limits/LimitsOnMe';
import { LimitStats } from '@/components/limits/LimitStats';
import { SetLimitModal } from '@/components/limits/SetLimitModal';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import { useLimitsMine, useLimitsSet, usePartnerSummary } from '@/lib/hooks';
import { useAuthStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Plus, Shield } from 'lucide-react';

const TABS = [
  { value: 'set' as const, labelKey: 'limits.limitsISet' as const },
  { value: 'mine' as const, labelKey: 'limits.limitsOnMe' as const },
];

// Spending limits page with tabs for limits set vs limits on me
export default function LimitsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'set' | 'mine'>('set');
  const userId = useAuthStore((s) => s.user?.id);
  const setQuery = useLimitsSet();
  const mineQuery = useLimitsMine();
  const partner = usePartnerSummary();

  const setLimits = setQuery.data || [];
  const mineLimits = mineQuery.data || [];
  const isLoading = tab === 'set' ? setQuery.isLoading : mineQuery.isLoading;
  const hasSetLimits = setLimits.length > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('limits.title')}</h1>
          <p className="mt-1 text-sm text-muted">{t('limits.subtitle')}</p>
        </div>
        {tab === 'set' && hasSetLimits && (
          <SetLimitModal
            partnerId={partner.data?.partner_id}
            trigger={
              <Button className="gap-2">
                <Plus size={16} /> Add Limit
              </Button>
            }
          />
        )}
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl bg-card p-1.5 shadow-card">
        {TABS.map((tabItem) => (
          <button
            key={tabItem.value}
            type="button"
            onClick={() => setTab(tabItem.value)}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
              tab === tabItem.value
                ? 'bg-primary text-white shadow-[0_2px_10px_rgba(24,95,165,0.3)]'
                : 'text-muted hover:bg-surface hover:text-gray-800',
            )}
          >
            <Shield size={14} />
            {t(tabItem.labelKey)}
          </button>
        ))}
      </div>

      {!isLoading && (
        <LimitStats
          tab={tab}
          setLimits={setLimits}
          mineLimits={mineLimits}
          userId={userId}
        />
      )}

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} className="h-24 w-full" />
            ))}
          </div>
          <SkeletonCard className="h-64 w-full" />
        </div>
      ) : tab === 'set' ? (
        <LimitsISet />
      ) : (
        <LimitsOnMe />
      )}
    </div>
  );
}
