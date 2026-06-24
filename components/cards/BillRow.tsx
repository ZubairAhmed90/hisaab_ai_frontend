import { Flame, LucideIcon, Smartphone, Wifi, Zap } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn, formatPKR } from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  smartphone: Smartphone,
  wifi: Wifi,
  flame: Flame,
};

export function BillRow({
  bill,
}: {
  bill: { id: number; name: string; dueIn: number; amount: number; icon: string };
}) {
  const Icon = ICONS[bill.icon] || Zap;
  const dueColor =
    bill.dueIn < 3 ? 'text-danger' : bill.dueIn < 7 ? 'text-warning' : 'text-muted';

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon size={20} className="text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">{bill.name}</p>
        <p className={cn('text-xs font-medium', dueColor)}>Due in {bill.dueIn} days</p>
      </div>
      <p className="font-number shrink-0 font-bold text-gray-900">{formatPKR(bill.amount)}</p>
      <Link
        href={`/transact/bills/details?billerName=${encodeURIComponent(bill.name)}&amount=${bill.amount}`}
        className={cn(buttonVariants({ size: 'sm' }), 'shrink-0 rounded-xl')}
      >
        Pay
      </Link>
    </div>
  );
}
