import { mockOperators, mockTopupContacts } from './mockData';
import { getPackagesForOperator } from './topup.helpers';

export type { TopupPackage } from './topup.helpers';
export { getPackagesForOperator, mockTopupPackages } from './topup.helpers';

/** Detect operator from Pakistani mobile prefix (03XX) */
export function detectOperatorFromPhone(phone: string): number | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return null;
  const prefix = digits.startsWith('92') ? digits.slice(2, 6) : digits.slice(0, 4);
  const p = prefix.startsWith('0') ? prefix : `0${prefix.slice(0, 3)}`;

  if (p.startsWith('030') || p.startsWith('0300')) return 1;
  if (p.startsWith('031')) return 2;
  if (p.startsWith('034')) return 3;
  if (p.startsWith('033')) return 4;
  return null;
}

export type PhoneLookupResult = {
  phone: string;
  name: string;
  operatorId: number;
  operatorName: string;
  found: boolean;
};

/** Mock lookup — matches saved contacts or detects network from prefix */
export async function fetchPhoneDetails(phone: string): Promise<PhoneLookupResult | null> {
  const normalized = phone.replace(/\D/g, '').slice(-11);
  if (normalized.length !== 11 || !normalized.startsWith('03')) return null;

  await new Promise((r) => setTimeout(r, 400));

  const contact = mockTopupContacts.find((c) => c.phone.replace(/\D/g, '') === normalized);
  const operatorId = contact?.operatorId ?? detectOperatorFromPhone(normalized);
  if (!operatorId) return null;

  const operator = mockOperators.find((o) => o.id === operatorId);
  return {
    phone: normalized,
    name: contact?.name ?? 'Prepaid number',
    operatorId,
    operatorName: operator?.name ?? 'Unknown',
    found: !!contact,
  };
}

export { mockTopupContacts };
