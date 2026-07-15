'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { AuthSync } from '@/components/shared/AuthSync';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { dir, isRtl } = useTranslation();

  return (
    <ProtectedRoute>
      <AuthSync />
      <div
        className={cn(
          'flex min-h-screen bg-surface',
          isRtl
            ? 'has-[aside:hover]:[&>div]:mr-64'
            : 'has-[aside:hover]:[&>div]:ml-64',
        )}
      >
        <Sidebar onNavigate={() => setMobileNavOpen(false)} />
        {mobileNavOpen ? (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-[#1A1A2E]/40 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        ) : null}
        <div
          className={cn(
            'flex min-h-screen flex-1 flex-col transition-[margin] duration-300 ease-out',
            isRtl ? 'mr-[72px]' : 'ml-[72px]',
          )}
        >
          <Topbar onMenuClick={() => setMobileNavOpen((open) => !open)} />
          <main dir={dir} className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
