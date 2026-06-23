'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Bot,
  CreditCard,
  Gift,
  LayoutDashboard,
  Lock,
  LogOut,
  Shield,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation, type TranslationKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';

const NAV: { href: string; icon: typeof LayoutDashboard; labelKey: TranslationKey }[] = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { href: '/transactions', icon: CreditCard, labelKey: 'nav.transactions' },
  { href: '/cards-bills', icon: Wallet, labelKey: 'nav.cardsBills' },
  { href: '/advisor', icon: Bot, labelKey: 'nav.advisor' },
  { href: '/mirror', icon: TrendingUp, labelKey: 'nav.mirror' },
  { href: '/invest', icon: BarChart3, labelKey: 'nav.invest' },
  { href: '/budgets', icon: Target, labelKey: 'nav.budgets' },
  { href: '/goals', icon: Trophy, labelKey: 'nav.goals' },
  { href: '/limits', icon: Lock, labelKey: 'nav.limits' },
  { href: '/partner', icon: Users, labelKey: 'nav.partner' },
  { href: '/offers', icon: Gift, labelKey: 'nav.offers' },
  { href: '/reports', icon: BarChart3, labelKey: 'nav.reports' },
  { href: '/settings', icon: Settings, labelKey: 'nav.settings' },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { t, isRtl } = useTranslation();
  const initials = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const items = [
    ...NAV,
    ...(user?.is_admin ? [{ href: '/admin', icon: Shield, labelKey: 'nav.admin' as TranslationKey }] : []),
  ];

  return (
    <aside
      className={cn(
        'group/sidebar fixed top-0 z-50 flex h-screen w-[72px] flex-col overflow-hidden py-4 shadow-xl',
        'border-white/5 bg-sidebar transition-[width,box-shadow] duration-300 ease-out',
        'hover:w-64 hover:shadow-2xl',
        isRtl ? 'right-0 border-l' : 'left-0 border-r',
      )}
    >
      <div className="mb-5 flex items-center gap-3 px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime shadow-[0_2px_12px_rgba(232,255,87,0.35)]">
          <span className="text-xs font-bold text-black">HA</span>
        </div>
        <div className="min-w-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
          <p className="truncate text-sm font-bold text-white">{t('app.name')}</p>
          <p className="truncate text-[10px] text-white/40">{t('app.tagline')}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-2">
        {items.map(({ href, icon: Icon, labelKey }) => {
          const active = pathname === href;
          const label = t(labelKey);
          return (
            <Link key={href} href={href} onClick={onNavigate} title={label} className="block">
              <div
                className={cn(
                  'group/item relative flex h-11 items-center justify-center rounded-xl transition-all duration-200',
                  'group-hover/sidebar:justify-start group-hover/sidebar:gap-3 group-hover/sidebar:px-3',
                  active
                    ? 'bg-lime text-sidebar shadow-[0_2px_12px_rgba(232,255,87,0.25)]'
                    : 'text-white/50 hover:bg-white/10 hover:text-white',
                  !active && (isRtl
                    ? 'hover:shadow-[inset_-3px_0_0_0_rgba(232,255,87,0.6)]'
                    : 'hover:shadow-[inset_3px_0_0_0_rgba(232,255,87,0.6)]'),
                )}
              >
                <Icon size={18} className={cn('shrink-0 transition-transform duration-200', !active && 'group-hover/item:scale-110')} />
                <span
                  className={cn(
                    'max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium',
                    'opacity-0 transition-all duration-300',
                    'group-hover/sidebar:max-w-[180px] group-hover/sidebar:opacity-100',
                  )}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-3 space-y-1 border-t border-white/10 px-2 pt-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2 group-hover/sidebar:px-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-lime text-xs font-bold text-black">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
            <p className="truncate text-sm font-medium text-white">{user?.name || t('common.user')}</p>
            <p className="truncate text-[11px] text-white/40">{user?.email || ''}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          title={t('common.logout')}
          className={cn(
            'flex h-11 w-full items-center justify-center rounded-xl text-white/50 transition-all duration-200',
            'hover:bg-red-500/15 hover:text-red-300',
            'group-hover/sidebar:justify-start group-hover/sidebar:gap-3 group-hover/sidebar:px-3',
          )}
        >
          <LogOut size={18} className="shrink-0" />
          <span
            className={cn(
              'max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium',
              'opacity-0 transition-all duration-300',
              'group-hover/sidebar:max-w-[180px] group-hover/sidebar:opacity-100',
            )}
          >
            {t('common.logout')}
          </span>
        </button>
      </div>
    </aside>
  );
}
