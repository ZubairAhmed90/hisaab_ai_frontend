'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategorySelect } from '@/components/shared/CategorySelect';
import { useAddBudget } from '@/lib/hooks';

// Modal to create a new monthly budget
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button className="gap-2">
            <Plus size={16} /> Add Budget
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Budget</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Category</Label>
            <CategorySelect value={category} onChange={setCategory} />
          </div>
          <div className="space-y-2">
            <Label>Monthly Limit (PKR)</Label>
            <Input
              type="number"
              placeholder="e.g. 15000"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Create Budget'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
