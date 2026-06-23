'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransactFlowCard } from '@/components/transact/TransactFlow';

export function SuccessPanel({
  title,
  subtitle,
  amount,
}: {
  title: string;
  subtitle: string;
  amount?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <TransactFlowCard className="text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
          <CheckCircle2 size={40} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {amount ? <p className="font-number mt-2 text-3xl font-bold text-primary">{amount}</p> : null}
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">{subtitle}</p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button className="rounded-xl" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button variant="outline" className="rounded-xl" asChild>
            <Link href="/transactions">View Transactions</Link>
          </Button>
        </div>
      </TransactFlowCard>
    </div>
  );
}
