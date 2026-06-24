'use client';

import { Lightbulb, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAiTips } from '@/lib/hooks';
import { useAuthStore } from '@/lib/store';
import { cn, getCategoryEmoji } from '@/lib/utils';

const TIP_STYLES = [
  { gradient: 'from-lime/40 to-lime/5', accent: 'bg-lime text-black' },
  { gradient: 'from-primary/15 to-primary/5', accent: 'bg-primary/10 text-primary' },
  { gradient: 'from-accent/15 to-accent/5', accent: 'bg-accent/10 text-accent' },
];

// Display 3 personalized saving tips
export function TipsSection() {
  const lang = useAuthStore((s) => s.user?.preferred_language || 'en');
  const { data, isLoading, isError, refetch, isFetching } = useAiTips(lang);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <TipsHeader />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-3xl bg-card shadow-card" />
          ))}
        </div>
      </section>
    );
  }

  if (isError || !data?.tips?.length) {
    return (
      <section className="space-y-4">
        <TipsHeader />
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-center shadow-card">
          <Lightbulb size={28} className="mb-3 text-muted" />
          <p className="font-medium text-gray-900">Could not load tips</p>
          <p className="mt-1 text-sm text-muted">Check your connection and try again.</p>
          <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <TipsHeader
        category={data.category}
        aiPowered={data.aiPowered}
        isRefreshing={isFetching}
        onRefresh={() => refetch()}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {data.tips.map((tip: string, index: number) => {
          const style = TIP_STYLES[index % TIP_STYLES.length];
          return (
            <div
              key={index}
              className={cn(
                'relative overflow-hidden rounded-3xl bg-gradient-to-br p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
                style.gradient,
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={cn('flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold', style.accent)}>
                  {index + 1}
                </span>
                <Lightbulb size={16} className="text-muted/60" />
              </div>
              <p className="text-sm leading-relaxed text-gray-800">{tip}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TipsHeader({
  category,
  aiPowered = true,
  isRefreshing,
  onRefresh,
}: {
  category?: string;
  aiPowered?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime/30">
          <Sparkles size={18} className="text-gray-800" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Today&apos;s Tips</h2>
          {category ? (
            <p className="text-xs text-muted">
              Based on your {getCategoryEmoji(category)} {category} spending
              {!aiPowered && ' · offline mode'}
            </p>
          ) : (
            <p className="text-xs text-muted">Personalized money-saving advice</p>
          )}
        </div>
      </div>
      {onRefresh && (
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          Refresh
        </Button>
      )}
    </div>
  );
}
