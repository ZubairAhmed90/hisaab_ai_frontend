'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  Receipt,
  ScanLine,
  Smartphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/transact/send', label: 'Send Money', icon: ArrowUpRight, match: /^\/transact\/send/ },
  { href: '/transact/request', label: 'Request', icon: ArrowDownLeft, match: /^\/transact\/request/ },
  { href: '/transact/receive', label: 'Receive QR', icon: QrCode, match: /^\/transact\/receive/ },
  { href: '/transact/scan', label: 'Scan QR', icon: ScanLine, match: /^\/transact\/scan/ },
  { href: '/transact/bills', label: 'Pay Bills', icon: Receipt, match: /^\/transact\/bills/ },
  { href: '/transact/topup', label: 'Top Up', icon: Smartphone, match: /^\/transact\/topup/ },
];

export function TransactNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {NAV.map(({ href, label, icon: Icon, match }) => {
        const active = match.test(pathname);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
              active
                ? 'bg-primary text-white shadow-[0_2px_10px_rgba(24,95,165,0.35)]'
                : 'border border-border/70 bg-card text-muted shadow-sm hover:border-primary/30 hover:text-gray-900',
            )}
          >
            <Icon size={15} className="shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function TransactPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

/** 12-col grid helpers for full-width transact pages */
export const TRANSACT_MAIN = 'xl:col-span-8 2xl:col-span-9';
export const TRANSACT_SIDE = 'xl:col-span-4 2xl:col-span-3';
