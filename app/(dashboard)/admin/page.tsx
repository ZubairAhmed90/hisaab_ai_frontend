'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { useAdminCredit, useAdminUsers } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';
import { formatPKR } from '@/lib/utils';

export default function AdminPage() {
  const { t } = useTranslation();
  const { data: users, isLoading, isError } = useAdminUsers();
  const credit = useAdminCredit();
  const [amounts, setAmounts] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});

  if (isLoading) return <SkeletonCard className="h-96 w-full" />;
  if (isError) {
    return (
      <p className="text-danger">
        Admin access required. Log in as admin@hisaab.ai (default password: admin123)
      </p>
    );
  }

  const submitCredit = async (userId: number) => {
    const amount = parseFloat(amounts[userId] || '0');
    if (!amount || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    try {
      await credit.mutateAsync({ userId, amount, note: notes[userId] });
      toast.success(`Credited Rs ${amount.toLocaleString()}`);
      setAmounts((a) => ({ ...a, [userId]: '' }));
    } catch {
      toast.error('Credit failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('admin.subtitle')}</p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface/50 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Wallet</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Stocks</th>
              <th className="px-4 py-3">Add funds</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((u: {
              id: number;
              account_number: string;
              name: string;
              email: string;
              wallet_balance: number;
              account_balance: number;
              holdings_count: number;
              is_admin: boolean;
            }) => (
              <tr key={u.id} className="border-b border-border/50">
                <td className="px-4 py-3 font-mono text-xs">{u.id}</td>
                <td className="px-4 py-3 font-mono text-xs">{u.account_number}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{u.name}{u.is_admin ? ' (admin)' : ''}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </td>
                <td className="px-4 py-3 font-number font-bold">{formatPKR(u.wallet_balance)}</td>
                <td className="px-4 py-3 font-number">{formatPKR(u.account_balance)}</td>
                <td className="px-4 py-3">{u.holdings_count}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      className="h-9 w-28"
                      value={amounts[u.id] || ''}
                      onChange={(e) => setAmounts((a) => ({ ...a, [u.id]: e.target.value }))}
                    />
                    <Input
                      placeholder="Note"
                      className="h-9 w-32"
                      value={notes[u.id] || ''}
                      onChange={(e) => setNotes((n) => ({ ...n, [u.id]: e.target.value }))}
                    />
                    <Button size="sm" onClick={() => submitCredit(u.id)} disabled={credit.isPending}>
                      Credit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
