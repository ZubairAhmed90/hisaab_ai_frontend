'use client';

import { LinkPartnerBanner } from '@/components/limits/LinkPartnerBanner';
import { PartnerEmptyState, PartnerPageSummary } from '@/components/partner/PartnerPageSummary';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { usePartnerSummary } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';

export default function PartnerPage() {
  const { t } = useTranslation();
  const { data: partner, isLoading, isError } = usePartnerSummary();
  const isLinked = !!partner?.partner_name;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('partner.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('partner.subtitle')}</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <SkeletonCard className="h-36 w-full" />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} className="h-24" />
            ))}
          </div>
          <SkeletonCard className="h-64 w-full" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-danger/10 px-4 py-6 text-center text-sm text-danger">
          Could not load partner data. Please try again.
        </div>
      ) : !isLinked ? (
        <PartnerEmptyState linkBanner={<LinkPartnerBanner />} />
      ) : (
        <PartnerPageSummary partner={partner} />
      )}
    </div>
  );
}
