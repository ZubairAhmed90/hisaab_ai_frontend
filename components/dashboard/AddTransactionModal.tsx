'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategorySelect } from '@/components/shared/CategorySelect';
import { useAddTransaction, useLimitsMine } from '@/lib/hooks';
import { formatPKR } from '@/lib/utils';

// Modal form to add a new transaction with limit warnings
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

  // Submit new transaction to the API
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (blocked) return;
    mutation.mutate(
      { amount: Number(form.amount), description: form.description, date: form.date, category: form.category },
      {
        onSuccess: () => {
          toast.success('Transaction added!');
          setOpen(false);
          setForm({ amount: '', description: '', date: new Date().toISOString().split('T')[0], category: 'other' });
        },
        onError: (err) => {
          const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
          toast.error(message || 'Something went wrong');
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger || <Button>Add Transaction</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2"><Label>Amount</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></div>
          <div className="space-y-2"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
          <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
          <div className="space-y-2"><Label>Category</Label><CategorySelect value={form.category} onChange={(category) => setForm({ ...form, category })} /></div>
          {limitCheck && (
            <p className={`text-sm ${blocked ? 'text-red-600' : 'text-amber-600'}`}>
              {blocked
                ? `⚠️ This will exceed your ${formatPKR(limitCheck.cap)} ${form.category} limit`
                : `⚠️ Approaching your ${formatPKR(limitCheck.cap)} ${form.category} limit`}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={mutation.isPending || blocked}>
            {mutation.isPending ? 'Saving...' : 'Save Transaction'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
