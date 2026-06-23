'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateGoal } from '@/lib/hooks';
import { formatPKR } from '@/lib/utils';

// Modal to update saved amount on a goal
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Progress — {goal.title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted">
          Target: {formatPKR(Number(goal.target_amount))}
        </p>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Saved Amount (PKR)</Label>
            <Input
              type="number"
              value={saved}
              onChange={(e) => setSaved(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Update Progress'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
