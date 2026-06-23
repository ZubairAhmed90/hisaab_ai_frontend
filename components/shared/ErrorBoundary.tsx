'use client';

import { useEffect } from 'react';

// Friendly error UI when a dashboard page crashes
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <p className="font-medium text-red-500">Something went wrong</p>
      <p className="text-sm text-gray-500">{error.message}</p>
      <button type="button" onClick={reset} className="text-sm text-blue-600 underline">
        Try again
      </button>
    </div>
  );
}
