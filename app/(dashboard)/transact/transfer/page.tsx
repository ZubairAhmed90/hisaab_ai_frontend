'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { WalletTransferPanel } from '@/components/transact/WalletTransferPanel';
import { useTranslation } from '@/lib/i18n';

export default function TransferPage() {
  const { t } = useTranslation();

  return (
    <>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-gray-900"
      >
        <ArrowLeft size={16} /> {t('common.back')}
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('transact.moveMoneyTitle')}</h1>
        <p className="mt-1 text-sm text-muted">{t('transact.moveMoneySubtitle')}</p>
      </div>
      <WalletTransferPanel />
    </>
  );
}
