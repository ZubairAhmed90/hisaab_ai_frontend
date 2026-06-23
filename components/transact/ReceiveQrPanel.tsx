'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { buildPayQrPayload, encodePayQr, buildAccountId } from '@/lib/qr';
import { useAuthStore } from '@/lib/store';
import { cn, formatPKR } from '@/lib/utils';

export function ReceiveQrPanel({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const user = useAuthStore((s) => s.user);
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const numAmount = amount ? Number(amount) : undefined;
  const payload = buildPayQrPayload(
    { id: user?.id, name: user?.name },
    numAmount && numAmount > 0 ? numAmount : undefined,
  );
  const qrValue = encodePayQr(payload);
  const account = user?.id ? buildAccountId(user.id) : payload.account;
  const qrSize = compact ? 120 : 180;

  const copyAccount = async () => {
    await navigator.clipboard.writeText(account);
    setCopied(true);
    toast.success('Account ID copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime/50 via-lime/20 to-white',
          compact ? 'p-4' : 'rounded-3xl p-6 shadow-card',
        )}
      >
        {!compact ? (
          <>
            <p className="text-center text-sm font-medium text-black/50">Your payment QR</p>
            <p className="text-center text-lg font-bold text-gray-900">{user?.name || 'Your Account'}</p>
          </>
        ) : (
          <p className="mb-3 text-center text-sm font-semibold text-gray-900">{user?.name}</p>
        )}

        <div className={cn('mx-auto flex w-fit rounded-xl bg-white shadow-md', compact ? 'my-3 p-2' : 'my-5 p-4')}>
          <QRCode value={qrValue} size={qrSize} level="M" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <code className="rounded-lg bg-white/70 px-2 py-1 text-xs font-semibold text-gray-800">
            {account}
          </code>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={copyAccount}>
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </Button>
        </div>
        {numAmount && numAmount > 0 ? (
          <p className="mt-2 text-center text-xs font-semibold text-primary">
            Requesting {formatPKR(numAmount)}
          </p>
        ) : !compact ? (
          <p className="mt-3 text-center text-xs text-black/50">
            Anyone can scan this to send you money
          </p>
        ) : null}
      </div>

      <div className={cn('rounded-xl bg-surface/80', compact ? 'p-3' : 'rounded-2xl p-4')}>
        {!compact ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Optional — set amount to receive
          </p>
        ) : null}
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={compact ? 'Amount (optional)' : 'e.g. 5000'}
          className="rounded-xl"
        />
      </div>
    </div>
  );
}
