'use client';

import CountUp from 'react-countup';
import { ArrowLeftRight, ArrowUpRight, Plus, QrCode, ScanLine, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { useTranslation } from '@/lib/i18n';
import { usePortfolio } from '@/lib/hooks';
import { formatPKR } from '@/lib/utils';

export function BalanceCard({ spentThisMonth }: { spentThisMonth: number }) {
  const { t } = useTranslation();
  const { data, isLoading, isError } = usePortfolio();
  const accountBalance = data?.account_balance ?? 0;
  const walletBalance = data?.wallet_balance ?? 0;
  const account = data?.account_number;

  const actions = [
    { label: t('dashboard.scan'), icon: ScanLine, href: '/transact/scan' },
    { label: t('dashboard.send'), icon: ArrowUpRight, href: '/transact/send' },
    { label: t('dashboard.bills'), icon: Zap, href: '/transact/bills' },
    { label: t('dashboard.topUp'), icon: Plus, href: '/transact/topup' },
  ];

  if (isLoading) return <SkeletonCard className="h-52 w-full" />;
  if (isError) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-lime p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-black/[0.04]" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/[0.03]" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-sm font-medium text-black/50">{t('dashboard.accountBalance')}</p>
          <h2 className="font-number mb-1 text-4xl font-bold tracking-tight text-black">
            {t('common.rs')}. <CountUp end={accountBalance} duration={1.2} separator="," decimals={accountBalance % 1 ? 2 : 0} />
          </h2>
          <div className="flex items-center gap-1.5 text-sm text-black/60">
            <TrendingUp size={12} className="text-black/50" />
            <span>
              {t('dashboard.walletBalance')}: {formatPKR(walletBalance)}
              {spentThisMonth > 0 ? ` · ${formatPKR(spentThisMonth)} ${t('common.spentThisMonth')}` : ''}
            </span>
          </div>
          {account ? <p className="mt-1 font-mono text-xs text-black/45">{account}</p> : null}
          <Link
            href="/transact/transfer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-black/55 hover:text-black/80"
          >
            <ArrowLeftRight size={12} /> {t('common.walletAccountTransfer')}
          </Link>
        </div>
        <Link
          href="/transact/receive"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/10 shadow-sm transition-all hover:bg-black/20"
          title={t('transact.receivePayment')}
        >
          <QrCode size={20} className="text-black/70" />
        </Link>
      </div>

      <div className="relative mt-5 flex gap-2">
        {actions.map(({ label, icon: Icon, href }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-2 transition-all duration-200 hover:bg-black/[0.08] active:scale-95"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/10 shadow-sm transition-all duration-200 group-hover:bg-black/20 group-hover:shadow-md">
              <Icon size={17} className="text-black/70" />
            </div>
            <span className="text-[10px] font-medium text-black/60">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
