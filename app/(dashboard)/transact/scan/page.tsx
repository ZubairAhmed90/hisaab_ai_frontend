'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ScanLine } from 'lucide-react';
import {
  TRANSACT_MAIN,
  TRANSACT_SIDE,
  TransactNav,
  TransactPageHeader,
} from '@/components/transact/TransactShell';
import { parsePayQr, qrToSendParams } from '@/lib/qr';

const QrScanner = dynamic(
  () => import('@/components/transact/QrScanner').then((m) => m.QrScanner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center rounded-2xl bg-sidebar text-white/60 lg:h-[420px]">
        Starting camera...
      </div>
    ),
  },
);

export default function ScanQrPage() {
  const router = useRouter();

  const handleScan = (raw: string) => {
    const payload = parsePayQr(raw);
    if (payload) {
      const params = qrToSendParams(payload);
      toast.success(`QR scanned — ${payload.name}`);
      router.push(`/transact/send/amount?${new URLSearchParams(params).toString()}`);
      return;
    }
    toast.error('Invalid QR code. Use a HisaabAI receive QR or pay from Send Money.');
  };

  return (
    <>
      <TransactNav />

      <TransactPageHeader
        title="Scan to Pay"
        subtitle="Use your webcam or upload a QR image from a merchant or friend"
      />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className={`${TRANSACT_MAIN} rounded-3xl bg-card p-6 shadow-card`}>
          <QrScanner onScan={handleScan} />
        </div>
        <div className={`${TRANSACT_SIDE} space-y-4`}>
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ScanLine size={24} className="text-primary" />
            </div>
            <h2 className="font-semibold text-gray-900">Scanning tips</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>• Hold the QR steady inside the frame</li>
              <li>• Works with HisaabAI receive QR codes</li>
              <li>• Upload a screenshot if camera fails</li>
              <li>• Good lighting improves scan speed</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-dashed border-border bg-surface/50 p-5 text-sm text-muted">
            Don&apos;t have a QR? Pay from{' '}
            <button
              type="button"
              className="font-semibold text-primary hover:underline"
              onClick={() => router.push('/transact/send')}
            >
              Send Money
            </button>{' '}
            using saved beneficiaries.
          </div>
        </div>
      </div>
    </>
  );
}
