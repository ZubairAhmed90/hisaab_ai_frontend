'use client';

import { useEffect, useState } from 'react';
import { Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export function LogoutButton({ className }: Props) {
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmOpen]);

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => setConfirmOpen(true)}
        aria-label={t('common.logout')}
        className={cn(
          'shrink-0 gap-2 border border-[#E24B4A]/15 px-3.5 shadow-sm',
          'hover:border-[#E24B4A]/25 active:scale-[0.98]',
          className,
        )}
      >
        <Power className="h-4 w-4" strokeWidth={2.2} />
        <span>{t('common.logout')}</span>
      </Button>

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1A2E]/45 p-4 backdrop-blur-[2px]"
          onClick={() => setConfirmOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(26,26,46,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[#F0F0F2] bg-gradient-to-br from-[#FAFAFA] to-white px-5 py-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FCEBEB]">
                <Power className="h-5 w-5 text-[#E24B4A]" strokeWidth={2.2} />
              </div>
              <h3 id="logout-dialog-title" className="text-lg font-semibold text-[#1A1A2E]">
                {t('menu.logoutConfirmTitle')}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#86868B]">
                {t('menu.logoutConfirmBody')}
              </p>
            </div>
            <div className="flex gap-2 p-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1 gap-2"
                onClick={() => {
                  setConfirmOpen(false);
                  logout();
                }}
              >
                <Power className="h-4 w-4" strokeWidth={2.2} />
                {t('common.logout')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
