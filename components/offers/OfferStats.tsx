import { Calendar, Gift, Sparkles, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

type Offer = {
  valid_until: string;
  target_category: string;
  score?: number;
};

// Summary stats for the offers page
export function OfferStats({ offers }: { offers: Offer[] }) {
  const categories = new Set(offers.map((o) => o.target_category)).size;
  const expiringSoon = offers.filter((o) => {
    const days = Math.ceil((new Date(o.valid_until).getTime() - Date.now()) / 86400000);
    return days <= 7 && days >= 0;
  }).length;
  const avgMatch =
    offers.length > 0
      ? Math.round(offers.reduce((s, o) => s + (o.score || 0), 0) / offers.length)
      : 0;

  const stats = [
    {
      label: 'Available',
      value: offers.length.toString(),
      icon: Gift,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Categories',
      value: categories.toString(),
      icon: Tag,
      color: 'bg-accent/10 text-accent',
    },
    {
      label: 'Expiring Soon',
      value: expiringSoon.toString(),
      icon: Calendar,
      color: expiringSoon > 0 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success',
    },
    {
      label: 'Avg Match',
      value: offers.length ? `${avgMatch}%` : '—',
      icon: Sparkles,
      color: 'bg-lime/30 text-gray-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-3xl bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
        >
          <div className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', color)}>
              <Icon size={18} strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-muted">{label}</p>
              <p className="font-number mt-0.5 truncate text-lg font-bold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
