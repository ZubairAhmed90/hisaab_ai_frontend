'use client';

import Link from 'next/link';
import { ArrowDownLeft, QrCode, ScanLine, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACTIONS = [
  {
    href: '/transact/scan',
    label: 'Scan to Pay',
    desc: 'Pay merchant or friend',
    icon: ScanLine,
    gradient: 'from-primary to-[#0d4a82]',
    iconBg: 'bg-lime/20 text-lime',
  },
  {
    href: '/transact/receive',
    label: 'My QR',
    desc: 'Receive payments',
    icon: QrCode,
    gradient: 'from-[#3d4a00] to-[#1a1a2e]',
    iconBg: 'bg-lime text-black',
  },
  {
    href: '/transact/beneficiary',
    label: 'Add Contact',
    desc: 'New beneficiary',
    icon: UserPlus,
    gradient: 'from-accent/90 to-primary',
    iconBg: 'bg-white/20 text-white',
  },
];

export function PayActionGrid({ showReceive = true }: { showReceive?: boolean }) {
  const items = showReceive ? ACTIONS : ACTIONS.filter((a) => a.href !== '/transact/receive');

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(({ href, label, desc, icon: Icon, gradient, iconBg }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'group flex flex-col items-center rounded-2xl bg-gradient-to-br p-4 text-center text-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover',
            gradient,
          )}
        >
          <div
            className={cn(
              'mb-2 flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
              iconBg,
            )}
          >
            <Icon size={22} />
          </div>
          <p className="text-xs font-bold leading-tight">{label}</p>
          <p className="mt-0.5 text-[10px] text-white/70">{desc}</p>
        </Link>
      ))}
    </div>
  );
}

export function RequestActionBanner() {
  return (
    <Link
      href="/transact/receive"
      className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-lime/40 to-lime/10 p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime shadow-sm">
        <ArrowDownLeft size={22} className="text-black/70" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900">Show my QR to receive</p>
        <p className="text-xs text-muted">Let others scan and pay you instantly</p>
      </div>
      <QrCode size={20} className="text-primary" />
    </Link>
  );
}
