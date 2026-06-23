import { create } from 'zustand';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  preferred_language: 'en' | 'ur';
  monthly_income: number;
  wallet_balance?: number;
  account_balance?: number;
  account_number?: string | null;
  is_admin?: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

// Zustand store — global auth state
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setUser: (user) => {
    localStorage.setItem('hisaab_user', JSON.stringify(user));
    set({ user });
  },
  setToken: (token) => {
    localStorage.setItem('hisaab_token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('hisaab_token');
    localStorage.removeItem('hisaab_user');
    localStorage.removeItem('hisaab_lang');
    set({ user: null, token: null });
    toast.success('Logged out successfully');
    window.location.href = '/login';
  },
}));

// Re-hydrate token and user from localStorage on app load
if (typeof window !== 'undefined') {
  const savedToken = localStorage.getItem('hisaab_token');
  if (savedToken) useAuthStore.getState().setToken(savedToken);
  const savedUser = localStorage.getItem('hisaab_user');
  if (savedUser) useAuthStore.getState().setUser(JSON.parse(savedUser));
}
