'use client';

import { useEffect, useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { PAGE_TITLES } from '@/lib/nav';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

// Dashboard top bar with page title, user avatar, and logout
export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const initials = user?.name?.charAt(0)?.toUpperCase() || 'U';

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
      <header className="flex h-14 items-center justify-between border-b bg-white px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">{PAGE_TITLES[pathname] || 'HisaabAI'}</h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-sm text-gray-600 sm:inline">{user?.name}</span>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-white text-xs">{initials}</AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            title={t('common.logout')}
            aria-label={t('common.logout')}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-xl border border-transparent px-2.5',
              'text-sm font-medium text-[#86868B] transition-all duration-200',
              'hover:border-[#E24B4A]/20 hover:bg-[#FCEBEB] hover:text-[#E24B4A]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E24B4A]/30',
              'active:scale-[0.98]',
            )}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.logout')}</span>
          </button>
        </div>
      </header>

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
