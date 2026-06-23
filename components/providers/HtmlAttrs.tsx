'use client';

import { useEffect } from 'react';

// Set html lang and dir from stored language preference
export function HtmlAttrs() {
  useEffect(() => {
    const lang = localStorage.getItem('hisaab_lang') || 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
  }, []);

  return null;
}
