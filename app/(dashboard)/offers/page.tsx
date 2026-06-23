'use client';

import { Gift, Sparkles } from 'lucide-react';
import { OfferCard } from '@/components/offers/OfferCard';
import { OfferStats } from '@/components/offers/OfferStats';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import { useOffers } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';

export default function OffersPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useOffers();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <SkeletonCard className="h-16 w-full max-w-lg" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} className="h-56 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl bg-danger/10 p-6 text-center text-danger">
        Failed to load offers. Please try again.
      </div>
    );
  }

  const offers = data || [];
  const hasOffers = offers.length > 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('offers.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('offers.subtitle')}</p>
      </div>

      {hasOffers && <OfferStats offers={offers} />}

      {!hasOffers ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-card">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime/30">
            <Gift size={32} className="text-gray-800" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No offers yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Add more transactions and set budgets — we&apos;ll surface deals based on where you
            spend the most.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/transactions">
              <Button variant="outline" className="rounded-xl">
                Add Transactions
              </Button>
            </Link>
            <Link href="/budgets">
              <Button className="gap-2 rounded-xl">
                <Sparkles size={16} /> Set Budgets
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recommended for You</h2>
            <p className="text-xs text-muted">
              {offers.length} offer{offers.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {offers.map(
              (offer: {
                id: number;
                title: string;
                description?: string;
                company: string;
                valid_until: string;
                target_category?: string;
                score?: number;
              }) => (
                <OfferCard key={offer.id} offer={offer} />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
