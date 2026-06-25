'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { Button } from '@/components/ui/button';
import {
  useMarkNotificationRead,
  useMoneyRequests,
  useNotifications,
  useRespondMoneyRequest,
} from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';
import { cn, formatPKR } from '@/lib/utils';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const notifications = useNotifications();
  const incomingRequests = useMoneyRequests('incoming');
  const respond = useRespondMoneyRequest();
  const markRead = useMarkNotificationRead();

  const pending = (incomingRequests.data || []).filter((r: { status: string }) => r.status === 'pending');

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('notifications.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('notifications.subtitle')}</p>
      </div>

      {incomingRequests.isLoading || notifications.isLoading ? (
        <SkeletonCard className="h-40 w-full" />
      ) : null}

      {pending.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wide text-muted">{t('notifications.moneyRequests')}</h2>
          {pending.map((req: {
            id: number;
            requester_name: string;
            amount: number | string;
            reason?: string;
          }) => (
            <div key={req.id} className="rounded-2xl border border-border/50 bg-card p-5 shadow-card">
              <p className="font-semibold text-gray-900">{req.requester_name}</p>
              <p className="mt-1 text-sm text-muted">
                Requested {formatPKR(Number(req.amount))}
                {req.reason ? ` — ${req.reason}` : ''}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  className="flex-1 rounded-xl"
                  disabled={respond.isPending}
                  onClick={() => respond.mutate({ id: req.id, action: 'accept' })}
                >
                  {t('notifications.pay')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  disabled={respond.isPending}
                  onClick={() => respond.mutate({ id: req.id, action: 'decline' })}
                >
                  {t('notifications.decline')}
                </Button>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      <section className="space-y-3">
        {(notifications.data || []).length === 0 && !notifications.isLoading ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface/50 py-16 text-center">
            <Bell size={40} className="mx-auto text-muted" />
            <p className="mt-3 text-sm text-muted">{t('notifications.empty')}</p>
            <Link href="/transact/request" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
              Request money
            </Link>
          </div>
        ) : (
          (notifications.data || []).map((item: {
            id: number;
            title: string;
            body: string;
            is_read: boolean;
            created_at: string;
          }) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (!item.is_read) markRead.mutate(item.id);
              }}
              className={cn(
                'w-full rounded-2xl border border-border/50 p-4 text-left shadow-card transition-all hover:-translate-y-0.5',
                item.is_read ? 'bg-card' : 'bg-lime/15',
              )}
            >
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.body}</p>
              <p className="mt-2 text-xs text-muted">{new Date(item.created_at).toLocaleString()}</p>
            </button>
          ))
        )}
      </section>
    </div>
  );
}
