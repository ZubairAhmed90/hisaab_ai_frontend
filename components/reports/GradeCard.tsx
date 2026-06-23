import { Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const GRADE_STYLES: Record<string, { text: string; bg: string; message: string }> = {
  'A+': { text: 'text-success', bg: 'from-lime/50 to-lime/10', message: 'Outstanding financial discipline!' },
  A: { text: 'text-success', bg: 'from-lime/40 to-lime/10', message: 'Excellent money management!' },
  'B+': { text: 'text-primary', bg: 'from-primary/20 to-primary/5', message: 'Good progress — keep it up!' },
  B: { text: 'text-primary', bg: 'from-primary/15 to-primary/5', message: 'Solid performance this month.' },
  C: { text: 'text-warning', bg: 'from-amber-500/20 to-amber-500/5', message: 'Room for improvement ahead.' },
  D: { text: 'text-orange-600', bg: 'from-orange-500/20 to-orange-500/5', message: 'Time to tighten your budget.' },
  F: { text: 'text-danger', bg: 'from-danger/15 to-danger/5', message: 'Let\'s rebuild your financial habits.' },
};

// Large grade display card for monthly report
export function GradeCard({ grade, month }: { grade: string; month: string }) {
  const monthName = new Date(`${month}-01`).toLocaleDateString('en-PK', {
    month: 'long',
    year: 'numeric',
  });
  const style = GRADE_STYLES[grade] || {
    text: 'text-gray-600',
    bg: 'from-gray-500/15 to-gray-500/5',
    message: 'Your monthly financial snapshot',
  };

  return (
    <div
      className={cn(
        'relative flex h-full flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br p-8 shadow-card',
        style.bg,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-black/[0.03]" />
      <div className="relative flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 shadow-sm">
          <Award size={24} className={style.text} />
        </div>
        <span className={cn('font-number text-7xl font-bold tracking-tight', style.text)}>{grade}</span>
        <p className="mt-2 text-sm font-medium text-gray-700">{monthName}</p>
        <p className="mt-3 max-w-xs text-sm text-muted">{style.message}</p>
      </div>
    </div>
  );
}
