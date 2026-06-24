'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function StepHeader({
  title,
  closeMode = 'back',
  backHref,
  dark = false,
}: {
  title: string;
  closeMode?: 'back' | 'close';
  backHref?: string;
  dark?: boolean;
}) {
  const router = useRouter();

  return (
    <div
      className={cn(
        'mb-2 flex items-center gap-3 px-6 pt-5',
        dark && 'absolute left-0 right-0 top-0 z-10 px-4 pt-4',
      )}
    >
      {closeMode === 'close' ? (
        <Button
          variant="ghost"
          size="icon"
          className={cn('rounded-xl', dark && 'text-white hover:bg-white/10')}
          onClick={() => router.push('/dashboard')}
        >
          <X size={20} />
        </Button>
      ) : backHref ? (
        <Link
          href={backHref}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'rounded-xl',
            dark && 'text-white hover:bg-white/10',
          )}
        >
          <ArrowLeft size={20} />
        </Link>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className={cn('rounded-xl', dark && 'text-white hover:bg-white/10')}
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </Button>
      )}
      {!dark ? <h1 className="text-lg font-semibold text-gray-900">{title}</h1> : null}
    </div>
  );
}
