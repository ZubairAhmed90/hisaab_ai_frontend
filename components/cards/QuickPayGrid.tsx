'use client';

import Link from 'next/link';
import { Flame, Smartphone, Wifi, Zap } from 'lucide-react';

const ITEMS = [
  { icon: Zap, label: 'Electricity', href: '/transact/bills', color: 'bg-amber-500/10 text-amber-600' },
  { icon: Flame, label: 'Gas', href: '/transact/bills', color: 'bg-orange-500/10 text-orange-600' },
  { icon: Smartphone, label: 'Mobile', href: '/transact/topup', color: 'bg-primary/10 text-primary' },
  { icon: Wifi, label: 'Internet', href: '/transact/bills', color: 'bg-violet-500/10 text-violet-600' },
];

export function QuickPayGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ITEMS.map(({ icon: Icon, label, color, href }) => (
        <Link
          key={label}
          href={href}
          className="flex flex-col items-center rounded-2xl bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
        >
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
            <Icon size={20} />
          </div>
          <span className="mt-2 text-sm font-semibold text-gray-900">{label}</span>
        </Link>
      ))}
    </div>
  );
}
