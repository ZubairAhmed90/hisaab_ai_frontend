'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { dir, isRtl } = useTranslation();

  return (
    <ProtectedRoute>
      <div
        className={cn(
          'flex min-h-screen bg-surface',
          isRtl
            ? 'has-[aside:hover]:[&>main]:mr-64'
            : 'has-[aside:hover]:[&>main]:ml-64',
        )}
      >
        <Sidebar />
        <main
          dir={dir}
          className={cn(
            'min-h-screen flex-1 overflow-y-auto p-6 transition-[margin] duration-300 ease-out',
            isRtl ? 'mr-[72px]' : 'ml-[72px]',
          )}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
