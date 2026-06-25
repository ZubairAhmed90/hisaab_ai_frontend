'use client';

import { useState } from 'react';
import { PieChart, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategorySelect } from '@/components/shared/CategorySelect';
import { AppFormModal, FormField, ModalActions } from '@/components/shared/AppFormModal';
import { useAddBudget } from '@/lib/hooks';

const FORM_ID = 'add-budget-form';

export function AddBudgetModal({ trigger }: { trigger?: React.ReactNode }) {
  const mutation = useAddBudget();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('food');
  const [limit, setLimit] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate(
      { category, monthly_limit: Number(limit) },
      {
        onSuccess: () => {
          toast.success('Budget saved!');
          setOpen(false);
          setLimit('');
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
            <Plus size={16} /> Add Budget
          </Button>
        )
      }
      title="Add Budget"
      description="Set a monthly spending cap for a category."
      icon={PieChart}
      footer={
        <ModalActions
          formId={FORM_ID}
          onCancel={() => setOpen(false)}
          submitLabel="Create Budget"
          isSubmitting={mutation.isPending}
        />
      }
    >
      <form id={FORM_ID} className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Category">
          <CategorySelect value={category} onChange={setCategory} />
        </FormField>
        <FormField label="Monthly limit (PKR)" hint="You will get alerts as you approach this amount.">
          <Input
            type="number"
            placeholder="e.g. 15000"
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
