'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConfirmButton } from '@/components/transact/ConfirmButton';
import { StepHeader } from '@/components/transact/StepHeader';
import { formatPKR } from '@/lib/utils';
import { usePayBill } from '@/lib/hooks';
import { toast } from 'sonner';

function BillsConfirmContent() {
  const router = useRouter();
  const payBill = usePayBill();
  const params = useSearchParams();
  const billerId = params.get('billerId') || '';
  const billerName = params.get('billerName') || 'Biller';
  const consumerNumber = params.get('consumerNumber') || '';
  const amount = Number(params.get('amount') || '0');

  const handleConfirm = async () => {
    try {
      await payBill.mutateAsync({
        biller_code: billerId || billerName.toLowerCase().replace(/\s+/g, '_'),
        biller_name: billerName,
        consumer_number: consumerNumber,
        amount,
      });
      router.push(
        `/transact/bills/success?amount=${amount}&biller=${encodeURIComponent(billerName)}`,
      );
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Payment failed');
    }
  };

  return (
    <>
      <StepHeader title="Confirm Payment" backHref={`/transact/bills/details?billerName=${encodeURIComponent(billerName)}`} />
      <div className="space-y-4 rounded-2xl bg-surface/60 p-5">
        <div>
          <p className="text-xs text-muted">Biller</p>
          <p className="font-semibold text-gray-900">{billerName}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Consumer #</p>
          <p className="text-gray-900">{consumerNumber}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Amount</p>
          <p className="font-number text-2xl font-bold text-primary">{formatPKR(amount)}</p>
        </div>
      </div>
      <div className="mt-8">
        <ConfirmButton label={`Pay ${formatPKR(amount)}`} onConfirm={handleConfirm} />
      </div>
    </>
  );
}

export default function BillsConfirmPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <BillsConfirmContent />
    </Suspense>
  );
}
