'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { AuthShell } from '@/components/auth/AuthShell';
import {
  AuthFormAlert,
  AuthInput,
  AuthPageHeader,
  AuthPrimaryButton,
} from '@/components/auth/PasswordField';
import { validateEmail } from '@/lib/auth/validation';
import { useFormValidation } from '@/lib/auth/useFormValidation';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

type ForgotValues = { email: string };

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [values, setValues] = useState<ForgotValues>({ email: '' });
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [serverError, setServerError] = useState('');

  const schema = useMemo(() => ({ email: [validateEmail] }), []);
  const form = useFormValidation<ForgotValues>(schema);

  const emailError = form.getErrorKey('email') ? t(form.getErrorKey('email')!) : undefined;

  const updateEmail = (value: string) => {
    setValues({ email: value });
    setServerError('');
    if (form.shouldShow('email')) form.validateField('email', value, { email: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    form.markSubmitted();
    setServerError('');

    if (!form.validateAll(values)) {
      toast.error(t('auth.validation.fixErrors'));
      return;
    }

    setLoading(true);
    setResetLink('');
    try {
      const res = await api.post('/auth/forgot-password', { email: values.email.trim() });
      toast.success(t('auth.resetSent'));
      if (res.data.data?.resetLink) setResetLink(res.data.data.resetLink);
    } catch {
      setServerError(t('common.error'));
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <button
        type="button"
        onClick={() => router.push('/login')}
        className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-primary hover:underline"
      >
        <ArrowLeft size={16} strokeWidth={1.75} /> {t('auth.backToLogin')}
      </button>

      <AuthPageHeader title={t('auth.resetPassword')} subtitle={t('auth.resetSubtitle')} />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthInput
          id="email"
          label={t('auth.email')}
          type="email"
          value={values.email}
          onChange={updateEmail}
          onBlur={() => {
            form.touch('email');
            form.validateField('email', values.email, values);
          }}
          error={emailError}
          autoComplete="email"
        />

        {serverError ? <AuthFormAlert message={serverError} /> : null}

        <AuthPrimaryButton loading={loading}>
          {loading ? t('common.loading') : t('auth.sendResetLink')}
        </AuthPrimaryButton>
      </form>

      {resetLink && (
        <div className="mt-6 rounded-2xl bg-white/80 p-4 text-center shadow-sm ring-1 ring-black/[0.04] backdrop-blur-sm">
          <p className="text-[12px] text-[#6e6e73]">{t('auth.resetSentDev')}</p>
          <a
            href={resetLink}
            className="mt-2 block break-all text-[14px] font-medium text-primary hover:underline"
          >
            {resetLink}
          </a>
        </div>
      )}
    </AuthShell>
  );
}
