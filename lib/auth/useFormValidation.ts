'use client';

import { useCallback, useState } from 'react';
import { runValidators, type ValidationKey, type Validator } from './validation';

export function useFormValidation<T extends Record<string, string>>(
  schema: Record<keyof T, Validator[]>,
) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, ValidationKey>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validateField = useCallback(
    (field: keyof T, value: string, values: T) => {
      const err = runValidators(value, schema[field] ?? [], values);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) next[field] = err;
        else delete next[field];
        return next;
      });
      return !err;
    },
    [schema],
  );

  const validateAll = useCallback(
    (values: T) => {
      const next: Partial<Record<keyof T, ValidationKey>> = {};
      let valid = true;
      for (const field of Object.keys(schema) as (keyof T)[]) {
        const err = runValidators(values[field] ?? '', schema[field], values);
        if (err) {
          next[field] = err;
          valid = false;
        }
      }
      setErrors(next);
      return valid;
    },
    [schema],
  );

  const touch = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const shouldShow = useCallback(
    (field: keyof T) => Boolean(submitAttempted || touched[field]),
    [submitAttempted, touched],
  );

  const getErrorKey = useCallback(
    (field: keyof T) => (shouldShow(field) ? errors[field] : undefined),
    [errors, shouldShow],
  );

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const markSubmitted = useCallback(() => setSubmitAttempted(true), []);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    touched,
    submitAttempted,
    hasErrors,
    validateField,
    validateAll,
    touch,
    shouldShow,
    getErrorKey,
    clearFieldError,
    markSubmitted,
    setErrors,
  };
}
