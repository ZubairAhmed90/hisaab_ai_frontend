import { OPERATORS, detectOperatorId } from './catalog';
import { loadTopupContacts } from './topup-contacts';

export type { TopupPackage } from './topup.helpers';
export { getPackagesForOperator, mockTopupPackages } from './topup.helpers';

/** Detect operator from Pakistani mobile prefix (03XX) */
export function detectOperatorFromPhone(phone: string): number | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return null;
  return detectOperatorId(digits);
}

export type PhoneLookupResult = {
  phone: string;
  name: string;
  operatorId: number;
  operatorName: string;
  found: boolean;
};

/** Matches saved contacts or detects network from prefix */
export async function fetchPhoneDetails(phone: string): Promise<PhoneLookupResult | null> {
  const normalized = phone.replace(/\D/g, '').slice(-11);
  if (normalized.length !== 11 || !normalized.startsWith('03')) return null;

  await new Promise((r) => setTimeout(r, 200));

  const contacts = loadTopupContacts();
  const contact = contacts.find((c) => c.phone.replace(/\D/g, '') === normalized);
  const operatorId = contact?.operatorId ?? detectOperatorFromPhone(normalized);
  if (!operatorId) return null;

  const operator = OPERATORS.find((o) => o.id === operatorId);
  return {
    phone: normalized,
    name: contact?.name ?? 'Prepaid number',
    operatorId,
    operatorName: operator?.name ?? 'Unknown',
    found: !!contact,
  };
}

export { OPERATORS };
