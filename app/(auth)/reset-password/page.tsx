'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { AuthShell } from '@/components/auth/AuthShell';
import {
  AuthFormAlert,
  AuthPageHeader,
  AuthPrimaryButton,
  PasswordField,
} from '@/components/auth/PasswordField';
import { PASSWORD_MIN } from '@/lib/auth/validation';
import {
  validateConfirmPassword,
  validateRegisterPassword,
} from '@/lib/auth/validation';
import { useFormValidation } from '@/lib/auth/useFormValidation';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

type ResetValues = { password: string; confirm: string };

function ResetPasswordForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [values, setValues] = useState<ResetValues>({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const schema = useMemo(
    () => ({
      password: [validateRegisterPassword],
      confirm: [validateConfirmPassword],
    }),
    [],
  );

  const form = useFormValidation<ResetValues>(schema);

  const fieldError = (field: keyof ResetValues) => {
    const key = form.getErrorKey(field);
    if (!key) return undefined;
    if (key === 'auth.validation.passwordMinLength') return t(key, { min: PASSWORD_MIN });
    return t(key);
  };

  const update = (field: keyof ResetValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    setServerError('');
    if (form.shouldShow(field)) form.validateField(field, value, next);
    if (field === 'password' && form.shouldShow('confirm') && values.confirm) {
      form.validateField('confirm', values.confirm, next);
    }
  };

  const handleBlur = (field: keyof ResetValues) => {
    form.touch(field);
    form.validateField(field, values[field], values);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    form.markSubmitted();
    setServerError('');

    if (!token) {
      setServerError(t('auth.resetInvalid'));
      return;
    }

    if (!form.validateAll(values)) {
      toast.error(t('auth.validation.fixErrors'));
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password: values.password });
      toast.success(t('auth.passwordUpdated'));
      setTimeout(() => router.push('/login'), 1500);
    } catch {
      setServerError(t('auth.resetInvalid'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-primary hover:underline"
      >
        <ArrowLeft size={16} strokeWidth={1.75} /> {t('auth.backToLogin')}
      </Link>

      <AuthPageHeader title={t('auth.resetPassword')} subtitle={t('auth.newPassword')} />

      {!token ? (
        <AuthFormAlert message={t('auth.resetInvalid')} />
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <PasswordField
          id="password"
          label={t('auth.newPassword')}
          value={values.password}
          onChange={(v) => update('password', v)}
          onBlur={() => handleBlur('password')}
          error={fieldError('password')}
          showRequirements
          autoComplete="new-password"
        />
        <PasswordField
          id="confirm"
          label={t('auth.confirmPassword')}
          value={values.confirm}
          onChange={(v) => update('confirm', v)}
          onBlur={() => handleBlur('confirm')}
          error={fieldError('confirm')}
          autoComplete="new-password"
        />

        {serverError ? <AuthFormAlert message={serverError} /> : null}

        <AuthPrimaryButton loading={loading} disabled={!token}>
          {loading ? t('common.loading') : t('auth.updatePassword')}
        </AuthPrimaryButton>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
