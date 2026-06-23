'use client';

import { useRouter } from 'next/navigation';
import { LucideIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function TransactHero({
  title,
  subtitle,
  icon: Icon,
  variant = 'send',
  onClose,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  variant?: 'send' | 'request' | 'bills' | 'topup';
  onClose?: () => void;
}) {
  const router = useRouter();
  const gradients = {
    send: 'from-primary via-[#1a6fbd] to-sidebar',
    request: 'from-[#1D9E75] via-accent to-sidebar',
    bills: 'from-amber-500 via-orange-500 to-sidebar',
    topup: 'from-violet-600 via-primary to-sidebar',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br px-6 pb-8 pt-5 text-white',
        gradients[variant],
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-lime/10" />
      <Button
        variant="ghost"
        size="icon"
        className="relative mb-4 rounded-xl text-white hover:bg-white/10"
        onClick={onClose ?? (() => router.push('/dashboard'))}
      >
        <X size={20} />
      </Button>
      <div className="relative flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime/20 backdrop-blur">
          <Icon size={28} className="text-lime" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-white/75">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
