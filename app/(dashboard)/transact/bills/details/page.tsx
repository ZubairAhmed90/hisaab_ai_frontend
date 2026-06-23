'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
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
  const prefilledAmount = params.get('amount');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [fetching, setFetching] = useState(false);
  const [amount, setAmount] = useState<number | null>(
    prefilledAmount ? Number(prefilledAmount) : null,
  );

  const fetchBill = () => {
    if (consumerNumber.length < 5) return;
    setFetching(true);
    setTimeout(() => {
      setAmount(4500);
      setFetching(false);
    }, 600);
  };

  return (
    <>
      <StepHeader title={billerName} backHref="/transact/bills" />
      <p className="mb-4 text-sm text-muted">Enter your consumer / account number</p>
      <Input
        value={consumerNumber}
        onChange={(e) => setConsumerNumber(e.target.value)}
        placeholder="Consumer number"
        className="mb-3 rounded-xl"
      />
      <Button
        className="mb-6 w-full rounded-xl"
        disabled={consumerNumber.length < 5 || fetching}
        onClick={fetchBill}
      >
        {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch Bill'}
      </Button>
      {amount !== null ? (
        <div className="mb-4 rounded-2xl bg-lime/30 p-4">
          <p className="text-sm text-black/60">Amount due</p>
          <p className="font-number text-2xl font-bold text-gray-900">{formatPKR(amount)}</p>
        </div>
      ) : null}
      <Button
        className="w-full rounded-xl"
        disabled={amount === null}
        onClick={() =>
          router.push(
            `/transact/bills/confirm?billerId=${billerId}&category=${category}&billerName=${encodeURIComponent(billerName)}&consumerNumber=${consumerNumber}&amount=${amount}`,
          )
        }
      >
        Continue
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
