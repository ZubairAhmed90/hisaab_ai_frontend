'use client';

import { useState } from 'react';
import {
  Bell,
  Globe,
  LogOut,
  Mail,
  Phone,
  Save,
  Shield,
  User,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { LanguageToggle } from '@/components/auth/LanguageToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import { formatPKR } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';

export default function SettingsPage() {
  const { user, setUser, logout } = useAuthStore();
  const { t, lang, setLang } = useTranslation();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    monthly_income: String(user?.monthly_income || ''),
  });
  const [loading, setLoading] = useState(false);

  const initials = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        name: form.name,
        phone: form.phone,
        monthly_income: Number(form.monthly_income),
        preferred_language: lang,
      });
      setLang(lang, { persistProfile: false });
      setUser({ ...res.data.data, preferred_language: lang });
      toast.success(t('settingsExt.profileUpdated'));
    } catch {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('settings.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('settings.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-4 2xl:col-span-3">
          <div className="rounded-3xl bg-gradient-to-br from-lime/40 via-lime/15 to-white p-6 shadow-card">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left xl:flex-col xl:items-center xl:text-center">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-primary text-2xl font-bold text-white">{initials}</AvatarFallback>
              </Avatar>
              <div className="mt-4 sm:ml-5 sm:mt-0 xl:ml-0 xl:mt-4">
                <p className="text-lg font-bold text-gray-900">{user?.name || t('common.user')}</p>
                <p className="text-sm text-muted">{user?.email}</p>
                {user?.monthly_income ? (
                  <p className="font-number mt-2 inline-block rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-gray-800">
                    {formatPKR(Number(user.monthly_income))}/mo
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-5 shadow-card">
            <p className="mb-3 text-sm font-semibold text-gray-900">{t('settingsExt.accountStatus')}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-success/10 px-3 py-2.5 text-sm">
                <Shield size={16} className="text-success" />
                <span className="font-medium text-gray-800">{t('settingsExt.verifiedAccount')}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-surface px-3 py-2.5 text-sm text-muted">
                <Bell size={16} className="text-primary" />
                <span>{t('settingsExt.notificationsSoon')}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5 shadow-card">
            <p className="font-semibold text-gray-900">{t('settingsExt.signOut')}</p>
            <p className="mt-1 text-xs text-muted">{t('settingsExt.signOutHint')}</p>
            <Button
              variant="outline"
              className="mt-3 w-full gap-2 border-danger/30 text-danger hover:bg-danger/10"
              onClick={logout}
            >
              <LogOut size={16} /> {t('common.logout')}
            </Button>
          </div>
        </div>

        <div className="space-y-5 xl:col-span-8 2xl:col-span-9">
          <div className="rounded-3xl bg-card p-6 shadow-card lg:p-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <User size={18} className="text-primary" /> {t('settingsExt.personalDetails')}
            </h2>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="space-y-2 lg:col-span-2">
                <Label className="text-xs text-muted">{t('settingsExt.fullName')}</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-11 rounded-xl bg-surface/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs text-muted">
                  <Phone size={12} /> {t('settings.phone')}
                </Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="h-11 rounded-xl bg-surface/50"
                  placeholder="+92 300 1234567"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs text-muted">
                  <Wallet size={12} /> {t('settingsExt.monthlyIncomePkr')}
                </Label>
                <Input
                  type="number"
                  value={form.monthly_income}
                  onChange={(e) => setForm({ ...form, monthly_income: e.target.value })}
                  className="h-11 rounded-xl bg-surface/50"
                  placeholder="80000"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                <Mail size={18} className="text-primary" /> {t('settingsExt.account')}
              </h2>
              <div className="mt-4 space-y-2">
                <Label className="text-xs text-muted">{t('settingsExt.emailReadOnly')}</Label>
                <Input value={user?.email || ''} disabled className="h-11 rounded-xl bg-surface/30" />
              </div>
            </div>

            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                <Globe size={18} className="text-primary" /> {t('settings.language')}
              </h2>
              <p className="mt-1 text-xs text-muted">{t('settings.languageHint')}</p>
              <div className="mt-4">
                <LanguageToggle language={lang} onChange={(l) => setLang(l, { persistProfile: false })} />
              </div>
            </div>
          </div>

          <Button
            className="h-12 w-full max-w-md gap-2 rounded-xl text-base shadow-[0_4px_16px_rgba(24,95,165,0.28)] lg:w-auto lg:px-10"
            onClick={handleSave}
            disabled={loading}
          >
            <Save size={18} />
            {loading ? t('settingsExt.saving') : t('settingsExt.saveAll')}
          </Button>
        </div>
      </div>
    </div>
  );
}
