'use client';

import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PAGE_TITLES } from '@/lib/nav';
import { useAuthStore } from '@/lib/store';

// Dashboard top bar with page title and user avatar
export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const initials = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">{PAGE_TITLES[pathname] || 'HisaabAI'}</h2>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-gray-600 sm:inline">{user?.name}</span>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-white text-xs">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
