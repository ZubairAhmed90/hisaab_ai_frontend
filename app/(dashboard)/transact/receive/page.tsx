'use client';

import { TransactNav, TransactPageHeader } from '@/components/transact/TransactShell';
import { ReceiveQrPanel } from '@/components/transact/ReceiveQrPanel';

export default function ReceiveQrPage() {
  return (
    <>
      <TransactNav />

      <TransactPageHeader
        title="Receive Payment"
        subtitle="Share your QR code or account ID so others can pay you instantly"
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-3xl bg-card p-6 shadow-card lg:p-8">
          <ReceiveQrPanel />
        </div>
        <div className="rounded-3xl bg-card p-6 shadow-card lg:p-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">How it works</h2>
          <ol className="space-y-4 text-sm text-muted">
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                1
              </span>
              <span>Show your QR to the payer or share a screenshot</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                2
              </span>
              <span>They scan from <strong className="text-gray-900">Scan QR</strong> in Payments</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                3
              </span>
              <span>Payment lands in your account and appears in Transactions</span>
            </li>
          </ol>
          <p className="mt-6 rounded-xl bg-lime/20 p-4 text-sm text-gray-800">
            <strong>Tip:</strong> Set an optional amount to generate a QR for a specific payment request.
          </p>
        </div>
      </div>
    </>
  );
}
