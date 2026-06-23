'use client';

import { cn, formatPKR } from '@/lib/utils';
import type { TopupPackage } from '@/lib/topup.helpers';

export function TopupPackageGrid({
  packages,
  selectedId,
  onSelect,
  compact = false,
}: {
  packages: TopupPackage[];
  selectedId: string | null;
  onSelect: (pkg: TopupPackage) => void;
  compact?: boolean;
}) {
  const balance = packages.filter((p) => p.type === 'balance');
  const bundles = packages.filter((p) => p.type === 'bundle');

  return (
    <div className="space-y-4">
      {balance.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Balance</p>
          <div className={cn('grid gap-2', compact ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6')}>
            {balance.map((pkg) => (
              <PackageChip key={pkg.id} pkg={pkg} selected={selectedId === pkg.id} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ) : null}
      {bundles.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Bundles & packages</p>
          <div className={cn('grid gap-2', compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')}>
            {bundles.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => onSelect(pkg)}
                className={cn(
                  'rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5',
                  selectedId === pkg.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border/50 bg-surface/30 hover:border-primary/25',
                )}
              >
                <p className="font-semibold text-gray-900">{pkg.label}</p>
                <p className="font-number mt-1 text-lg font-bold text-primary">{formatPKR(pkg.amount)}</p>
                {pkg.data ? <p className="mt-1 text-xs text-muted">{pkg.data}</p> : null}
                {pkg.validity ? (
                  <span className="mt-2 inline-block rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-muted">
                    {pkg.validity}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PackageChip({
  pkg,
  selected,
  onSelect,
}: {
  pkg: TopupPackage;
  selected: boolean;
  onSelect: (pkg: TopupPackage) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(pkg)}
      className={cn(
        'rounded-xl border py-3 text-center text-sm font-semibold transition-all',
        selected
          ? 'border-primary bg-primary text-white'
          : 'border-border/50 bg-surface text-gray-800 hover:border-primary/30',
      )}
    >
      Rs {pkg.amount}
    </button>
  );
}
