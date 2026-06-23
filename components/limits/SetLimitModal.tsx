'use client';

import { useState } from 'react';
import { Plus, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategorySelect } from '@/components/shared/CategorySelect';
import { useCreateLimit } from '@/lib/hooks';

// Modal to create a spending limit for self or partner
export function SetLimitModal({
  partnerId,
  trigger,
}: {
  partnerId?: number;
  trigger?: React.ReactNode;
}) {
  const mutation = useCreateLimit();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    category: 'shopping',
    monthly_limit: '',
    alert_at_percent: '80',
    is_hard_limit: true,
    target: 'self',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      {
        category: form.category,
        monthly_limit: Number(form.monthly_limit),
        alert_at_percent: Number(form.alert_at_percent),
        is_hard_limit: form.is_hard_limit,
        target_user_id: form.target === 'partner' && partnerId ? partnerId : undefined,
      },
      {
        onSuccess: () => {
          toast.success('Limit created!');
          setOpen(false);
        },
        onError: () => toast.error('Something went wrong'),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button className="gap-2">
            <Plus size={16} /> Add Limit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield size={18} className="text-primary" /> Set Spending Limit
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Category</Label>
            <CategorySelect value={form.category} onChange={(c) => setForm({ ...form, category: c })} />
          </div>
          <div className="space-y-2">
            <Label>Monthly Limit (PKR)</Label>
            <Input
              type="number"
              placeholder="e.g. 10000"
              value={form.monthly_limit}
              onChange={(e) => setForm({ ...form, monthly_limit: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Alert at %</Label>
            <Select
              value={form.alert_at_percent}
              onValueChange={(v) => setForm({ ...form, alert_at_percent: v as string })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['50', '70', '80', '90'].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {partnerId && (
            <div className="space-y-2">
              <Label>Apply to</Label>
              <Select
                value={form.target}
                onValueChange={(v) => setForm({ ...form, target: v as string })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Myself</SelectItem>
                  <SelectItem value="partner">My Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 bg-surface/50 p-3 text-sm">
            <input
              type="checkbox"
              checked={form.is_hard_limit}
              onChange={(e) => setForm({ ...form, is_hard_limit: e.target.checked })}
              className="rounded"
            />
            Block transactions when limit is reached
          </label>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'Create Limit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
