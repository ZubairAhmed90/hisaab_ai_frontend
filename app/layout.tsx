import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { I18nProvider } from '@/lib/i18n';
import { QueryProvider } from '@/lib/query-client';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HisaabAI',
  description: "Pakistan's Smart Banking Companion",
};

// Root layout with font, metadata, providers, and toasts
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <I18nProvider>
            {children}
            <Toaster position="top-right" richColors />
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
