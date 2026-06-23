'use client';

import { cn } from '@/lib/utils';
import { useTranslation, type Lang } from '@/lib/i18n';

export function LanguageToggle({
  language,
  onChange,
  className,
}: {
  language?: Lang;
  onChange?: (lang: Lang) => void;
  className?: string;
}) {
  const i18n = useTranslation();
  const lang = language ?? i18n.lang;
  const handleChange = onChange ?? ((l: Lang) => i18n.setLang(l));

  return (
    <div className={cn('flex rounded-full p-0.5', className)}>
      {(['en', 'ur'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => handleChange(code)}
          className={cn(
            'flex-1 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-200',
            lang === code
              ? 'bg-white text-[#1d1d1f] shadow-sm'
              : 'text-[#6e6e73] hover:text-[#1d1d1f]',
          )}
        >
          {i18n.t(`lang.${code}`)}
        </button>
      ))}
    </div>
  );
}
