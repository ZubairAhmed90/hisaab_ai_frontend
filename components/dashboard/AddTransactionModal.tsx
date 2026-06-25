'use client';

import { useMemo, useState } from 'react';
import { Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategorySelect } from '@/components/shared/CategorySelect';
import {
  AppFormModal,
  FormField,
  ModalActions,
  ModalAlert,
} from '@/components/shared/AppFormModal';
import { useAddTransaction, useLimitsMine } from '@/lib/hooks';
import { formatPKR } from '@/lib/utils';

const FORM_ID = 'add-transaction-form';

export function AddTransactionModal({ trigger }: { trigger?: React.ReactNode }) {
  const mutation = useAddTransaction();
  const { data: limits } = useLimitsMine();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'other',
  });

  const limitCheck = useMemo(() => {
    const match = (limits || []).find((l: { category: string }) => l.category === form.category);
    if (!match || !form.amount) return null;
    const total = Number(match.spent) + Number(form.amount);
    const cap = Number(match.monthly_limit);
    const exceeded = total > cap;
    return { match, total, cap, exceeded };
  }, [limits, form.category, form.amount]);

  const blocked = limitCheck?.exceeded && limitCheck.match.is_hard_limit;

  const resetForm = () => {
    setForm({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: 'other',
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (blocked) return;
    mutation.mutate(
      { amount: Number(form.amount), description: form.description, date: form.date, category: form.category },
      {
        onSuccess: () => {
          toast.success('Transaction added!');
          setOpen(false);
          resetForm();
        },
        onError: (err) => {
          const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
          toast.error(message || 'Something went wrong');
        },
      },
    );
  };

  return (
    <AppFormModal
      open={open}
      onOpenChange={setOpen}
      trigger={trigger || <Button>Add Transaction</Button>}
      title="Add Transaction"
      description="Log income or spending to keep your account up to date."
      icon={Receipt}
      footer={
        <ModalActions
          formId={FORM_ID}
          onCancel={() => setOpen(false)}
          submitLabel="Save Transaction"
          isSubmitting={mutation.isPending}
          submitDisabled={blocked}
        />
      }
    >
      <form id={FORM_ID} className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Amount (PKR)">
          <Input
            type="number"
            placeholder="e.g. 2500"
            className="font-number text-base"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Description">
          <Input
            placeholder="What was this for?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Date">
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Category">
          <CategorySelect value={form.category} onChange={(category) => setForm({ ...form, category })} />
        </FormField>
        {limitCheck ? (
          <ModalAlert variant={blocked ? 'danger' : 'warning'}>
            {blocked
              ? `This will exceed your ${formatPKR(limitCheck.cap)} ${form.category} limit.`
              : `You are approaching your ${formatPKR(limitCheck.cap)} ${form.category} limit.`}
          </ModalAlert>
        ) : null}
      </form>
    </AppFormModal>
  );
}
