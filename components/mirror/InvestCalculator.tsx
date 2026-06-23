'use client';

import { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMarket } from '@/lib/hooks';
import { cn, formatPKR } from '@/lib/utils';

const ASSETS = [
  { label: 'OGDC Stock', ticker: 'OGDC', type: 'stock' },
  { label: 'Gold', ticker: 'XAU', type: 'gold' },
  { label: 'T-Bill', ticker: 'TBILL', type: 'tbill' },
  { label: 'USD', ticker: 'USD', type: 'usd' },
];

const PERIOD_OPTIONS = [
  { value: '1m', label: '1 Month' },
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '12m', label: '12 Months' },
];

const PERIOD_FIELD: Record<string, string> = {
  '1m': 'change_30d',
  '3m': 'change_90d',
  '6m': 'change_180d',
  '12m': 'change_365d',
};

// Calculate projected investment return using cached market data
export function InvestCalculator({ defaultPeriod = '1m' }: { defaultPeriod?: string }) {
  const { data: market } = useMarket();
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('OGDC');
  const [period, setPeriod] = useState(defaultPeriod);
  const [result, setResult] = useState<{ projected: number; pct: number } | null>(null);

  const calculate = () => {
    const principal = Number(amount);
    if (!principal || principal <= 0) return;

    const pick = ASSETS.find((a) => a.ticker === asset)!;
    const row = market?.find(
      (m: { ticker: string; asset_type: string }) =>
        pick.type === 'usd' ? false : m.ticker === pick.ticker || m.asset_type === pick.type,
    );
    const field = PERIOD_FIELD[period];
    const pct = pick.type === 'usd' ? 3 : Number((row as Record<string, number>)?.[field] || 2);
    const projected = principal * (1 + pct / 100);
    setResult({ projected, pct });
  };

  return (
    <div className="sticky top-6 rounded-3xl bg-card p-5 shadow-card">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Calculator size={18} className="text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Investment Calculator</h3>
          <p className="text-xs text-muted">Project your returns</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted">Amount (Rs.)</Label>
          <Input
            type="number"
            placeholder="e.g. 10000"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setResult(null);
            }}
            className="rounded-xl border-border/60 bg-surface/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted">Asset</Label>
          <Select
            value={asset}
            onValueChange={(v) => {
              setAsset(v as string);
              setResult(null);
            }}
          >
            <SelectTrigger className="rounded-xl border-border/60 bg-surface/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSETS.map((a) => (
                <SelectItem key={a.ticker} value={a.ticker}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted">Time Period</Label>
          <Select
            value={period}
            onValueChange={(v) => {
              setPeriod(v as string);
              setResult(null);
            }}
          >
            <SelectTrigger className="rounded-xl border-border/60 bg-surface/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full gap-2 rounded-xl" onClick={calculate} disabled={!amount}>
          <TrendingUp size={16} /> Calculate Return
        </Button>

        {result && (
          <div
            className={cn(
              'rounded-2xl border p-4',
              result.pct >= 0
                ? 'border-success/20 bg-success/10'
                : 'border-danger/20 bg-danger/10',
            )}
          >
            <p className="text-xs font-medium text-muted">Projected outcome</p>
            <p className="font-number mt-1 text-lg font-bold text-gray-900">
              {formatPKR(Math.round(result.projected))}
            </p>
            <p className="mt-1 text-sm text-success">
              +{result.pct.toFixed(1)}% from {formatPKR(Number(amount))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
