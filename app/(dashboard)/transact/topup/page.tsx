'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TRANSACT_MAIN,
  TransactNav,
  TransactPageHeader,
} from '@/components/transact/TransactShell';
import { Button } from '@/components/ui/button';
import { TopupContactPicker } from '@/components/transact/TopupContactPicker';
import { TopupPackageGrid } from '@/components/transact/TopupPackageGrid';
import { mockOperators } from '@/lib/mockData';
import {
  detectOperatorFromPhone,
  fetchPhoneDetails,
  getPackagesForOperator,
  PhoneLookupResult,
} from '@/lib/topup';
import type { TopupPackage } from '@/lib/topup.helpers';

export default function TopupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'contacts' | 'manual'>('contacts');
  const [phone, setPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [operatorId, setOperatorId] = useState<number>(mockOperators[0].id);
  const [lookup, setLookup] = useState<PhoneLookupResult | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TopupPackage | null>(null);

  const packages = getPackagesForOperator(operatorId);
  const operator = mockOperators.find((o) => o.id === operatorId);
  const canContinue = phone.length === 11 && operatorId > 0;

  const goToAmount = useCallback(
    (pkg?: TopupPackage | null) => {
      const params = new URLSearchParams({
        operatorId: String(operatorId),
        phone,
        contactName: contactName || lookup?.name || '',
      });
      if (pkg) {
        params.set('amount', String(pkg.amount));
        params.set('packageId', pkg.id);
        params.set('packageLabel', pkg.label);
      }
      router.push(`/transact/topup/amount?${params.toString()}`);
    },
    [contactName, lookup?.name, operatorId, phone, router],
  );

  useEffect(() => {
    if (mode !== 'manual' || phone.length !== 11) {
      setLookup(null);
      return;
    }
    const detected = detectOperatorFromPhone(phone);
    if (detected) setOperatorId(detected);
  }, [mode, phone]);

  const handleSelectContact = (contact: {
    id: number;
    name: string;
    phone: string;
    operatorId: number;
  }) => {
    setSelectedContactId(contact.id);
    setPhone(contact.phone);
    setContactName(contact.name);
    setOperatorId(contact.operatorId);
    setLookup(null);
    setSelectedPackage(null);
  };

  const handleFetch = async () => {
    setLookupLoading(true);
    try {
      const result = await fetchPhoneDetails(phone);
      setLookup(result);
      if (result) {
        setOperatorId(result.operatorId);
        setContactName(result.found ? result.name : '');
      }
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <>
      <TransactNav />

      <TransactPageHeader
        title="Mobile Top Up"
        subtitle="Pick a contact or enter a number — packages load for Jazz, Zong, Telenor and Ufone"
      />

      <div className={`${TRANSACT_MAIN} space-y-6`}>
        <div className="rounded-3xl bg-card p-6 shadow-card">
          <TopupContactPicker
            mode={mode}
            onModeChange={(m) => {
              setMode(m);
              setSelectedPackage(null);
              if (m === 'manual') {
                setSelectedContactId(null);
                setContactName('');
              }
            }}
            phone={phone}
            onPhoneChange={(p) => {
              setPhone(p);
              setSelectedContactId(null);
              setSelectedPackage(null);
            }}
            selectedContactId={selectedContactId}
            onSelectContact={handleSelectContact}
            lookup={lookup}
            lookupLoading={lookupLoading}
            onFetch={handleFetch}
            operatorId={operatorId}
            onOperatorChange={(id) => {
              setOperatorId(id);
              setSelectedPackage(null);
            }}
          />
        </div>

        {canContinue && operator ? (
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {operator.name} packages
                </p>
                <p className="text-xs text-muted">
                  {contactName || lookup?.name || phone} · Tap a package or enter custom amount
                </p>
              </div>
              <span
                className="rounded-full px-3 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: operator.color }}
              >
                {operator.name}
              </span>
            </div>
            <TopupPackageGrid
              packages={packages}
              selectedId={selectedPackage?.id ?? null}
              onSelect={(pkg) => {
                setSelectedPackage(pkg);
                goToAmount(pkg);
              }}
            />
            <Button
              variant="outline"
              className="mt-4 h-11 w-full rounded-xl"
              onClick={() => goToAmount(null)}
            >
              Custom amount
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
}
