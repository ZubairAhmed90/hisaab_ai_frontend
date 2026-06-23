'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect to dashboard or login based on stored auth token
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('hisaab_token');
    router.replace(token ? '/dashboard' : '/login');
  }, [router]);

  return null;
}
