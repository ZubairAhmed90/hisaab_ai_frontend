'use client';

import { useState } from 'react';
import { Pencil, PieChart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppFormModal, FormField, ModalActions } from '@/components/shared/AppFormModal';
import { useUpdateBudget } from '@/lib/hooks';

const FORM_ID = 'edit-budget-form';

export function EditBudgetModal({
  budget,
  trigger,
}: {
  budget: { id: number; category: string; monthly_limit: number };
  trigger?: React.ReactNode;
}) {
  const mutation = useUpdateBudget();
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(String(budget.monthly_limit));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate(
      { id: budget.id, data: { monthly_limit: Number(limit) } },
      {
        onSuccess: () => {
          toast.success('Budget updated');
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
          <Button variant="outline" size="sm" className="gap-1.5">
            <Pencil size={14} /> Edit
          </Button>
        )
      }
      title={`Edit ${budget.category} budget`}
      description="Adjust your monthly spending limit for this category."
      icon={PieChart}
      footer={
        <ModalActions
          formId={FORM_ID}
          onCancel={() => setOpen(false)}
          submitLabel="Update Budget"
          isSubmitting={mutation.isPending}
        />
      }
    >
      <form id={FORM_ID} className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Monthly limit (PKR)">
          <Input
            type="number"
            className="font-number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            required
          />
        </FormField>
      </form>
    </AppFormModal>
  );
}
