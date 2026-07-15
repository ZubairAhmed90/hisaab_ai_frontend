import Link from 'next/link';
import { ArrowRight, Receipt } from 'lucide-react';
import { formatPKR, getCategoryEmoji } from '@/lib/utils';

type Txn = {
  id: number;
  description: string;
  category: string;
  amount: number | string;
};

// Recent transaction list matching reference card style
export function RecentTransactions({ transactions }: { transactions: Txn[] }) {
  const recent = transactions.slice(0, 5);

  return (
    <div className="rounded-3xl bg-card p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
          <p className="mt-0.5 text-xs text-muted">Latest activity</p>
        </div>
        <Link
          href="/transactions"
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {recent.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 px-4 py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Receipt size={22} className="text-muted" />
            </div>
            <p className="text-sm font-medium text-gray-700">No transactions yet</p>
            <p className="mt-1 max-w-[180px] text-xs text-muted">
              Add your first transaction to see activity here
            </p>
          </div>
        ) : (
          recent.map((tx) => {
            const amount = Number(tx.amount);
            // Sign follows ledger amount (receive = positive credit, send = negative debit)
            const isCredit = amount >= 0;
            return (
              <div
                key={tx.id}
                className="flex items-center gap-3 rounded-xl px-1 py-1.5 transition-colors hover:bg-surface/80"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-lg">
                  {getCategoryEmoji(tx.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{tx.description}</p>
                  <p className="text-xs capitalize text-muted">{tx.category}</p>
                </div>
                <span
                  className={`font-number shrink-0 text-sm font-semibold ${isCredit ? 'text-success' : 'text-danger'}`}
                >
                  {isCredit ? '+' : '-'}
                  {formatPKR(Math.abs(amount))}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
