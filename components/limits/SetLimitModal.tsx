'use client';

import { useState } from 'react';
import { Plus, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategorySelect } from '@/components/shared/CategorySelect';
import { AppFormModal, FormField, ModalActions } from '@/components/shared/AppFormModal';
import { useCreateLimit } from '@/lib/hooks';

const FORM_ID = 'set-limit-form';

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
    <AppFormModal
      open={open}
      onOpenChange={setOpen}
      trigger={
        trigger || (
          <Button className="gap-2">
            <Plus size={16} /> Add Limit
          </Button>
        )
      }
      title="Set spending limit"
      description="Cap category spending and get alerts before you overspend."
      icon={Shield}
      size="lg"
      footer={
        <ModalActions
          formId={FORM_ID}
          onCancel={() => setOpen(false)}
          submitLabel="Create Limit"
          isSubmitting={mutation.isPending}
          loadingLabel="Creating…"
        />
      }
    >
      <form id={FORM_ID} className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Category">
          <CategorySelect value={form.category} onChange={(c) => setForm({ ...form, category: c })} />
        </FormField>
        <FormField label="Monthly limit (PKR)">
          <Input
            type="number"
            placeholder="e.g. 10000"
            className="font-number"
            value={form.monthly_limit}
            onChange={(e) => setForm({ ...form, monthly_limit: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Alert at">
          <Select
            value={form.alert_at_percent}
            onValueChange={(v) => setForm({ ...form, alert_at_percent: v as string })}
          >
            <SelectTrigger className="h-10 rounded-xl border-0 bg-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['50', '70', '80', '90'].map((p) => (
                <SelectItem key={p} value={p}>
                  {p}% of limit
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        {partnerId ? (
          <FormField label="Apply to">
            <Select value={form.target} onValueChange={(v) => setForm({ ...form, target: v as string })}>
              <SelectTrigger className="h-10 rounded-xl border-0 bg-surface">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self">Myself</SelectItem>
                <SelectItem value="partner">My partner</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        ) : null}
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-surface/60 p-3.5 text-sm transition-colors hover:border-primary/20">
          <input
            type="checkbox"
            checked={form.is_hard_limit}
            onChange={(e) => setForm({ ...form, is_hard_limit: e.target.checked })}
            className="mt-0.5 rounded"
          />
          <span className="leading-relaxed text-gray-800">
            Block transactions when this limit is reached
          </span>
        </label>
      </form>
    </AppFormModal>
  );
}
