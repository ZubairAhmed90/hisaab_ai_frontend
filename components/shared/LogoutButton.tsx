'use client';

import { useEffect, useState } from 'react';
import { LogOut, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type Props = {
  /** Icon-only power button for page headers */
  compact?: boolean;
  className?: string;
};

export function LogoutButton({ compact = true, className }: Props) {
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
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        title={t('common.logout')}
        aria-label={t('common.logout')}
        className={cn(
          compact
            ? [
                'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                'bg-[#FCEBEB] text-[#E24B4A] shadow-sm',
                'transition-all duration-200 hover:bg-[#E24B4A]/12 hover:shadow-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E24B4A]/30',
                'active:scale-[0.96]',
              ]
            : [
                'inline-flex h-9 items-center gap-2 rounded-xl border border-transparent px-2.5',
                'text-sm font-medium text-[#86868B] transition-all duration-200',
                'hover:border-[#E24B4A]/20 hover:bg-[#FCEBEB] hover:text-[#E24B4A]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E24B4A]/30',
                'active:scale-[0.98]',
              ],
          className,
        )}
      >
        <Power className={cn(compact ? 'h-[18px] w-[18px]' : 'h-4 w-4')} strokeWidth={2.2} />
        {!compact ? <span className="hidden sm:inline">{t('common.logout')}</span> : null}
      </button>

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
                <LogOut className="h-5 w-5 text-[#E24B4A]" />
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
                <LogOut className="h-4 w-4" />
                {t('common.logout')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
