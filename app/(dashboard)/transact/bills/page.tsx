'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Smartphone, Wifi, Zap } from 'lucide-react';
import { TransactNav, TransactPageHeader } from '@/components/transact/TransactShell';
import { BILLERS, type BillerCategory } from '@/lib/catalog';
import { cn } from '@/lib/utils';

const CATEGORIES: { key: BillerCategory; label: string; icon: typeof Zap; color: string }[] = [
  { key: 'electricity', label: 'Electricity', icon: Zap, color: 'bg-amber-500/15 text-amber-600' },
  { key: 'gas', label: 'Gas', icon: Flame, color: 'bg-orange-500/15 text-orange-600' },
  { key: 'internet', label: 'Internet', icon: Wifi, color: 'bg-violet-500/15 text-violet-600' },
  { key: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-primary/10 text-primary' },
];

export default function BillsPage() {
  const router = useRouter();
  const [category, setCategory] = useState<BillerCategory>('electricity');
  const billers = BILLERS[category];
  const catMeta = CATEGORIES.find((c) => c.key === category)!;

  return (
    <>
      <TransactNav />

      <TransactPageHeader
        title="Pay Bills"
        subtitle="Electricity, gas, internet and mobile postpaid — select your provider"
      />

      <div className="rounded-3xl bg-card p-6 shadow-card">
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all',
                category === key
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface text-muted hover:bg-surface/80 hover:text-gray-900',
              )}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {billers.map((b) => {
            const CatIcon = catMeta.icon;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() =>
                  router.push(
                    `/transact/bills/details?billerId=${b.id}&category=${category}&billerName=${encodeURIComponent(b.name)}`,
                  )
                }
                className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-surface/30 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card hover:shadow-card"
              >
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', catMeta.color)}>
                  <CatIcon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{b.name}</p>
                  {b.region ? <p className="text-xs text-muted">{b.region}</p> : null}
                  <p className="mt-2 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Pay now →
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
