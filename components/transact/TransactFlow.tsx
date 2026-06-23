'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TransactFlowHeader({
  steps,
  current,
  title,
}: {
  steps: { label: string; href?: string }[];
  current: number;
  title: string;
}) {
  return (
    <div className="space-y-4">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link href="/transact/send" className="hover:text-primary">
          Payments
        </Link>
        {steps.map((step, i) => (
          <span key={step.label} className="flex items-center gap-1">
            <ChevronRight size={14} />
            {step.href && i < current ? (
              <Link href={step.href} className="hover:text-primary">
                {step.label}
              </Link>
            ) : (
              <span className={cn(i === current && 'font-semibold text-gray-900')}>{step.label}</span>
            )}
          </span>
        ))}
      </nav>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
    </div>
  );
}

export function TransactFlowCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-3xl bg-card p-6 shadow-card lg:p-8', className)}>{children}</div>
  );
}
