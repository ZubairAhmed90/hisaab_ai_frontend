'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AmountKeypad } from '@/components/transact/AmountKeypad';
import { TransactFlowCard, TransactFlowHeader } from '@/components/transact/TransactFlow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockBeneficiaries } from '@/lib/mockData';

function SendAmountContent() {
  const router = useRouter();
  const params = useSearchParams();
  const beneficiaryId = params.get('beneficiaryId') || '';
  const merchantName = params.get('merchantName') || '';
  const prefilled = params.get('amount') || '';
  const beneficiary = mockBeneficiaries.find((b) => String(b.id) === beneficiaryId);
  const [amount, setAmount] = useState(prefilled);
  const [note, setNote] = useState('');
  const valid = amount.length > 0 && amount !== '0' && amount !== '0.';
  const displayName = merchantName || beneficiary?.name || 'Recipient';

  return (
    <>
      <TransactFlowHeader
        title="Enter amount"
        current={1}
        steps={[
          { label: 'Recipient', href: '/transact/send' },
          { label: 'Amount' },
          { label: 'Confirm' },
        ]}
      />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <TransactFlowCard className="xl:col-span-6">
          <p className="mb-6 text-sm font-medium text-muted">Sending to</p>
          <div className="flex items-center gap-4">
            {merchantName ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white">
                {merchantName.charAt(0)}
              </div>
            ) : beneficiary ? (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold text-white"
                style={{ backgroundColor: beneficiary.color }}
              >
                {beneficiary.initials}
              </div>
            ) : null}
            <div>
              <p className="text-xl font-bold text-gray-900">{displayName}</p>
              {beneficiary ? (
                <p className="text-sm text-muted">
                  {beneficiary.bank} {beneficiary.account}
                </p>
              ) : null}
            </div>
          </div>
          <p className="font-number mt-8 text-5xl font-bold tracking-tight text-gray-900">
            Rs {amount || '0'}
          </p>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            className="mt-6 rounded-xl"
          />
        </TransactFlowCard>

        <TransactFlowCard className="xl:col-span-6">
          <p className="mb-4 text-sm font-semibold text-gray-900">Enter amount</p>
          <AmountKeypad value={amount} onChange={setAmount} />
          <Button
            className="mt-6 h-12 w-full rounded-xl text-base"
            disabled={!valid}
            onClick={() => {
              const q = new URLSearchParams({ beneficiaryId, merchantName, amount, note });
              router.push(`/transact/send/confirm?${q.toString()}`);
            }}
          >
            Review transfer
          </Button>
        </TransactFlowCard>
      </div>
    </>
  );
}

export default function SendAmountPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <SendAmountContent />
    </Suspense>
  );
}
