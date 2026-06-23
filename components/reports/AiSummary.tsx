'use client';

import { Sparkles } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

// AI-generated monthly report summary card
export function AiSummary({
  report,
}: {
  report: { summary_en: string; summary_ur?: string };
}) {
  const lang = useAuthStore((s) => s.user?.preferred_language || 'en');
  const text = lang === 'ur' && report.summary_ur ? report.summary_ur : report.summary_en;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-white p-6 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime/30">
          <Sparkles size={18} className="text-gray-800" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Summary</h3>
          <p className="text-xs text-muted">Personalized insights for this month</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-gray-700">{text}</p>
    </div>
  );
}
