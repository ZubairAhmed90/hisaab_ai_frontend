'use client';

import { useEffect, useState } from 'react';
import { Target } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { AppFormModal, FormField, ModalActions } from '@/components/shared/AppFormModal';
import { useUpdateGoal } from '@/lib/hooks';
import { formatPKR } from '@/lib/utils';

const FORM_ID = 'update-goal-form';

export function UpdateGoalModal({
  goal,
  trigger,
}: {
  goal: { id: number; title: string; saved_amount: number; target_amount: number };
  trigger?: React.ReactNode;
}) {
  const mutation = useUpdateGoal();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(String(goal.saved_amount));

  useEffect(() => {
    if (open) setSaved(String(goal.saved_amount));
  }, [open, goal.saved_amount]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate(
      { id: goal.id, saved_amount: Number(saved) },
      {
        onSuccess: () => {
          toast.success('Progress updated!');
          setOpen(false);
        },
        onError: () => toast.error('Something went wrong'),
      },
    );
  };

  const progress = Math.min(100, Math.round((Number(saved) / Number(goal.target_amount)) * 100));

  return (
    <AppFormModal
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title={`Update progress — ${goal.title}`}
      description={`Target: ${formatPKR(Number(goal.target_amount))}`}
      icon={Target}
      footer={
        <ModalActions
          formId={FORM_ID}
          onCancel={() => setOpen(false)}
          submitLabel="Update Progress"
          isSubmitting={mutation.isPending}
        />
      }
    >
      <form id={FORM_ID} className="space-y-4" onSubmit={handleSubmit}>
        <div className="rounded-xl bg-surface/80 px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-lime transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <FormField label="Saved amount (PKR)">
          <Input
            type="number"
            className="font-number"
            value={saved}
            onChange={(e) => setSaved(e.target.value)}
            required
          />
        </FormField>
      </form>
    </AppFormModal>
  );
}
