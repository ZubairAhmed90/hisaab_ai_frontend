'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { CategorySelect } from '@/components/shared/CategorySelect';
import { Button } from '@/components/ui/button';
import { useUpdateTransactionCategory } from '@/lib/hooks';
import { cn, getCategoryEmoji } from '@/lib/utils';

const BADGE_COLORS: Record<string, string> = {
  food: 'bg-red-500/10 text-red-600',
  transport: 'bg-orange-500/10 text-orange-600',
  shopping: 'bg-violet-500/10 text-violet-600',
  utilities: 'bg-blue-500/10 text-blue-600',
  health: 'bg-pink-500/10 text-pink-600',
  entertainment: 'bg-amber-500/10 text-amber-600',
  education: 'bg-emerald-500/10 text-emerald-600',
  religious: 'bg-indigo-500/10 text-indigo-600',
  income: 'bg-success/10 text-success',
  transfer: 'bg-gray-500/10 text-gray-600',
  other: 'bg-gray-500/10 text-gray-600',
};

// Editable category badge with inline select
export function TransactionCategoryCell({
  id,
  category: initial,
}: {
  id: number;
  category: string;
}) {
  const [editing, setEditing] = useState(false);
  const [category, setCategory] = useState(initial);
  const update = useUpdateTransactionCategory();

  const save = (value: string) => {
    setCategory(value);
    setEditing(false);
    update.mutate(
      { id, category: value },
      { onSuccess: () => toast.success('Category updated'), onError: () => toast.error('Update failed') },
    );
  };

  if (editing) return <CategorySelect value={category} onChange={save} />;

  return (
    <div className="flex items-center gap-1">
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium capitalize',
          BADGE_COLORS[category] || BADGE_COLORS.other,
        )}
      >
        {getCategoryEmoji(category)} {category}
      </span>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setEditing(true)}
        className="h-6 w-6 text-muted/60 hover:text-muted"
      >
        <Pencil className="h-3 w-3 text-muted" />
      </Button>
    </div>
  );
}
