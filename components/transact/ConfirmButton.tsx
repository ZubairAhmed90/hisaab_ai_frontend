'use client';

import { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ConfirmButton({
  label,
  onConfirm,
  className,
}: {
  label: string;
  onConfirm: () => void | Promise<void>;
  className?: string;
}) {
  const [holding, setHolding] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHold = () => {
    if (loading) return;
    setHolding(true);
    timer.current = setTimeout(async () => {
      setHolding(false);
      setLoading(true);
      try {
        await onConfirm();
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const cancelHold = () => {
    if (timer.current) clearTimeout(timer.current);
    setHolding(false);
  };

  return (
    <button
      type="button"
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      disabled={loading}
      className={cn(
        'flex w-full items-center justify-center rounded-2xl py-4 text-base font-semibold text-white shadow-[0_4px_16px_rgba(24,95,165,0.28)] transition-colors',
        holding || loading ? 'bg-primary/90' : 'bg-primary hover:bg-primary/95',
        className,
      )}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <span>{label} — hold to confirm</span>
      )}
    </button>
  );
}
