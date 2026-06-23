'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  AuthFormAlert,
  AuthInput,
  AuthLink,
  AuthPageHeader,
  AuthPrimaryButton,
  PasswordField,
} from '@/components/auth/PasswordField';
import {
  validateEmail,
  validateLoginPassword,
} from '@/lib/auth/validation';
import { useFormValidation } from '@/lib/auth/useFormValidation';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '@/lib/store';

type LoginValues = { email: string; password: string };

export function LoginForm() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const { t, setLang } = useTranslation();
  const [values, setValues] = useState<LoginValues>({ email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const schema = useMemo(
    () => ({
      email: [validateEmail],
      password: [validateLoginPassword],
    }),
    [],
  );

  const form = useFormValidation<LoginValues>(schema);

  const fieldError = (field: keyof LoginValues) => {
    const key = form.getErrorKey(field);
    return key ? t(key, field === 'password' ? { min: 6 } : undefined) : undefined;
  };

  const update = (field: keyof LoginValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setServerError('');
    if (form.shouldShow(field)) form.validateField(field, value, { ...values, [field]: value });
  };

  const handleBlur = (field: keyof LoginValues) => {
    form.touch(field);
    form.validateField(field, values[field], values);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    form.markSubmitted();
    setServerError('');

    if (!form.validateAll(values)) {
      toast.error(t('auth.validation.fixErrors'));
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        email: values.email.trim(),
        password: values.password,
      });
      const { accessToken, user } = res.data.data;
      setToken(accessToken);
      const preferred =
        user?.preferred_language || (localStorage.getItem('hisaab_lang') as 'en' | 'ur') || 'en';
      setUser(
        user || {
          id: 0,
          name: values.email.split('@')[0],
          email: values.email.trim(),
          preferred_language: preferred,
          monthly_income: 0,
        },
      );
      if (user?.preferred_language) setLang(user.preferred_language, { persistProfile: false });
      toast.success(t('auth.welcomeBack'));
      router.push('/dashboard');
    } catch {
      setServerError(t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthPageHeader title={t('auth.welcomeBack')} subtitle={t('auth.signIn')} />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthInput
          id="email"
          label={t('auth.email')}
          type="email"
          value={values.email}
          onChange={(v) => update('email', v)}
          onBlur={() => handleBlur('email')}
          error={fieldError('email')}
          placeholder="name@example.com"
          autoComplete="email"
        />

        <PasswordField
          id="password"
          label={t('auth.password')}
          value={values.password}
          onChange={(v) => update('password', v)}
          onBlur={() => handleBlur('password')}
          error={fieldError('password')}
        />

        <div className="flex justify-end pr-1 pt-1">
          <AuthLink href="/forgot-password">{t('auth.forgotPassword')}</AuthLink>
        </div>

        {serverError ? <AuthFormAlert message={serverError} /> : null}

        <AuthPrimaryButton loading={loading}>
          {loading ? t('auth.signingIn') : t('auth.logIn')}
        </AuthPrimaryButton>
      </form>

      <div className="mt-10 space-y-4 text-center">
        <div className="h-px bg-[#d2d2d7]/50" />
        <p className="text-[14px] text-[#6e6e73]">
          {t('auth.noAccount')}{' '}
          <AuthLink href="/register" className="font-medium">
            {t('auth.signUp')}
          </AuthLink>
        </p>
      </div>
    </>
  );
}
