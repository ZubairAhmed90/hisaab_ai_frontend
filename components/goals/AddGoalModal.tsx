'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddGoal } from '@/lib/hooks';

// Modal to create a new savings goal
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button className="gap-2">
            <Plus size={16} /> Add Goal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Savings Goal</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Goal Title</Label>
            <Input
              placeholder="e.g. Emergency Fund, New Laptop"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Target Amount (PKR)</Label>
            <Input
              type="number"
              placeholder="e.g. 50000"
              value={form.target_amount}
              onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Create Goal'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
