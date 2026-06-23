'use client';

import Link from 'next/link';
import { LanguageToggle } from '@/components/auth/LanguageToggle';
import { useTranslation } from '@/lib/i18n';

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="auth-apple relative flex min-h-screen flex-col overflow-hidden bg-surface font-sans">
      {/* ── Branded ambient background ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-[#eef5f0] to-[#e8f0fa]" />

        {/* primary blue orb */}
        <div className="auth-orb auth-orb-a absolute -left-[10%] top-[-10%] h-[520px] w-[520px] rounded-full bg-primary/20 blur-[90px]" />
        {/* lime orb */}
        <div className="auth-orb auth-orb-b absolute right-[-8%] top-[15%] h-[440px] w-[440px] rounded-full bg-lime/35 blur-[80px]" />
        {/* accent green orb */}
        <div className="auth-orb auth-orb-c absolute bottom-[-12%] left-[25%] h-[480px] w-[480px] rounded-full bg-accent/18 blur-[100px]" />
        {/* sidebar tint — depth */}
        <div className="absolute bottom-0 right-0 h-[40vh] w-[50vw] rounded-tl-[100%] bg-sidebar/[0.04]" />

        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(24,95,165,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(24,95,165,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* lime accent line top */}
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-lime to-transparent opacity-80" />
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/login" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-[12px] bg-sidebar shadow-[0_4px_16px_rgba(26,26,46,0.25)] ring-2 ring-lime/30 transition-all group-hover:ring-lime/50">
            <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-primary/40 to-accent/30 opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="relative text-[12px] font-bold tracking-tight text-lime">HA</span>
          </div>
          <div>
            <span className="block text-[17px] font-bold tracking-[-0.02em] text-sidebar">{t('app.name')}</span>
            <span className="block text-[11px] font-medium text-muted">{t('app.tagline')}</span>
          </div>
        </Link>
        <LanguageToggle className="max-w-[152px] rounded-full border border-white/60 bg-white/75 p-0.5 shadow-sm backdrop-blur-xl" />
      </header>

      {/* ── Main — form floats directly on bg (Apple-style) ── */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-2 sm:px-8">
        <div className="w-full max-w-[400px]">{children}</div>

        {/* brand trust chips */}
        <div className="mt-8 hidden flex-wrap items-center justify-center gap-3 sm:flex">
          {[
            { dot: 'bg-lime', label: 'PKR Wallet' },
            { dot: 'bg-primary', label: 'AI Advisor' },
            { dot: 'bg-accent', label: 'Secure Banking' },
          ].map(({ dot, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-sidebar/70 backdrop-blur-sm"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
              {label}
            </span>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 px-6 pb-8 text-center sm:px-10">
        <p className="text-[12px] leading-relaxed text-muted">{t('app.taglineLong')}</p>
        <p className="mt-2 text-[11px] text-muted/70">
          © {new Date().getFullYear()} {t('app.name')} ·{' '}
          <span className="text-primary">Pakistan</span>
        </p>
      </footer>
    </div>
  );
}
