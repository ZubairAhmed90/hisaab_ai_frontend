'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CreditCard, Plus } from 'lucide-react';
import { AddTransactionModal } from '@/components/dashboard/AddTransactionModal';
import { ImportCsvModal } from '@/components/transactions/ImportCsvModal';
import { TransactionRow } from '@/components/transactions/TransactionRow';
import { TransactionStats } from '@/components/transactions/TransactionStats';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import { useTransactionSummary, useTransactions } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';

export default function TransactionsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useTransactions(page, 20);
  const summary = useTransactionSummary();

  const { income, expenses } = useMemo(() => {
    const rows = summary.data || [];
    let inc = 0;
    let exp = 0;
    for (const row of rows) {
      if (row.category === 'income') inc += Number(row.total);
      else exp += Number(row.total);
    }
    return { income: inc, expenses: exp };
  }, [summary.data]);

  if (isLoading) {
    return (
      <div className="space-y-5">
        <SkeletonCard className="h-16 w-full max-w-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} className="h-24 w-full" />
          ))}
        </div>
        <SkeletonCard className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl bg-danger/10 p-6 text-center text-danger">
        Failed to load transactions. Please try again.
      </div>
    );
  }

  const totalPages = Math.ceil((data?.total || 0) / (data?.limit || 20));
  const hasItems = (data?.items?.length || 0) > 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('transactions.title')}</h1>
          <p className="mt-1 text-sm text-muted">{t('transactions.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImportCsvModal />
          <AddTransactionModal
            trigger={
              <Button className="gap-2">
                <Plus size={16} /> Add Transaction
              </Button>
            }
          />
        </div>
      </div>

      {/* Stats */}
      <TransactionStats total={data?.total || 0} income={income} expenses={expenses} />

      {/* List */}
      {!hasItems ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface">
            <CreditCard size={28} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No transactions yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Start tracking your finances by adding a transaction manually or importing from your bank CSV.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <AddTransactionModal
              trigger={
                <Button className="gap-2">
                  <Plus size={16} /> Add Transaction
                </Button>
              }
            />
            <ImportCsvModal />
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-card shadow-card transition-shadow duration-200 hover:shadow-card-hover">
          <div className="flex items-center justify-between border-b border-border/60 bg-surface/50 px-5 py-3">
            <p className="text-sm font-semibold text-gray-900">All Transactions</p>
            <p className="text-xs text-muted">
              Showing {data!.items.length} of {data!.total} records
            </p>
          </div>
          <div>
            {data!.items.map(
              (txn: {
                id: number;
                transaction_date: string;
                description: string;
                category: string;
                amount: number;
              }) => (
                <TransactionRow key={txn.id} txn={txn} />
              ),
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {hasItems && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="gap-1"
          >
            <ChevronLeft size={16} /> Previous
          </Button>
          <span className="rounded-xl bg-surface px-4 py-2 text-sm font-medium text-gray-700">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="gap-1"
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
