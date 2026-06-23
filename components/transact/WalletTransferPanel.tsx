'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeftRight, Building2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { usePortfolio, useTransferBalance } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';
import { cn, formatPKR } from '@/lib/utils';

type Direction = 'to_account' | 'to_wallet';

export function WalletTransferPanel({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation();
  const { data, isLoading } = usePortfolio();
  const transfer = useTransferBalance();
  const [direction, setDirection] = useState<Direction>('to_wallet');
  const [amount, setAmount] = useState('');

  if (isLoading) return <SkeletonCard className="h-80 w-full" />;

  const wallet = data?.wallet_balance ?? 0;
  const account = data?.account_balance ?? 0;
  const accountNo = data?.account_number;
  const numAmount = Number(amount);
  const valid = numAmount > 0;
  const max = direction === 'to_account' ? wallet : account;

  const submit = async () => {
    if (!valid) {
      toast.error(t('transact.enterValidAmount'));
      return;
    }
    if (numAmount > max) {
      toast.error(t('transact.maxAvailable', { amount: formatPKR(max) }));
      return;
    }
    try {
      await transfer.mutateAsync({ amount: numAmount, direction });
      toast.success(direction === 'to_account' ? t('transact.movedToAccount') : t('transact.movedToWallet'));
      setAmount('');
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('transact.transferFailed');
      toast.error(msg);
    }
  };

  const directions = [
    { key: 'to_wallet' as const, label: t('transact.toWallet') },
    { key: 'to_account' as const, label: t('transact.toAccount') },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-lime/25 p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Wallet size={16} /> {t('transact.spendingWallet')}
          </div>
          <p className="font-number text-2xl font-bold text-gray-900">{formatPKR(wallet)}</p>
          <p className="mt-1 text-xs text-muted">{t('transact.walletDesc')}</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-surface/80 p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Building2 size={16} /> {t('transact.bankAccount')}
          </div>
          <p className="font-number text-2xl font-bold text-gray-900">{formatPKR(account)}</p>
          {accountNo ? (
            <p className="mt-1 font-mono text-xs text-muted">{accountNo}</p>
          ) : (
            <p className="mt-1 text-xs text-muted">{t('transact.accountDesc')}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 rounded-2xl bg-surface/60 p-1">
        {directions.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setDirection(key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all',
              direction === key ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-gray-900',
            )}
          >
            <ArrowLeftRight size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-card">
        <p className="mb-2 text-sm font-medium text-gray-900">{t('transact.amountPkr')}</p>
        <Input
          type="number"
          min={1}
          placeholder="e.g. 5000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="font-number text-lg"
        />
        <p className="mt-2 text-xs text-muted">
          {t('common.available')}: {formatPKR(max)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[1000, 5000, 10000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(String(Math.min(preset, max)))}
              disabled={max <= 0}
              className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-lime/30 disabled:opacity-40"
            >
              {formatPKR(Math.min(preset, max))}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmount(String(max))}
            disabled={max <= 0}
            className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-lime/30 disabled:opacity-40"
          >
            {t('common.max')}
          </button>
        </div>
        <Button className="mt-5 w-full" size="lg" onClick={submit} disabled={!valid || transfer.isPending || max <= 0}>
          {transfer.isPending
            ? t('transact.transferring')
            : direction === 'to_account'
              ? t('transact.moveToAccount')
              : t('transact.moveToWallet')}
        </Button>
      </div>
    </div>
  );
}
