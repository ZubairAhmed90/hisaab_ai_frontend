import { cn } from '@/lib/utils';

// Pulsing gray placeholder shown while data is loading
export default function SkeletonCard({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-gray-200', className)} />;
}
