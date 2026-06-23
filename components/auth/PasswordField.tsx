'use client';

import Link from 'next/link';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { getPasswordChecks, PASSWORD_MIN, passwordStrength } from '@/lib/auth/validation';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const fieldShell =
  'flex h-[50px] items-center gap-2.5 rounded-xl border bg-white/85 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-200';

const fieldFocus = 'border-primary/45 bg-white shadow-[0_0_0_4px_rgba(24,95,165,0.1)]';
const fieldIdle = 'border-[#d2d2d7]/90 hover:border-[#b8b8bd]';
const fieldError = 'border-[#ff3b30] bg-white shadow-[0_0_0_4px_rgba(255,59,48,0.1)]';

function AuthFieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 pl-1 text-[13px] leading-snug text-[#ff3b30]">
      <AlertCircle size={14} className="mt-0.5 shrink-0" strokeWidth={2} />
      <span>{message}</span>
    </p>
  );
}

export function PasswordRequirements({ value }: { value: string }) {
  const { t } = useTranslation();
  if (!value) return null;

  const checks = getPasswordChecks(value);
  const strength = passwordStrength(value);
  const strengthLabel =
    strength === 'weak'
      ? t('auth.validation.strengthWeak')
      : strength === 'fair'
        ? t('auth.validation.strengthFair')
        : t('auth.validation.strengthStrong');

  const barColor =
    strength === 'weak' ? 'bg-[#ff3b30]' : strength === 'fair' ? 'bg-[#ff9500]' : 'bg-[#34c759]';

  return (
    <div className="space-y-2.5 rounded-xl bg-white/60 px-3.5 py-3 ring-1 ring-[#d2d2d7]/60">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-medium text-[#6e6e73]">{t('auth.validation.passwordStrength')}</span>
        <span
          className={cn(
            'text-[12px] font-semibold',
            strength === 'weak' && 'text-[#ff3b30]',
            strength === 'fair' && 'text-[#ff9500]',
            strength === 'strong' && 'text-[#34c759]',
          )}
        >
          {strengthLabel}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full bg-[#e5e5ea] transition-colors duration-300',
              (strength === 'weak' && i === 1) ||
                (strength === 'fair' && i <= 2) ||
                (strength === 'strong' && i <= 3)
                ? barColor
                : '',
            )}
          />
        ))}
      </div>
      <ul className="space-y-1.5">
        {checks.map(({ key, met }) => (
          <li key={key} className="flex items-center gap-2 text-[12px]">
            <span
              className={cn(
                'flex h-4 w-4 items-center justify-center rounded-full transition-colors',
                met ? 'bg-[#34c759]/15 text-[#34c759]' : 'bg-[#f2f2f7] text-[#aeaeb2]',
              )}
            >
              {met ? <Check size={10} strokeWidth={3} /> : <span className="h-1 w-1 rounded-full bg-[#c7c7cc]" />}
            </span>
            <span className={met ? 'text-[#1d1d1f]' : 'text-[#86868b]'}>
              {t(key, { min: PASSWORD_MIN })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  showRequirements,
  autoComplete = 'current-password',
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  showRequirements?: boolean;
  autoComplete?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className="block pl-1 text-[13px] font-medium text-[#6e6e73]">
        {label}
      </label>
      <div
        className={cn(fieldShell, hasError ? fieldError : focused ? fieldFocus : fieldIdle)}
      >
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : showRequirements ? `${id}-requirements` : undefined}
          className="min-w-0 flex-1 bg-transparent text-[17px] text-[#1d1d1f] outline-none placeholder:text-[#aeaeb2]"
          placeholder="••••••••"
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="shrink-0 text-[#86868b] transition-colors hover:text-[#1d1d1f]"
          aria-label={show ? t('auth.hidePassword') : t('auth.showPassword')}
        >
          {show ? <EyeOff size={17} strokeWidth={1.75} /> : <Eye size={17} strokeWidth={1.75} />}
        </button>
      </div>
      <AuthFieldError message={error} id={errorId} />
      {showRequirements && value ? (
        <div id={`${id}-requirements`}>
          <PasswordRequirements value={value} />
        </div>
      ) : null}
    </div>
  );
}

export function AuthInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  hint,
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  const [focused, setFocused] = useState(false);
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const hasError = Boolean(error);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block pl-1 text-[13px] font-medium text-[#6e6e73]">
        {label}
      </label>
      <div className={cn(fieldShell, hasError ? fieldError : focused ? fieldFocus : fieldIdle)}>
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : hint ? hintId : undefined}
          className="min-w-0 flex-1 bg-transparent text-[17px] text-[#1d1d1f] outline-none placeholder:text-[#aeaeb2]"
        />
      </div>
      {hint && !hasError ? (
        <p id={hintId} className="pl-1 text-[12px] text-[#86868b]">
          {hint}
        </p>
      ) : null}
      <AuthFieldError message={error} id={errorId} />
    </div>
  );
}

export function AuthPageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10 text-center">
      <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-sidebar shadow-[0_8px_24px_rgba(26,26,46,0.18),0_2px_6px_rgba(0,0,0,0.06)] ring-1 ring-lime/25">
        <span className="text-xl font-bold tracking-tight text-lime">HA</span>
      </div>
      <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[#1d1d1f] sm:text-[32px]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mx-auto mt-2 max-w-[280px] text-[15px] leading-relaxed text-[#6e6e73]">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function AuthPrimaryButton({
  children,
  loading,
  disabled,
  type = 'submit',
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: 'submit' | 'button';
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'mt-2 h-[50px] w-full rounded-full text-[17px] font-medium text-white transition-all duration-200',
        'bg-primary hover:bg-[#1568a0] active:scale-[0.98]',
        'shadow-[0_2px_10px_rgba(24,95,165,0.32)]',
        'disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:active:scale-100',
      )}
    >
      {children}
    </button>
  );
}

export function AuthFormAlert({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="flex items-center justify-center gap-2 rounded-xl bg-[#fff2f2] px-4 py-3 text-center text-[14px] text-[#d70015] ring-1 ring-[#ffcdd2]/80"
    >
      <AlertCircle size={16} strokeWidth={2} className="shrink-0" />
      {message}
    </p>
  );
}

export function AuthLink(props: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn('text-[14px] font-normal text-primary hover:underline', props.className)}
    />
  );
}
