'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateBudget } from '@/lib/hooks';

// Modal to edit an existing budget limit
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

  // Submit updated budget limit
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate(
      { id: budget.id, data: { monthly_limit: Number(limit) } },
      {
        onSuccess: () => { toast.success('Budget updated'); setOpen(false); },
        onError: () => toast.error('Something went wrong'),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5">
            <Pencil size={14} /> Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit {budget.category} Budget</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2"><Label>Monthly Limit (PKR)</Label><Input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} required /></div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Update Budget'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
