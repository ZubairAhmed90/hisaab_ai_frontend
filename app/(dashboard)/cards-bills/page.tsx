'use client';

import { CreditCard, Receipt, Wallet } from 'lucide-react';
import Link from 'next/link';
import { CardVisual } from '@/components/cards/CardVisual';
import { BillRow } from '@/components/cards/BillRow';
import { QuickPayGrid } from '@/components/cards/QuickPayGrid';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { useBillHistory } from '@/lib/hooks';
import { mockCards } from '@/lib/mockData';
import { formatPKR } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';

export default function CardsBillsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: bills = [], isLoading } = useBillHistory();
  const holder = user?.name || 'Card Holder';
  const totalPaid = bills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('cards.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('cards.subtitle')}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <CreditCard size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted">Demo cards</p>
              <p className="font-number text-xl font-bold text-gray-900">{mockCards.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <Receipt size={18} className="text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted">Bill payments</p>
              <p className="font-number text-xl font-bold text-gray-900">{bills.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/30">
              <Wallet size={18} className="text-gray-800" />
            </div>
            <div>
              <p className="text-xs text-muted">Total paid</p>
              <p className="font-number text-xl font-bold text-gray-900">{formatPKR(totalPaid)}</p>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Your Cards</h2>
        <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {mockCards.map((card) => (
            <CardVisual key={card.id} card={card} holder={holder} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">{t('cards.quickPay')}</h2>
        <QuickPayGrid />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Recent bill payments</h2>
          <Link href="/transact/bills" className="text-xs font-semibold text-primary hover:underline">
            Pay a bill
          </Link>
        </div>
        {isLoading ? (
          <SkeletonCard className="h-24 w-full" />
        ) : bills.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-8 text-center text-sm text-muted">
            No bill payments yet.{' '}
            <Link href="/transact/bills" className="font-semibold text-primary hover:underline">
              Pay your first bill
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bills.map((bill) => (
              <BillRow key={bill.id} bill={bill} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
