import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CardVisual({
  card,
  holder,
  className,
}: {
  card: { last4: string; type: string; bank: string; network: string };
  holder: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative min-w-[280px] overflow-hidden rounded-3xl bg-gradient-to-br from-sidebar to-primary p-5 shadow-card',
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="relative flex items-center justify-between">
        <CreditCard size={28} className="text-white/90" />
        <span className="text-sm font-bold text-white">{card.network}</span>
      </div>
      <p className="relative mt-6 font-mono text-lg font-semibold tracking-widest text-white">
        •••• •••• •••• {card.last4}
      </p>
      <div className="relative mt-4 flex justify-between text-sm text-white/75">
        <span>{holder}</span>
        <span>
          {card.bank} · {card.type}
        </span>
      </div>
    </div>
  );
}
