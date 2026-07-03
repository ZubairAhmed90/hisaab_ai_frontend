'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SkeletonCard from '@/components/shared/SkeletonCard';
import { useBuyStock, useMarket, usePortfolio, useSellStock, useStockTrades } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';
import { cn, formatPKR } from '@/lib/utils';

export default function InvestPage() {
  const { t } = useTranslation();
  const portfolio = usePortfolio();
  const market = useMarket();
  const buyStock = useBuyStock();
  const sellStock = useSellStock();
  const [selected, setSelected] = useState<string | null>(null);
  const [qty, setQty] = useState('1');
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const trades = useStockTrades(selected, 7);
  const walletBefore = portfolio.data?.wallet_balance || 0;

  if (portfolio.isLoading || market.isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard className="h-24 w-full" />
        <SkeletonCard className="h-96 w-full" />
      </div>
    );
  }

  const stocks = (market.data || []).filter((m: { asset_type: string }) => m.asset_type === 'stock');
  const holdings = portfolio.data?.holdings || [];
  const holdingMap = Object.fromEntries(holdings.map((h: { ticker: string; quantity: number }) => [h.ticker, h.quantity]));
  const selectedStock = stocks.find((s: { ticker: string }) => s.ticker === selected);
  const price = selectedStock ? Number(selectedStock.price_pkr) : 0;
  const quantity = Math.max(1, parseInt(qty, 10) || 1);
  const total = price * quantity;
  const owned = selected ? (holdingMap[selected] || 0) : 0;

  const execute = async () => {
    if (!selected) return;
    try {
      if (mode === 'buy') {
        await buyStock.mutateAsync({ ticker: selected, quantity });
        toast.success(`Bought ${quantity} ${selected}`, {
          description: `Wallet: ${formatPKR(walletBefore)} → ${formatPKR(walletBefore - total)}`,
        });
      } else {
        await sellStock.mutateAsync({ ticker: selected, quantity });
        toast.success(`Sold ${quantity} ${selected}`, {
          description: `${formatPKR(total)} to wallet · ${formatPKR(walletBefore)} → ${formatPKR(walletBefore + total)}`,
        });
      }
      await portfolio.refetch();
      trades.refetch();
      setQty('1');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Trade failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('invest.title')}</h1>
        <p className="mt-1 text-sm text-muted">
          {t('invest.wallet')}: {formatPKR(portfolio.data?.wallet_balance || 0)} · {t('invest.account')}:{' '}
          {formatPKR(portfolio.data?.account_balance || 0)}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-2">
          {stocks.map((s: { ticker: string; price_pkr: number; change_1d: number }) => {
            const meta = holdings.find((h: { ticker: string }) => h.ticker === s.ticker);
            const change = Number(s.change_1d || 0);
            return (
              <button
                key={s.ticker}
                type="button"
                onClick={() => setSelected(s.ticker)}
                className={cn(
                  'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all',
                  selected === s.ticker ? 'border-primary bg-primary/5' : 'border-border/50 bg-card hover:border-primary/20',
                )}
              >
                <div>
                  <p className="font-semibold text-gray-900">{s.ticker}</p>
                  <p className="text-xs text-muted">
                    Rs {Number(s.price_pkr).toFixed(2)}
                    {meta ? ` · You own ${meta.quantity} shares` : ''}
                  </p>
                </div>
                <span className={cn('text-sm font-bold', change >= 0 ? 'text-success' : 'text-danger')}>
                  {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-5 rounded-3xl bg-card p-6 shadow-card">
          {selected && selectedStock ? (
            <>
              <h2 className="text-lg font-bold">{selected}</h2>
              <p className="text-sm text-muted">Rs {price.toFixed(2)} per share</p>
              <p className="mt-1 text-xs text-muted">You hold: {owned} shares</p>

              <div className="mt-4 flex gap-2">
                {(['buy', 'sell'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={cn(
                      'flex-1 rounded-xl py-2 text-sm font-semibold capitalize',
                      mode === m ? 'bg-lime text-gray-900' : 'bg-surface text-muted',
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <label className="mt-4 block text-sm font-medium">Quantity</label>
              <Input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="mt-1"
              />
              <p className="mt-3 font-number text-xl font-bold">{formatPKR(total)}</p>

              <Button
                className="mt-4 w-full"
                onClick={execute}
                disabled={buyStock.isPending || sellStock.isPending || (mode === 'sell' && owned < quantity)}
              >
                {mode === 'buy' ? t('invest.buy') : t('invest.sellToWallet')}
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted">Select a stock to buy or sell</p>
          )}

          {holdings.length > 0 ? (
            <div className="mt-8 border-t border-border/50 pt-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-muted">{t('invest.holdings')}</h3>
              <div className="mt-3 space-y-2">
                {holdings.map((h: { ticker: string; quantity: number; return_pct: number }) => (
                  <button
                    key={h.ticker}
                    type="button"
                    onClick={() => setSelected(h.ticker)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-all',
                      selected === h.ticker ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-primary/25',
                    )}
                  >
                    <span className="font-semibold">{h.ticker} · {h.quantity} sh</span>
                    <span className={cn('font-bold', h.return_pct >= 0 ? 'text-success' : 'text-danger')}>
                      {h.return_pct >= 0 ? '+' : ''}{h.return_pct}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {selected && (trades.data?.length ?? 0) > 0 ? (
            <div className="mt-6 border-t border-border/50 pt-6">
              <h3 className="text-sm font-bold text-gray-900">Trade history — {selected}</h3>
              <p className="text-xs text-muted">Last 7 days</p>
              <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-sm">
                {trades.data.map((tr: { id: number; side: string; quantity: number; price_pkr: number; created_at: string; wallet_balance_before?: number; wallet_balance_after?: number }) => (
                  <li key={tr.id} className="rounded-lg bg-surface px-3 py-2">
                    <p className={cn('font-semibold capitalize', tr.side === 'buy' ? 'text-success' : 'text-danger')}>
                      {tr.side} {Number(tr.quantity)} @ Rs {Number(tr.price_pkr).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted">{new Date(tr.created_at).toLocaleString()}</p>
                    {tr.wallet_balance_before != null ? (
                      <p className="text-xs text-muted">
                        Wallet: {formatPKR(tr.wallet_balance_before)} → {formatPKR(tr.wallet_balance_after ?? tr.wallet_balance_before)}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
