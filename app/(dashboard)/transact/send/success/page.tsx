'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SuccessPanel } from '@/components/transact/SuccessPanel';
import { formatPKR } from '@/lib/utils';

function SendSuccessContent() {
  const params = useSearchParams();
  const amount = params.get('amount') || '0';
  const to = params.get('to') || 'recipient';

  return (
    <SuccessPanel
      title="Money Sent!"
      amount={formatPKR(Number(amount))}
      subtitle={`Your transfer to ${to} was successful. It has been recorded in your transactions.`}
    />
  );
}

export default function SendSuccessPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <SendSuccessContent />
    </Suspense>
  );
}
