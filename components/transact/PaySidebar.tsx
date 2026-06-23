'use client';

import Link from 'next/link';
import { LucideIcon, ScanLine, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

function ActionCard({
  href,
  label,
  desc,
  icon: Icon,
  accent,
}: {
  href: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card-hover"
    >
      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', accent)}>
        <Icon size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-muted">{desc}</p>
      </div>
      <span className="text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
        →
      </span>
    </Link>
  );
}

export function PaySidebar() {
  return (
    <div className="space-y-3">
      <ActionCard
        href="/transact/scan"
        label="Scan to Pay"
        desc="Use camera or upload a QR image"
        icon={ScanLine}
        accent="bg-primary/10 text-primary"
      />
      <ActionCard
        href="/transact/beneficiary"
        label="Add Beneficiary"
        desc="Save a new contact for transfers"
        icon={UserPlus}
        accent="bg-accent/10 text-accent"
      />
    </div>
  );
}
