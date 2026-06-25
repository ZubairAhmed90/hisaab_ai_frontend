import { ArrowRight, TrendingUp } from 'lucide-react';
import { cn, formatPKR } from '@/lib/utils';

const ASSET_META: Record<string, { icon: string; color: string; label: string }> = {
  stock: { icon: '📈', color: 'from-blue-500/15 to-blue-500/5 border-blue-500/20', label: 'Stock' },
  gold: { icon: '🥇', color: 'from-amber-500/15 to-amber-500/5 border-amber-500/20', label: 'Gold' },
  tbill: { icon: '🏦', color: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/20', label: 'T-Bill' },
  usd: { icon: '💵', color: 'from-violet-500/15 to-violet-500/5 border-violet-500/20', label: 'USD' },
};

// Card showing hypothetical investment return for one asset
export function MirrorCard({
  asset,
  ticker,
  current_value,
  return_pct,
  overspend,
}: {
  asset: string;
  ticker: string;
  current_value: number;
  return_pct: number;
  overspend: number;
}) {
  const meta = ASSET_META[asset] || ASSET_META.stock;
  const gain = current_value - overspend;
  const positive = return_pct >= 0;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
        meta.color,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-xl shadow-sm">
            {meta.icon}
          </span>
          <div>
            <p className="font-semibold text-gray-900">{ticker || meta.label}</p>
            <p className="text-xs capitalize text-muted">{meta.label}</p>
          </div>
        </div>
        <span
          className={cn(
            'flex items-center gap-0.5 rounded-lg px-2 py-1 text-xs font-bold',
            positive ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger',
          )}
        >
          <TrendingUp size={12} />
          {positive ? '+' : ''}
          {return_pct.toFixed(1)}%
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="font-number font-medium text-muted">{formatPKR(overspend)}</span>
        <ArrowRight size={14} className="text-muted" />
        <span className="font-number font-bold text-gray-900">{formatPKR(current_value)}</span>
      </div>

      <p className="mt-2 text-xs text-muted">
        Potential gain:{' '}
        <span className={cn('font-semibold', positive ? 'text-success' : 'text-danger')}>
          {positive ? '+' : ''}
          {formatPKR(gain)}
        </span>
      </p>
    </div>
  );
}
