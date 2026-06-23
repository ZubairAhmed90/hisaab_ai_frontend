'use client';

import Link from 'next/link';
import { Bot, ArrowLeftRight, CreditCard, PieChart, Plus, Send, Target, TrendingUp, Trophy, Zap } from 'lucide-react';
import { AddTransactionModal } from '@/components/dashboard/AddTransactionModal';
import { useTranslation, type TranslationKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';

function ActionTile({
  href,
  label,
  desc,
  icon: Icon,
  color,
}: {
  href: string;
  label: string;
  desc: string;
  icon: typeof Send;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-surface/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:shadow-md active:scale-[0.98]"
    >
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105', color)}>
        <Icon size={18} strokeWidth={2.25} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="truncate text-xs text-muted">{desc}</p>
      </div>
    </Link>
  );
}

export function QuickPanel() {
  const { t } = useTranslation();

  const quickLinks: { href: string; labelKey: TranslationKey; descKey: TranslationKey; icon: typeof Send; color: string }[] = [
    { href: '/transact/send', labelKey: 'dashboard.send', descKey: 'transact.sendSubtitle', icon: Send, color: 'bg-lime/40 text-gray-800' },
    { href: '/transact/transfer', labelKey: 'dashboard.moveFunds', descKey: 'common.walletAccountTransfer', icon: ArrowLeftRight, color: 'bg-violet-500/10 text-violet-600' },
    { href: '/transact/bills', labelKey: 'dashboard.payBills', descKey: 'transact.billsSubtitle', icon: Zap, color: 'bg-amber-500/10 text-amber-600' },
    { href: '/advisor', labelKey: 'dashboard.askAi', descKey: 'advisor.askSpending', icon: Bot, color: 'bg-primary/10 text-primary' },
    { href: '/mirror', labelKey: 'nav.mirror', descKey: 'mirror.subtitle', icon: TrendingUp, color: 'bg-accent/10 text-accent' },
    { href: '/budgets', labelKey: 'nav.budgets', descKey: 'budgets.subtitle', icon: Target, color: 'bg-amber-500/10 text-amber-600' },
    { href: '/goals', labelKey: 'nav.goals', descKey: 'goals.subtitle', icon: Trophy, color: 'bg-violet-500/10 text-violet-600' },
    { href: '/reports', labelKey: 'nav.reports', descKey: 'reports.subtitle', icon: PieChart, color: 'bg-rose-500/10 text-rose-600' },
    { href: '/transactions', labelKey: 'dashboard.history', descKey: 'transactions.subtitle', icon: CreditCard, color: 'bg-sky-500/10 text-sky-600' },
  ];

  return (
    <div className="rounded-3xl bg-card p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{t('dashboard.quickActions')}</h3>
        <p className="mt-0.5 text-xs text-muted">{t('dashboard.shortcuts')}</p>
      </div>

      <AddTransactionModal
        trigger={
          <button
            type="button"
            className="group mb-3 flex w-full items-center gap-3 rounded-2xl bg-primary p-3.5 text-left shadow-[0_4px_16px_rgba(24,95,165,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1568a0] hover:shadow-[0_8px_24px_rgba(24,95,165,0.36)] active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime text-black shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Plus size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{t('dashboard.addTransaction')}</p>
              <p className="text-xs text-white/70">{t('dashboard.logIncomeExpense')}</p>
            </div>
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-2.5">
        {quickLinks.map((item) => (
          <ActionTile
            key={item.href}
            href={item.href}
            label={t(item.labelKey)}
            desc={t(item.descKey)}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
}
