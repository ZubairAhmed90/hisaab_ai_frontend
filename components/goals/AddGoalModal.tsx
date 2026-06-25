'use client';

import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppFormModal, FormField, ModalActions } from '@/components/shared/AppFormModal';
import { useAddGoal } from '@/lib/hooks';

const FORM_ID = 'add-goal-form';

export function AddGoalModal({ trigger }: { trigger?: React.ReactNode }) {
  const mutation = useAddGoal();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', target_amount: '', deadline: '' });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate(
      { title: form.title, target_amount: Number(form.target_amount), deadline: form.deadline },
      {
        onSuccess: () => {
          toast.success('Goal created!');
          setOpen(false);
          setForm({ title: '', target_amount: '', deadline: '' });
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
            <Plus size={16} /> Add Goal
          </Button>
        )
      }
      title="Add savings goal"
      description="Set a target and track your progress over time."
      icon={Target}
      footer={
        <ModalActions
          formId={FORM_ID}
          onCancel={() => setOpen(false)}
          submitLabel="Create Goal"
          isSubmitting={mutation.isPending}
        />
      }
    >
      <form id={FORM_ID} className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Goal title">
          <Input
            placeholder="e.g. Emergency fund, New laptop"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Target amount (PKR)">
          <Input
            type="number"
            placeholder="e.g. 50000"
            className="font-number"
            value={form.target_amount}
            onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Deadline">
          <Input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            required
          />
        </FormField>
      </form>
    </AppFormModal>
  );
}
