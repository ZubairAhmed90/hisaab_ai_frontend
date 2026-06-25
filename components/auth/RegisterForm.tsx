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
  PASSWORD_MIN,
  validateEmail,
  validateIncomeOptional,
  validateName,
  validatePhoneOptional,
  validateRegisterPassword,
} from '@/lib/auth/validation';
import { useFormValidation } from '@/lib/auth/useFormValidation';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '@/lib/store';

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  phone: string;
  monthly_income: string;
};

export function RegisterForm() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const { t, lang, setLang } = useTranslation();
  const [values, setValues] = useState<RegisterValues>({
    name: '',
    email: '',
    password: '',
    phone: '',
    monthly_income: '',
  });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const schema = useMemo(
    () => ({
      name: [validateName],
      email: [validateEmail],
      password: [validateRegisterPassword],
      phone: [validatePhoneOptional],
      monthly_income: [validateIncomeOptional],
    }),
    [],
  );

  const form = useFormValidation<RegisterValues>(schema);

  const fieldError = (field: keyof RegisterValues) => {
    const key = form.getErrorKey(field);
    if (!key) return undefined;
    if (key === 'auth.validation.passwordMinLength' || key === 'auth.validation.checkLength') {
      return t(key, { min: PASSWORD_MIN });
    }
    return t(key);
  };

  const update = (field: keyof RegisterValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setServerError('');
    if (form.shouldShow(field)) form.validateField(field, value, { ...values, [field]: value });
  };

  const handleBlur = (field: keyof RegisterValues) => {
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
      const res = await api.post('/auth/register', {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        phone: values.phone.trim() || undefined,
        monthly_income: values.monthly_income ? Number(values.monthly_income) : undefined,
      });
      const { accessToken, user } = res.data.data;
      if (!accessToken) throw new Error('Invalid response');
      setToken(accessToken);
      const registeredUser = user
        ? { ...user, preferred_language: lang }
        : {
            id: 0,
            name: values.name.trim(),
            email: values.email.trim(),
            preferred_language: lang,
            monthly_income: Number(values.monthly_income) || 0,
          };
      setUser(registeredUser);
      setLang(lang, { persistProfile: false });
      await api.put('/auth/profile', { preferred_language: lang }).catch(() => undefined);
      router.push('/dashboard');
    } catch {
      setServerError(t('auth.registerFailed'));
      toast.error(t('auth.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthPageHeader title={t('auth.createAccount')} subtitle={t('auth.registerSubtitle')} />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthInput
          id="name"
          label={t('auth.name')}
          value={values.name}
          onChange={(v) => update('name', v)}
          onBlur={() => handleBlur('name')}
          error={fieldError('name')}
          autoComplete="name"
        />
        <AuthInput
          id="email"
          label={t('auth.email')}
          type="email"
          value={values.email}
          onChange={(v) => update('email', v)}
          onBlur={() => handleBlur('email')}
          error={fieldError('email')}
          autoComplete="email"
        />
        <PasswordField
          id="password"
          label={t('auth.password')}
          value={values.password}
          onChange={(v) => update('password', v)}
          onBlur={() => handleBlur('password')}
          error={fieldError('password')}
          showRequirements
          autoComplete="new-password"
        />
        <AuthInput
          id="phone"
          label={t('auth.phoneOptional')}
          type="tel"
          value={values.phone}
          onChange={(v) => update('phone', v)}
          onBlur={() => handleBlur('phone')}
          error={fieldError('phone')}
          hint={t('auth.validation.phoneHint')}
          autoComplete="tel"
          inputMode="tel"
        />
        <AuthInput
          id="income"
          label={t('auth.monthlyIncome')}
          type="number"
          value={values.monthly_income}
          onChange={(v) => update('monthly_income', v)}
          onBlur={() => handleBlur('monthly_income')}
          error={fieldError('monthly_income')}
          hint={t('common.optional')}
          inputMode="decimal"
        />

        {serverError ? <AuthFormAlert message={serverError} /> : null}

        <AuthPrimaryButton loading={loading}>
          {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
        </AuthPrimaryButton>
      </form>

      <p className="mt-10 text-center text-[14px] text-[#6e6e73]">
        {t('auth.alreadyHaveAccount')}{' '}
        <AuthLink href="/login" className="font-medium">
          {t('auth.signIn')}
        </AuthLink>
      </p>
    </>
  );
}
