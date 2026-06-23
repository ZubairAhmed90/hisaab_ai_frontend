'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConfirmButton } from '@/components/transact/ConfirmButton';
import { TransactFlowCard, TransactFlowHeader } from '@/components/transact/TransactFlow';
import { formatPKR } from '@/lib/utils';
import { mockBeneficiaries } from '@/lib/mockData';
import { useRecordPayment } from '@/lib/hooks';

function SendConfirmContent() {
  const router = useRouter();
  const recordPayment = useRecordPayment();
  const params = useSearchParams();
  const beneficiaryId = params.get('beneficiaryId') || '';
  const merchantName = params.get('merchantName') || '';
  const amount = params.get('amount') || '0';
  const note = params.get('note') || '';
  const beneficiary = mockBeneficiaries.find((b) => String(b.id) === beneficiaryId);
  const toName = merchantName || beneficiary?.name || 'Recipient';
  const numAmount = Number(amount);

  const amountHref = `/transact/send/amount?${new URLSearchParams({ beneficiaryId, merchantName, amount }).toString()}`;

  const handleConfirm = async () => {
    await recordPayment.mutateAsync({
      amount: numAmount,
      description: note ? `Transfer to ${toName}: ${note}` : `Transfer to ${toName}`,
      category: 'transfer',
      merchant: toName,
      source: 'transfer',
    });
    router.push(`/transact/send/success?amount=${amount}&to=${encodeURIComponent(toName)}`);
  };

  const rows = [
    { label: 'Recipient', value: `${toName}${beneficiary ? ` · ${beneficiary.bank}` : ''}` },
    { label: 'Amount', value: formatPKR(numAmount), large: true },
    ...(note ? [{ label: 'Note', value: note }] : []),
    { label: 'Transfer fee', value: 'Rs 0 (free)' },
    { label: 'Total debit', value: formatPKR(numAmount), highlight: true },
  ];

  return (
    <>
      <TransactFlowHeader
        title="Review & confirm"
        current={2}
        steps={[
          { label: 'Recipient', href: '/transact/send' },
          { label: 'Amount', href: amountHref },
          { label: 'Confirm' },
        ]}
      />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <TransactFlowCard className="xl:col-span-8">
          <div className="divide-y divide-border/60">
            {rows.map(({ label, value, large, highlight }) => (
              <div key={label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <span className="text-sm text-muted">{label}</span>
                <span
                  className={
                    highlight
                      ? 'font-number text-xl font-bold text-primary'
                      : large
                        ? 'font-number text-2xl font-bold text-gray-900'
                        : 'font-medium text-gray-900'
                  }
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-md">
            <ConfirmButton label={`Send ${formatPKR(numAmount)}`} onConfirm={handleConfirm} />
          </div>
        </TransactFlowCard>
      </div>
    </>
  );
}

export default function SendConfirmPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <SendConfirmContent />
    </Suspense>
  );
}
