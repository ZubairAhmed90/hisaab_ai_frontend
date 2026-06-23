'use client';

import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BeneficiaryRow({
  beneficiary,
  onClick,
}: {
  beneficiary: { name: string; initials: string; color: string; bank: string; account: string };
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-3 rounded-2xl border border-border/40 bg-gradient-to-r from-card to-surface/30 p-4',
        'transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-card-hover',
      )}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-sm transition-transform group-hover:scale-105"
        style={{ backgroundColor: beneficiary.color }}
      >
        {beneficiary.initials}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="font-semibold text-gray-900">{beneficiary.name}</p>
        <p className="text-xs text-muted">
          {beneficiary.bank} {beneficiary.account}
        </p>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <ChevronRight size={16} />
      </div>
    </button>
  );
}
