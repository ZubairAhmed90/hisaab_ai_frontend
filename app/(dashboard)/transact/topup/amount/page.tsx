'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AmountKeypad } from '@/components/transact/AmountKeypad';
import { ConfirmButton } from '@/components/transact/ConfirmButton';
import { StepHeader } from '@/components/transact/StepHeader';
import { TopupPackageGrid } from '@/components/transact/TopupPackageGrid';
import { cn, formatPKR } from '@/lib/utils';
import { mockOperators } from '@/lib/mockData';
import { getPackagesForOperator } from '@/lib/topup';
import type { TopupPackage } from '@/lib/topup.helpers';
import { useRecordPayment } from '@/lib/hooks';

function TopupAmountContent() {
  const router = useRouter();
  const recordPayment = useRecordPayment();
  const params = useSearchParams();
  const operatorId = Number(params.get('operatorId') || '1');
  const phone = params.get('phone') || '';
  const contactName = params.get('contactName') || '';
  const initialAmount = params.get('amount') || '';
  const initialPackageId = params.get('packageId') || '';
  const initialPackageLabel = params.get('packageLabel') || '';

  const operator = mockOperators.find((o) => o.id === operatorId);
  const packages = getPackagesForOperator(operatorId);

  const [amount, setAmount] = useState(initialAmount);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    initialPackageId || null,
  );
  const [customMode, setCustomMode] = useState(!initialAmount);
  const valid = amount.length > 0 && Number(amount) > 0;

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
      setCustomMode(false);
    }
  }, [initialAmount]);

  const handlePackageSelect = (pkg: TopupPackage) => {
    setSelectedPackageId(pkg.id);
    setAmount(String(pkg.amount));
    setCustomMode(false);
  };

  const handleConfirm = async () => {
    const pkg = packages.find((p) => p.id === selectedPackageId);
    const label = pkg?.label || initialPackageLabel;
    const recipient = contactName || phone;
    const desc = label
      ? `${operator?.name || 'Mobile'} ${label} — ${recipient}`
      : `${operator?.name || 'Mobile'} top-up — ${recipient}`;

    await recordPayment.mutateAsync({
      amount: Number(amount),
      description: desc,
      category: 'utilities',
      merchant: operator?.name,
      source: 'topup',
    });
    router.push(
      `/transact/topup/success?amount=${amount}&phone=${phone}&operator=${encodeURIComponent(operator?.name || '')}&package=${encodeURIComponent(label || '')}`,
    );
  };

  return (
    <>
      <StepHeader title="Top Up Amount" backHref="/transact/topup" />
      <p className="mb-1 text-sm text-muted">
        {operator?.name} · {contactName ? `${contactName} · ` : ''}
        {phone}
      </p>
      <p className="font-number mb-4 text-center text-4xl font-bold text-gray-900">
        Rs {amount || '0'}
      </p>

      {!customMode ? (
        <div className="mb-4">
          <TopupPackageGrid
            packages={packages}
            selectedId={selectedPackageId}
            onSelect={handlePackageSelect}
            compact
          />
          <button
            type="button"
            onClick={() => {
              setCustomMode(true);
              setSelectedPackageId(null);
            }}
            className="mt-3 text-sm font-semibold text-primary hover:underline"
          >
            Enter custom amount
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {packages
              .filter((p) => p.type === 'balance')
              .slice(0, 4)
              .map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => handlePackageSelect(pkg)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium',
                    amount === String(pkg.amount)
                      ? 'bg-primary text-white'
                      : 'bg-surface text-muted',
                  )}
                >
                  Rs {pkg.amount}
                </button>
              ))}
          </div>
          <AmountKeypad value={amount} onChange={(v) => {
            setAmount(v);
            setSelectedPackageId(null);
          }} />
          <button
            type="button"
            onClick={() => setCustomMode(false)}
            className="mt-3 text-sm font-semibold text-primary hover:underline"
          >
            Back to packages
          </button>
        </>
      )}

      <div className="mt-6">
        <ConfirmButton
          label={valid ? `Top up ${formatPKR(Number(amount))}` : 'Top up'}
          onConfirm={handleConfirm}
        />
      </div>
    </>
  );
}

export default function TopupAmountPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <TopupAmountContent />
    </Suspense>
  );
}
