'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SuccessPanel } from '@/components/transact/SuccessPanel';
import { formatPKR } from '@/lib/utils';

function BillsSuccessContent() {
  const params = useSearchParams();
  const amount = params.get('amount') || '0';
  const biller = params.get('biller') || 'biller';

  return (
    <SuccessPanel
      title="Bill Paid!"
      amount={formatPKR(Number(amount))}
      subtitle={`Your ${biller} payment was successful and recorded in transactions.`}
    />
  );
}

export default function BillsSuccessPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <BillsSuccessContent />
    </Suspense>
  );
}
