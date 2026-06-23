'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight, Shield, TrendingUp, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn, formatPKR, getCategoryColor, getCategoryEmoji } from '@/lib/utils';

export type PartnerLimitRow = {
  id?: number;
  category: string;
  limit: number;
  spent: number;
  pct?: number;
  exceeded?: boolean;
  is_hard_limit?: boolean;
  alert_at_percent?: number;
  owner_name?: string;
};

function LimitProgressRow({
  row,
  subtitle,
}: {
  row: PartnerLimitRow;
  subtitle?: string;
}) {
  const pct = row.pct ?? (row.limit > 0 ? Math.round((row.spent / row.limit) * 100) : 0);
  const exceeded = row.exceeded ?? row.spent > row.limit;
  const warning = !exceeded && pct >= (row.alert_at_percent ?? 80);

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
            style={{ backgroundColor: getCategoryColor(row.category) }}
          >
            {getCategoryEmoji(row.category)}
          </div>
          <div>
            <p className="font-semibold capitalize text-gray-900">{row.category}</p>
            {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : null}
            {row.is_hard_limit ? (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-danger">
                <Shield size={10} /> Hard limit
              </span>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <p className={cn('font-number text-sm font-bold', exceeded ? 'text-danger' : 'text-gray-900')}>
            {formatPKR(row.spent)}
          </p>
          <p className="text-xs text-muted">of {formatPKR(row.limit)}</p>
        </div>
      </div>
      <Progress
        value={Math.min(pct, 100)}
        className={cn(
          'mt-3 h-2',
          exceeded ? '[&>div]:bg-danger' : warning ? '[&>div]:bg-warning' : '[&>div]:bg-success',
        )}
      />
      <p className={cn('mt-1.5 text-xs font-medium', exceeded ? 'text-danger' : warning ? 'text-warning' : 'text-muted')}>
        {exceeded ? 'Limit exceeded' : `${pct}% used`}
      </p>
    </div>
  );
}

export function PartnerStatsGrid({
  stats,
}: {
  stats?: {
    limits_set_count?: number;
    limits_on_me_count?: number;
    total_monitored_spend?: number;
    categories_exceeded?: number;
    my_categories_exceeded?: number;
  };
}) {
  if (!stats) return null;

  const tiles = [
    {
      label: 'Limits you set',
      value: stats.limits_set_count ?? 0,
      icon: Shield,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Limits on you',
      value: stats.limits_on_me_count ?? 0,
      icon: Users,
      color: 'bg-violet-500/10 text-violet-600',
    },
    {
      label: 'Partner spend tracked',
      value: formatPKR(stats.total_monitored_spend ?? 0),
      icon: TrendingUp,
      color: 'bg-lime/40 text-gray-800',
      isMoney: true,
    },
    {
      label: 'Alerts',
      value: (stats.categories_exceeded ?? 0) + (stats.my_categories_exceeded ?? 0),
      icon: AlertTriangle,
      color: 'bg-warning/10 text-warning',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map(({ label, value, icon: Icon, color, isMoney }) => (
        <div key={label} className="rounded-2xl bg-card p-4 shadow-card">
          <div className={cn('mb-3 flex h-9 w-9 items-center justify-center rounded-xl', color)}>
            <Icon size={18} />
          </div>
          <p className={cn('font-bold text-gray-900', isMoney ? 'font-number text-lg' : 'text-2xl')}>
            {value}
          </p>
          <p className="mt-0.5 text-xs text-muted">{label}</p>
        </div>
      ))}
    </div>
  );
}

export function PartnerLimitsSection({
  title,
  description,
  limits,
  emptyMessage,
  emptyAction,
}: {
  title: string;
  description: string;
  limits: PartnerLimitRow[];
  emptyMessage: string;
  emptyAction?: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-muted">{description}</p>
        </div>
        {emptyAction}
      </div>
      {limits.length > 0 ? (
        <div className="space-y-3">
          {limits.map((row) => (
            <LimitProgressRow
              key={`${row.category}-${row.id ?? row.owner_name}`}
              row={row}
              subtitle={row.owner_name ? `Set by ${row.owner_name}` : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-4 py-8 text-center text-sm text-muted">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

export function PartnerLinkedHero({
  name,
  email,
  account,
  wallet,
  accountBalance,
}: {
  name: string;
  email?: string;
  account?: string | null;
  wallet?: number;
  accountBalance?: number;
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#1568a0] to-sidebar p-6 text-white shadow-card">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-lime/20" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime text-xl font-bold text-sidebar shadow-lg">
            {initials}
          </div>
          <div>
            <p className="text-sm text-white/70">Linked partner</p>
            <p className="text-2xl font-bold tracking-tight">{name}</p>
            {email ? <p className="mt-0.5 text-sm text-white/80">{email}</p> : null}
            {account ? (
              <p className="mt-1 font-mono text-xs text-lime/90">{account}</p>
            ) : null}
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" /> Active connection
            </p>
          </div>
        </div>
        {(wallet != null || accountBalance != null) && (
          <div className="flex gap-3">
            {wallet != null && (
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs text-white/70">Wallet</p>
                <p className="font-number text-lg font-bold">{formatPKR(wallet)}</p>
              </div>
            )}
            {accountBalance != null && (
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs text-white/70">Account</p>
                <p className="font-number text-lg font-bold">{formatPKR(accountBalance)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function PartnerEmptyState({ linkBanner }: { linkBanner: React.ReactNode }) {
  const steps = [
    { n: 1, title: 'Link by email', desc: 'Enter your partner’s HisaabAI registered email' },
    { n: 2, title: 'Set shared limits', desc: 'Cap categories like shopping, food, or transport' },
    { n: 3, title: 'Track together', desc: 'See their spend vs limits — no private transaction details' },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center shadow-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Users size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No partner linked yet</h3>
          <p className="mt-2 max-w-md text-sm text-muted">
            Connect with your spouse or family member to share spending limits and stay aligned on
            household finances.
          </p>
          <div className="mt-6 w-full">{linkBanner}</div>
        </div>
      </div>
      <div className="space-y-3 lg:col-span-5">
        <h3 className="text-sm font-semibold text-gray-900">How it works</h3>
        {steps.map(({ n, title, desc }) => (
          <div
            key={n}
            className="flex gap-3 rounded-2xl bg-card p-4 shadow-card"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime text-sm font-bold text-sidebar">
              {n}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{title}</p>
              <p className="text-xs text-muted">{desc}</p>
            </div>
          </div>
        ))}
        <Link
          href="/limits"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Learn about spending limits <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
