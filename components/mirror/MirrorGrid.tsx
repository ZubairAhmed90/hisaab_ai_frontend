import { MirrorCard } from '@/components/mirror/MirrorCard';

// Grid of investment mirror cards for all assets
export function MirrorGrid({
  overspend,
  investments,
}: {
  overspend: number;
  investments: { asset: string; ticker: string; current_value: number; return_pct: number }[];
}) {
  if (!investments.length) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">If you had invested instead</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {investments.map((item) => (
          <MirrorCard key={`${item.asset}-${item.ticker || 'default'}`} {...item} overspend={overspend} />
        ))}
      </div>
    </div>
  );
}
