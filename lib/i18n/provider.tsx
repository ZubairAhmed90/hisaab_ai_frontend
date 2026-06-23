'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { en } from './en';
import { ur } from './ur';

export type Lang = 'en' | 'ur';

export type TranslationKey = string;

const STORAGE_KEY = 'hisaab_lang';

function lookup(dict: typeof en, key: string): string {
  const value = key.split('.').reduce<unknown>((obj, part) => {
    if (obj && typeof obj === 'object' && part in obj) {
      return (obj as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
  return typeof value === 'string' ? value : key;
}

function interpolate(text: string, params?: Record<string, string | number>) {
  if (!params) return text;
  return Object.entries(params).reduce(
    (s, [k, v]) => s.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v)),
    text,
  );
}

type I18nContextValue = {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  setLang: (lang: Lang, opts?: { persistProfile?: boolean }) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLang(userLang?: string): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (stored === 'en' || stored === 'ur') return stored;
  if (userLang === 'ur' || userLang === 'en') return userLang;
  return 'en';
}

function applyDocumentLang(lang: Lang) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const token = useAuthStore((s) => s.token);
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    setLangState(readStoredLang(user?.preferred_language));
  }, [user?.preferred_language]);

  useEffect(() => {
    applyDocumentLang(lang);
  }, [lang]);

  const setLang = useCallback(
    (next: Lang, opts?: { persistProfile?: boolean }) => {
      setLangState(next);
      localStorage.setItem(STORAGE_KEY, next);
      applyDocumentLang(next);
      if (user) setUser({ ...user, preferred_language: next });
      if (opts?.persistProfile !== false && token) {
        api.put('/auth/profile', { preferred_language: next }).catch(() => undefined);
      }
    },
    [setUser, token, user],
  );

  const dict = lang === 'ur' ? ur : en;

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      dir: lang === 'ur' ? 'rtl' : 'ltr',
      isRtl: lang === 'ur',
      setLang,
      t: (key, params) => interpolate(lookup(dict, key), params),
    }),
    [dict, lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}

export function useGreeting() {
  const { t } = useTranslation();
  const hour = new Date().getHours();
  if (hour < 12) return t('dashboard.greetingMorning');
  if (hour < 17) return t('dashboard.greetingAfternoon');
  return t('dashboard.greetingEvening');
}
