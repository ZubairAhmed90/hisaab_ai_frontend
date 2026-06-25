'use client';

import { useState } from 'react';
import { Check, Copy, Gift, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRedeemOffer } from '@/lib/hooks';
import { cn, formatDate, getCategoryEmoji } from '@/lib/utils';

const CATEGORY_GRADIENTS: Record<string, string> = {
  food: 'from-orange-500/20 to-orange-500/5 border-orange-500/25',
  transport: 'from-blue-500/20 to-blue-500/5 border-blue-500/25',
  shopping: 'from-pink-500/20 to-pink-500/5 border-pink-500/25',
  utilities: 'from-violet-500/20 to-violet-500/5 border-violet-500/25',
  health: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/25',
  entertainment: 'from-amber-500/20 to-amber-500/5 border-amber-500/25',
  other: 'from-primary/15 to-primary/5 border-primary/20',
};

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

// Offer card with redeem action and promo code display
export function OfferCard({
  offer,
}: {
  offer: {
    id: number;
    title: string;
    description?: string;
    company?: string;
    company_name?: string;
    valid_until: string;
    target_category?: string;
    score?: number;
  };
}) {
  const [promoCode, setPromoCode] = useState('');
  const [showPromo, setShowPromo] = useState(false);
  const [copied, setCopied] = useState(false);
  const redeem = useRedeemOffer();

  const brand = offer.company || offer.company_name || 'Offer';
  const category = offer.target_category || 'other';
  const gradient = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.other;
  const daysLeft = daysUntil(offer.valid_until);
  const expiringSoon = daysLeft <= 7 && daysLeft >= 0;

  const handleRedeem = () => {
    redeem.mutate(offer.id, {
      onSuccess: (res) => {
        const code = res.data.data.promo_code || 'N/A';
        setPromoCode(code);
        setShowPromo(true);
        toast.success('Offer redeemed!');
      },
      onError: () => toast.error('Something went wrong'),
    });
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(promoCode);
    setCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-gradient-to-br p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
          gradient,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm">
              {getCategoryEmoji(category)}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">{brand}</p>
              {offer.score != null && offer.score > 0 && (
                <span className="mt-0.5 inline-flex items-center gap-1 rounded-lg bg-lime/40 px-2 py-0.5 text-xs font-semibold text-gray-800">
                  <Sparkles size={10} /> {offer.score}% match
                </span>
              )}
            </div>
          </div>
          {expiringSoon && (
            <span className="shrink-0 rounded-lg bg-warning/15 px-2 py-1 text-xs font-medium text-warning">
              {daysLeft}d left
            </span>
          )}
        </div>

        <h3 className="mt-3 font-semibold leading-snug text-gray-900">{offer.title}</h3>

        {offer.description && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{offer.description}</p>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span className="capitalize">{getCategoryEmoji(category)} {category}</span>
          <span>Expires {formatDate(offer.valid_until)}</span>
        </div>

        <Button
          className="mt-4 w-full gap-2 rounded-xl"
          onClick={handleRedeem}
          disabled={redeem.isPending}
        >
          <Gift size={16} />
          {redeem.isPending ? 'Redeeming...' : 'Redeem Offer'}
        </Button>
      </div>

      <Dialog open={showPromo} onOpenChange={setShowPromo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift size={18} className="text-primary" /> Your Promo Code
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted">Use this code at checkout for {brand}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 rounded-2xl bg-surface px-4 py-3 text-center font-mono text-lg font-bold tracking-wider text-gray-900">
              {promoCode}
            </div>
            <Button variant="outline" size="icon" onClick={copyCode} className="shrink-0 rounded-xl">
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
