'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SuccessPanel } from '@/components/transact/SuccessPanel';
import { formatPKR } from '@/lib/utils';

function TopupSuccessContent() {
  const params = useSearchParams();
  const amount = params.get('amount') || '0';
  const phone = params.get('phone') || '';
  const operator = params.get('operator') || 'Mobile';

  return (
    <SuccessPanel
      title="Top Up Successful!"
      amount={formatPKR(Number(amount))}
      subtitle={`Rs ${Number(amount).toLocaleString()} has been added to ${phone} (${operator}).`}
    />
  );
}

export default function TopupSuccessPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <TopupSuccessContent />
    </Suspense>
  );
}
