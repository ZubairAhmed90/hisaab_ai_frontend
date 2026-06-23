'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users } from 'lucide-react';
import { BeneficiaryRow } from '@/components/transact/BeneficiaryRow';
import { ReceiveQrPanel } from '@/components/transact/ReceiveQrPanel';
import {
  TRANSACT_MAIN,
  TRANSACT_SIDE,
  TransactNav,
  TransactPageHeader,
} from '@/components/transact/TransactShell';
import { Input } from '@/components/ui/input';
import { mockBeneficiaries } from '@/lib/mockData';

export default function RequestPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const filtered = mockBeneficiaries.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <TransactNav />

      <TransactPageHeader
        title="Request Money"
        subtitle="Send a payment request to contacts or share your QR to receive"
      />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className={`${TRANSACT_MAIN} rounded-3xl bg-card p-6 shadow-card`}>
          <div className="relative mb-5 max-w-xl">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search contacts..."
              className="rounded-xl pl-9"
            />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <Users size={16} className="text-accent" />
            <p className="text-sm font-semibold text-gray-900">Send request to</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3">
            {filtered.map((b) => (
              <BeneficiaryRow
                key={b.id}
                beneficiary={b}
                onClick={() => router.push(`/transact/request/amount?contactId=${b.id}`)}
              />
            ))}
          </div>
        </div>

        <div className={`${TRANSACT_SIDE} rounded-3xl bg-card p-6 shadow-card`}>
          <p className="mb-1 text-sm font-semibold text-gray-900">Or receive via QR</p>
          <p className="mb-4 text-xs text-muted">Share this code — no request needed</p>
          <ReceiveQrPanel compact />
        </div>
      </div>
    </>
  );
}
