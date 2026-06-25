'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AmountKeypad } from '@/components/transact/AmountKeypad';
import { ConfirmButton } from '@/components/transact/ConfirmButton';
import { StepHeader } from '@/components/transact/StepHeader';
import { Input } from '@/components/ui/input';
import { formatPKR } from '@/lib/utils';
import { useBeneficiaries, useCreateMoneyRequest } from '@/lib/hooks';
import { toast } from 'sonner';

function RequestAmountContent() {
  const router = useRouter();
  const params = useSearchParams();
  const createRequest = useCreateMoneyRequest();
  const beneficiaries = useBeneficiaries();
  const contactId = params.get('contactId') || '';
  const contact = (beneficiaries.data || []).find((b) => String(b.id) === contactId);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const valid = amount.length > 0 && amount !== '0';

  const handleConfirm = async () => {
    const payerUserId = contact?.linked_user_id;
    const accountNumber = contact?.account || undefined;
    if (!payerUserId && !accountNumber) {
      toast.error('Contact needs a HisaabAI account ID');
      return;
    }
    try {
      await createRequest.mutateAsync({
        ...(payerUserId ? { payer_user_id: payerUserId } : { account_number: accountNumber }),
        amount: Number(amount),
        reason: reason.trim() || undefined,
      });
      router.push(
        `/transact/request/success?amount=${amount}&from=${encodeURIComponent(contact?.name || 'Contact')}`,
      );
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Request failed');
    }
  };

  return (
    <>
      <StepHeader title="Request Amount" backHref="/transact/request" />
      {contact ? (
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: contact.color }}
          >
            {contact.initials}
          </div>
          <p className="font-semibold text-gray-900">{contact.name}</p>
        </div>
      ) : null}
      <p className="font-number mb-4 text-center text-4xl font-bold text-gray-900">
        Rs {amount || '0'}
      </p>
      <Input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional)"
        className="mb-4 rounded-xl"
      />
      <AmountKeypad value={amount} onChange={setAmount} />
      <div className="mt-6">
        <ConfirmButton
          label={`Request ${valid ? formatPKR(Number(amount)) : 'Rs 0'}`}
          onConfirm={handleConfirm}
        />
      </div>
    </>
  );
}

export default function RequestAmountPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <RequestAmountContent />
    </Suspense>
  );
}
