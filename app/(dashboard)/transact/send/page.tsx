'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Search, Shield, Users } from 'lucide-react';
import { BeneficiaryRow } from '@/components/transact/BeneficiaryRow';
import { PayActionStrip } from '@/components/transact/PayQuickActions';
import { ReceiveQrPanel } from '@/components/transact/ReceiveQrPanel';
import {
  TRANSACT_MAIN,
  TRANSACT_SIDE,
  TransactNav,
  TransactPageHeader,
} from '@/components/transact/TransactShell';
import { Input } from '@/components/ui/input';
import { mockBeneficiaries } from '@/lib/mockData';

const TIPS = [
  'Transfers to local banks are free and instant',
  'Scan a friend\'s QR from Receive QR tab to pay them',
  'Daily limit resets at midnight PKT',
];

export default function SendPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const filtered = mockBeneficiaries.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <TransactNav />

      <TransactPageHeader
        title="Send Money"
        subtitle="Transfer PKR instantly to saved beneficiaries or scan a payment QR"
      />

      <PayActionStrip />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className={`${TRANSACT_MAIN} space-y-5`}>
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <div className="relative mb-5">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or bank..."
                className="rounded-xl pl-9"
              />
            </div>

            <div className="mb-4 flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <p className="text-sm font-semibold text-gray-900">Saved beneficiaries</p>
              <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted">
                {filtered.length}
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((b) => (
                <BeneficiaryRow
                  key={b.id}
                  beneficiary={b}
                  onClick={() => router.push(`/transact/send/amount?beneficiaryId=${b.id}`)}
                />
              ))}
            </div>
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">No contacts match your search</p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Shield size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted">Daily limit</p>
                <p className="font-number font-bold text-gray-900">Rs 500,000</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/40">
                <Clock size={18} className="text-gray-700" />
              </div>
              <div>
                <p className="text-xs text-muted">Transfer fee</p>
                <p className="font-bold text-gray-900">Free</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Users size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted">Saved contacts</p>
                <p className="font-bold text-gray-900">{mockBeneficiaries.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${TRANSACT_SIDE} xl:sticky xl:top-6`}>
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <p className="mb-1 text-sm font-semibold text-gray-900">Quick receive</p>
            <p className="mb-4 text-xs text-muted">Share this QR to get paid instantly</p>
            <ReceiveQrPanel compact />
          </div>
          <ul className="mt-4 space-y-2 rounded-2xl bg-surface/80 p-4">
            {TIPS.map((tip) => (
              <li key={tip} className="flex gap-2 text-xs text-muted">
                <span className="text-primary">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
