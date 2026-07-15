'use client';

import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { TransactionCategoryCell } from '@/components/transactions/TransactionCategoryCell';
import { Button } from '@/components/ui/button';
import { useDeleteTransaction } from '@/lib/hooks';
import { formatDate, formatPKR, getCategoryEmoji } from '@/lib/utils';

type Transaction = {
  id: number;
  transaction_date: string;
  description: string;
  category: string;
  amount: number;
};

// Single transaction row in card-list style
export function TransactionRow({ txn }: { txn: Transaction }) {
  const deleteTxn = useDeleteTransaction();
  const amount = Number(txn.amount);
  const isCredit = amount >= 0;

  const handleDelete = () => {
    if (!confirm('Delete this transaction?')) return;
    deleteTxn.mutate(txn.id, {
      onSuccess: () => toast.success('Transaction deleted'),
      onError: () => toast.error('Something went wrong'),
    });
  };

  return (
    <div className="group flex items-center gap-4 border-b border-border/60 px-5 py-4 transition-colors last:border-b-0 hover:bg-surface/60">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-lg">
        {getCategoryEmoji(txn.category)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">{txn.description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{formatDate(txn.transaction_date)}</span>
          <span className="text-muted/40">·</span>
          <TransactionCategoryCell id={txn.id} category={txn.category} />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`font-number text-sm font-bold ${isCredit ? 'text-success' : 'text-danger'}`}
        >
          {isCredit ? '+' : '-'}
          {formatPKR(Math.abs(amount))}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDelete}
          disabled={deleteTxn.isPending}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4 text-danger" />
        </Button>
      </div>
    </div>
  );
}
