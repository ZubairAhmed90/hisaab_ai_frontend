'use client';

import { Plus, Shield } from 'lucide-react';
import { LinkPartnerBanner } from '@/components/limits/LinkPartnerBanner';
import { LimitSetCard } from '@/components/limits/LimitSetCard';
import { SetLimitModal } from '@/components/limits/SetLimitModal';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import { useLimitsSet, usePartnerSummary } from '@/lib/hooks';
import { useAuthStore } from '@/lib/store';

// List of spending limits set by the current user
export function LimitsISet() {
  const userId = useAuthStore((s) => s.user?.id);
  const { data, isLoading, isError } = useLimitsSet();
  const partner = usePartnerSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} className="h-44 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl bg-danger/10 p-6 text-center text-danger">
        Failed to load limits. Please try again.
      </div>
    );
  }

  const limits = data || [];
  const hasLimits = limits.length > 0;

  return (
    <div className="space-y-5">
      {!partner.data && <LinkPartnerBanner />}

      {partner.data && (
        <div className="flex items-center gap-3 rounded-2xl bg-success/10 px-4 py-3 text-sm">
          <Shield size={16} className="text-success" />
          <span>
            Linked with <span className="font-semibold">{partner.data.partner_name}</span> — you can
            set limits for each other
          </span>
        </div>
      )}

      {!hasLimits ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-card">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Shield size={32} className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No limits set</h3>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Create hard or soft spending caps for yourself or your partner to stay in control.
          </p>
          <div className="mt-6">
            <SetLimitModal
              partnerId={partner.data?.partner_id}
              trigger={
                <Button className="gap-2 rounded-xl px-6">
                  <Plus size={16} /> Create Your First Limit
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Limits You Set</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {limits.map(
              (limit: {
                id: number;
                category: string;
                monthly_limit: number;
                alert_at_percent: number;
                is_hard_limit: boolean;
                target_name?: string;
                owner_id?: number;
                target_user_id: number;
              }) => (
                <LimitSetCard key={limit.id} limit={limit} currentUserId={userId} />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
