/** i18n keys returned by validators — translate at render time */
export type ValidationKey = string;

export type Validator = (value: string, values?: Record<string, string>) => ValidationKey | null;

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const NAME_RE = /^[\p{L}\s'.-]+$/u;

/** Pakistan + international phone — digits with optional + prefix */
const PHONE_RE = /^\+?[0-9\s()-]{7,18}$/;

export const PASSWORD_MIN = 6;

export function validateRequired(value: string, key = 'auth.validation.required'): ValidationKey | null {
  return value.trim() ? null : key;
}

export function validateEmail(value: string): ValidationKey | null {
  const trimmed = value.trim();
  if (!trimmed) return 'auth.validation.emailRequired';
  if (!EMAIL_RE.test(trimmed)) return 'auth.validation.emailInvalid';
  return null;
}

export function validateLoginPassword(value: string): ValidationKey | null {
  if (!value) return 'auth.validation.passwordRequired';
  return null;
}

export function validateRegisterPassword(value: string): ValidationKey | null {
  if (!value) return 'auth.validation.passwordRequired';
  if (value.length < PASSWORD_MIN) return 'auth.validation.passwordMinLength';
  if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) return 'auth.validation.passwordWeak';
  return null;
}

export function validateName(value: string): ValidationKey | null {
  const trimmed = value.trim();
  if (!trimmed) return 'auth.validation.nameRequired';
  if (trimmed.length < 2) return 'auth.validation.nameMinLength';
  if (!NAME_RE.test(trimmed)) return 'auth.validation.nameInvalid';
  return null;
}

export function validatePhoneOptional(value: string): ValidationKey | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15 || !PHONE_RE.test(trimmed)) {
    return 'auth.validation.phoneInvalid';
  }
  return null;
}

export function validateIncomeOptional(value: string): ValidationKey | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0) return 'auth.validation.incomeInvalid';
  if (num > 999_999_999) return 'auth.validation.incomeTooHigh';
  return null;
}

export function validateConfirmPassword(
  value: string,
  values?: Record<string, string>,
): ValidationKey | null {
  if (!value) return 'auth.validation.confirmRequired';
  if (value !== values?.password) return 'auth.passwordsMismatch';
  return null;
}

export type PasswordCheck = { key: ValidationKey; met: boolean };

export function getPasswordChecks(value: string): PasswordCheck[] {
  return [
    { key: 'auth.validation.checkLength', met: value.length >= PASSWORD_MIN },
    { key: 'auth.validation.checkLetter', met: /[a-zA-Z]/.test(value) },
    { key: 'auth.validation.checkNumber', met: /[0-9]/.test(value) },
  ];
}

export function passwordStrength(value: string): 'empty' | 'weak' | 'fair' | 'strong' {
  if (!value) return 'empty';
  const checks = getPasswordChecks(value);
  const met = checks.filter((c) => c.met).length;
  if (met <= 1) return 'weak';
  if (met === 2) return 'fair';
  return 'strong';
}

export function runValidators(value: string, validators: Validator[], values?: Record<string, string>): ValidationKey | null {
  for (const rule of validators) {
    const err = rule(value, values);
    if (err) return err;
  }
  return null;
}
