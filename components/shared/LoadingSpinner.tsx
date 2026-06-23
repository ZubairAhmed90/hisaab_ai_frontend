import { cn } from '@/lib/utils';

const SIZES = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

// Centered spinning loading indicator
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-200 border-t-primary',
          SIZES[size],
        )}
      />
    </div>
  );
}
