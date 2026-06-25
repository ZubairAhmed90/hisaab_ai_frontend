'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConfirmButton } from '@/components/transact/ConfirmButton';
import { TransactFlowCard, TransactFlowHeader } from '@/components/transact/TransactFlow';
import { formatPKR } from '@/lib/utils';
import { useBeneficiaries, useSendMoney } from '@/lib/hooks';
import { toast } from 'sonner';

function SendConfirmContent() {
  const router = useRouter();
  const sendMoney = useSendMoney();
  const params = useSearchParams();
  const beneficiaries = useBeneficiaries();
  const beneficiaryId = params.get('beneficiaryId') || '';
  const merchantName = params.get('merchantName') || '';
  const amount = params.get('amount') || '0';
  const note = params.get('note') || '';
  const qrUid = params.get('qrUid') || '';
  const qrAccount = params.get('qrAccount') || '';
  const linkedUserId = params.get('linkedUserId') || '';
  const beneficiary = (beneficiaries.data || []).find((b) => String(b.id) === beneficiaryId);
  const toName = merchantName || beneficiary?.name || 'Recipient';
  const numAmount = Number(amount);

  const amountHref = `/transact/send/amount?${new URLSearchParams({
    beneficiaryId,
    merchantName,
    amount,
    qrUid,
    qrAccount,
    linkedUserId,
  }).toString()}`;

  const handleConfirm = async () => {
    const recipientUserId =
      Number(qrUid) ||
      Number(linkedUserId) ||
      beneficiary?.linked_user_id ||
      undefined;
    const accountNumber = qrAccount || beneficiary?.account || undefined;

    if (!recipientUserId && !accountNumber) {
      toast.error('Recipient needs a HisaabAI account ID for instant transfer');
      return;
    }

    try {
      await sendMoney.mutateAsync({
        ...(recipientUserId ? { recipient_user_id: recipientUserId } : { account_number: accountNumber }),
        amount: numAmount,
        note: note || undefined,
      });
      router.push(`/transact/send/success?amount=${amount}&to=${encodeURIComponent(toName)}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Transfer failed');
    }
  };

  const rows = [
    { label: 'Recipient', value: `${toName}${beneficiary ? ` · ${beneficiary.bank}` : ''}` },
    { label: 'Amount', value: formatPKR(numAmount), large: true },
    ...(note ? [{ label: 'Note', value: note }] : []),
    { label: 'Transfer fee', value: 'Rs 0 (free)' },
    { label: 'Paid from', value: 'Account balance' },
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
