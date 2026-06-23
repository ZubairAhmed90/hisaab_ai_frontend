'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Shield, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SetLimitModal } from '@/components/limits/SetLimitModal';
import {
  PartnerEmptyState,
  PartnerLimitsSection,
  PartnerLinkedHero,
  PartnerStatsGrid,
  type PartnerLimitRow,
} from '@/components/partner/PartnerSections';
import { useUnlinkPartner } from '@/lib/hooks';

type PartnerData = {
  partner_name?: string;
  partner_id?: number;
  partner_email?: string;
  partner_account?: string | null;
  partner_wallet?: number;
  partner_account_balance?: number;
  categories?: { category: string; spent: number; limit: number }[];
  limits_i_set?: PartnerLimitRow[];
  limits_on_me?: PartnerLimitRow[];
  stats?: {
    limits_set_count?: number;
    limits_on_me_count?: number;
    total_monitored_spend?: number;
    categories_exceeded?: number;
    my_categories_exceeded?: number;
  };
};

export function PartnerPageSummary({ partner }: { partner: PartnerData | null | undefined }) {
  const unlink = useUnlinkPartner();
  const [confirmUnlink, setConfirmUnlink] = useState(false);

  if (!partner?.partner_name) return null;

  const limitsISet = partner.limits_i_set ?? partner.categories?.map((c) => ({ ...c })) ?? [];
  const limitsOnMe = partner.limits_on_me ?? [];

  const handleUnlink = () => {
    unlink.mutate(undefined, {
      onSuccess: () => {
        toast.success('Partner unlinked');
        setConfirmUnlink(false);
      },
      onError: () => toast.error('Could not unlink partner'),
    });
  };

  return (
    <div className="space-y-6">
      <PartnerLinkedHero
        name={partner.partner_name}
        email={partner.partner_email}
        account={partner.partner_account}
        wallet={partner.partner_wallet}
        accountBalance={partner.partner_account_balance}
      />

      <PartnerStatsGrid stats={partner.stats} />

      <div className="grid gap-6 xl:grid-cols-2">
        <PartnerLimitsSection
          title="Limits you set for partner"
          description="Categories you monitor on their spending"
          limits={limitsISet}
          emptyMessage="You haven’t set any limits for your partner yet."
          emptyAction={
            <SetLimitModal
              partnerId={partner.partner_id}
              trigger={
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Plus size={14} /> Add limit
                </Button>
              }
            />
          }
        />
        <PartnerLimitsSection
          title="Limits your partner set on you"
          description="Their rules on your spending this month"
          limits={limitsOnMe}
          emptyMessage="Your partner hasn’t placed any limits on you."
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <SetLimitModal
          partnerId={partner.partner_id}
          trigger={
            <Button className="gap-2">
              <Shield size={16} /> Set new limit
            </Button>
          }
        />
        <Link
          href="/limits"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border-2 border-border bg-white px-4 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
        >
          Manage all limits
        </Link>
      </div>

      <div className="rounded-2xl border border-dashed border-danger/25 bg-danger/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900">Unlink partner</p>
            <p className="text-sm text-muted">
              Removes the connection and stops shared limit tracking. Limits are not deleted.
            </p>
          </div>
          {!confirmUnlink ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-danger/30 text-danger hover:bg-danger/10"
              onClick={() => setConfirmUnlink(true)}
            >
              <Unlink size={14} /> Unlink
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setConfirmUnlink(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={unlink.isPending}
                onClick={handleUnlink}
              >
                {unlink.isPending ? 'Unlinking…' : 'Confirm unlink'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { PartnerEmptyState };
