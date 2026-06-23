'use client';

import Link from 'next/link';
import { QrCode, ScanLine, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACTIONS = [
  {
    href: '/transact/scan',
    label: 'Scan to pay',
    desc: 'Camera or upload QR',
    icon: ScanLine,
    color: 'bg-primary/10 text-primary',
  },
  {
    href: '/transact/receive',
    label: 'My QR code',
    desc: 'Receive payments',
    icon: QrCode,
    color: 'bg-lime/50 text-gray-800',
  },
  {
    href: '/transact/beneficiary',
    label: 'Add beneficiary',
    desc: 'Save a new contact',
    icon: UserPlus,
    color: 'bg-accent/10 text-accent',
  },
];

export function PayActionStrip() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {ACTIONS.map(({ href, label, desc, icon: Icon, color }) => (
        <Link
          key={href}
          href={href}
          className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-card-hover"
        >
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105',
              color,
            )}
          >
            <Icon size={20} strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            <p className="truncate text-xs text-muted">{desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** @deprecated use PayActionStrip */
export function PayQuickActions() {
  return <PayActionStrip />;
}
