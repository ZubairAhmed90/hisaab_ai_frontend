'use client';

import { useEffect } from 'react';
import { useMe } from '@/lib/hooks';
import { useAuthStore } from '@/lib/store';

/** Keeps auth store balances in sync after payments and trades. */
export function AuthSync() {
  const { data } = useMe();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (!data) return;
    const current = useAuthStore.getState().user;
    if (!current) return;
    if (
      current.wallet_balance === data.wallet_balance &&
      current.account_balance === data.account_balance &&
      current.account_number === data.account_number
    ) {
      return;
    }
    setUser({ ...current, ...data });
  }, [data, setUser]);

  return null;
}
