'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Hash, Receipt, Zap } from 'lucide-react';
import { StepHeader } from '@/components/transact/StepHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPKR } from '@/lib/utils';

function BillsDetailsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const billerId = params.get('billerId') || '1';
  const category = params.get('category') || 'electricity';
  const billerName = params.get('billerName') || 'Biller';
  const [consumerNumber, setConsumerNumber] = useState('');
  const [amount, setAmount] = useState('');

  const numAmount = Number(amount);
  const canContinue = consumerNumber.trim().length > 0 && numAmount > 0;

  return (
    <>
      <StepHeader title={billerName} backHref="/transact/bills" />

      <div className="mb-6 rounded-2xl border border-border/50 bg-card p-5 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime/40">
            <Zap size={22} className="text-gray-800" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Biller</p>
            <p className="text-lg font-bold text-gray-900">{billerName}</p>
          </div>
        </div>
      </div>

      <p className="mb-2 text-sm font-medium text-gray-900">Consumer / account number</p>
      <div className="relative mb-4">
        <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          value={consumerNumber}
          onChange={(e) => setConsumerNumber(e.target.value)}
          placeholder="Enter consumer number"
          className="rounded-xl pl-9"
        />
      </div>

      <p className="mb-2 text-sm font-medium text-gray-900">Amount (PKR)</p>
      <Input
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
        placeholder="Enter bill amount from your statement"
        inputMode="decimal"
        className="mb-2 rounded-xl text-lg font-bold"
      />
      <p className="mb-6 text-xs text-muted">
        Enter the amount shown on your bill. Live bill fetch is not connected yet.
      </p>

      {canContinue ? (
        <div className="mb-6 rounded-2xl bg-lime/30 p-5 text-center">
          <Receipt size={24} className="mx-auto text-gray-800" />
          <p className="mt-2 text-sm text-black/60">Amount to pay</p>
          <p className="font-number text-3xl font-bold text-gray-900">{formatPKR(numAmount)}</p>
          <p className="mt-1 text-xs text-muted">{billerName}</p>
        </div>
      ) : null}

      <Button
        className="w-full rounded-xl"
        disabled={!canContinue}
        onClick={() =>
          router.push(
            `/transact/bills/confirm?billerId=${billerId}&category=${category}&billerName=${encodeURIComponent(billerName)}&consumerNumber=${consumerNumber}&amount=${numAmount}`,
          )
        }
      >
        Continue to pay
      </Button>
    </>
  );
}

export default function BillsDetailsPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <BillsDetailsContent />
    </Suspense>
  );
}
