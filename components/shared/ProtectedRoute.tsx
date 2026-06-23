'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuthStore } from '@/lib/store';

// Redirect to login if no auth token is present
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('hisaab_token')) router.push('/login');
  }, [router]);

  if (!token && typeof window !== 'undefined' && !localStorage.getItem('hisaab_token')) {
    return <LoadingSpinner size="lg" />;
  }

  return <>{children}</>;
}
