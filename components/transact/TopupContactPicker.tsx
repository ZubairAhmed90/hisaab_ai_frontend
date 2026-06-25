'use client';

import { Loader2, Phone, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OPERATORS } from '@/lib/catalog';
import type { TopupContact } from '@/lib/topup-contacts';
import { PhoneLookupResult } from '@/lib/topup';
import { useTopupContacts } from '@/lib/hooks';

type Props = {
  mode: 'contacts' | 'manual';
  onModeChange: (mode: 'contacts' | 'manual') => void;
  phone: string;
  onPhoneChange: (phone: string) => void;
  selectedContactId: number | null;
  onSelectContact: (contact: TopupContact) => void;
  lookup: PhoneLookupResult | null;
  lookupLoading: boolean;
  onFetch: () => void;
  operatorId: number | null;
  onOperatorChange: (id: number) => void;
};

export function TopupContactPicker({
  mode,
  onModeChange,
  phone,
  onPhoneChange,
  selectedContactId,
  onSelectContact,
  lookup,
  lookupLoading,
  onFetch,
  operatorId,
  onOperatorChange,
}: Props) {
  const { data: contacts = [], isLoading } = useTopupContacts();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-xl bg-surface p-1">
        <button
          type="button"
          onClick={() => onModeChange('contacts')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors',
            mode === 'contacts' ? 'bg-card text-gray-900 shadow-sm' : 'text-muted',
          )}
        >
          <User size={16} /> Contacts
        </button>
        <button
          type="button"
          onClick={() => onModeChange('manual')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors',
            mode === 'manual' ? 'bg-card text-gray-900 shadow-sm' : 'text-muted',
          )}
        >
          <Phone size={16} /> Enter number
        </button>
      </div>

      {mode === 'contacts' ? (
        isLoading ? (
          <p className="text-sm text-muted">Loading saved numbers…</p>
        ) : contacts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface/50 p-6 text-center text-sm text-muted">
            No saved numbers yet. Switch to &quot;Enter number&quot; — we&apos;ll remember it after your first top-up.
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {contacts.map((c) => {
              const op = OPERATORS.find((o) => o.id === c.operatorId);
              const selected = selectedContactId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectContact(c)}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border p-4 text-left transition-all',
                    selected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border/50 bg-surface/30 hover:border-primary/25',
                  )}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">{c.name}</p>
                    <p className="text-xs text-muted">{c.phone}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: op?.color }}
                  >
                    {op?.name}
                  </span>
                </button>
              );
            })}
          </div>
        )
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="03XX XXXXXXX"
              className="h-12 flex-1 rounded-xl border border-border bg-background px-4 text-lg tracking-wide"
            />
            <button
              type="button"
              onClick={onFetch}
              disabled={phone.length !== 11 || lookupLoading}
              className="flex h-12 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white disabled:opacity-40"
            >
              {lookupLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Fetch
            </button>
          </div>
          {lookup ? (
            <div className="rounded-xl border border-success/30 bg-success/5 p-4">
              <p className="font-semibold text-gray-900">{lookup.name}</p>
              <p className="text-sm text-muted">
                {lookup.phone} ·{' '}
                <span className="font-medium text-primary">{lookup.operatorName}</span>
                {lookup.found ? ' · Saved contact' : ' · Network detected'}
              </p>
            </div>
          ) : null}
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Network</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {OPERATORS.map((op) => (
            <button
              key={op.id}
              type="button"
              onClick={() => onOperatorChange(op.id)}
              className={cn(
                'rounded-xl border-2 p-3 text-left transition-all',
                operatorId === op.id
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-surface hover:bg-surface/80',
              )}
            >
              <span className="mb-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: op.color }} />
              <p className="text-sm font-bold text-gray-900">{op.name}</p>
              <p className="text-[10px] text-muted">{op.prefixes}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
