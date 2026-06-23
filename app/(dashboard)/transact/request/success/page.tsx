'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SuccessPanel } from '@/components/transact/SuccessPanel';
import { formatPKR } from '@/lib/utils';

function RequestSuccessContent() {
  const params = useSearchParams();
  const amount = params.get('amount') || '0';
  const from = params.get('from') || 'contact';

  return (
    <SuccessPanel
      title="Request Sent!"
      amount={formatPKR(Number(amount))}
      subtitle={`Your payment request was sent to ${from}. They'll be notified in the app.`}
    />
  );
}

export default function RequestSuccessPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <RequestSuccessContent />
    </Suspense>
  );
}
