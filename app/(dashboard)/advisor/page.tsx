'use client';

import { ChatWindow } from '@/components/advisor/ChatWindow';
import { TipsSection } from '@/components/advisor/TipsSection';
import { PageHeader } from '@/components/shared/PageHeader';
import { useTranslation } from '@/lib/i18n';

export default function AdvisorPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader title={t('advisor.title')} subtitle={t('advisor.askSpending')} />
      <TipsSection />
      <ChatWindow />
    </div>
  );
}
