export const mockCards = [
  { id: 1, last4: '2872', type: 'Debit', bank: 'UBL', network: 'VISA' },
  { id: 2, last4: '1720', type: 'Credit', bank: 'HBL', network: 'Mastercard' },
];

export const mockBills = [
  { id: 1, name: 'LESCO Electricity', dueIn: 3, amount: 4500, icon: 'zap' as const },
  { id: 2, name: 'Jazz Postpaid', dueIn: 6, amount: 1800, icon: 'smartphone' as const },
  { id: 3, name: 'PTCL Internet', dueIn: 9, amount: 3200, icon: 'wifi' as const },
  { id: 4, name: 'SNGPL Gas', dueIn: 12, amount: 2100, icon: 'flame' as const },
];

export const mockBeneficiaries = [
  { id: 1, name: 'Hina Fatima', initials: 'HF', color: '#1D9E75', bank: 'UBL', account: '•••• 1720', iban: 'PK36UNIL0109000001234567' },
  { id: 2, name: 'Bilal Ahmed', initials: 'BA', color: '#D85A30', bank: 'HBL', account: '•••• 4410', iban: 'PK24HABB0009876543210987' },
  { id: 3, name: 'Sara Khan', initials: 'SK', color: '#534AB7', bank: 'Meezan', account: '•••• 9981', iban: 'PK11MEZN0001122334455667' },
];

export type BillerCategory = 'electricity' | 'gas' | 'internet' | 'mobile';

export const mockBillers: Record<BillerCategory, { id: number; name: string; region: string; icon: 'zap' | 'flame' | 'wifi' | 'smartphone' }[]> = {
  electricity: [
    { id: 1, name: 'LESCO', region: 'Lahore', icon: 'zap' },
    { id: 2, name: 'K-Electric', region: 'Karachi', icon: 'zap' },
    { id: 3, name: 'IESCO', region: 'Islamabad', icon: 'zap' },
  ],
  gas: [
    { id: 4, name: 'SNGPL', region: 'North', icon: 'flame' },
    { id: 5, name: 'SSGC', region: 'South', icon: 'flame' },
  ],
  internet: [
    { id: 6, name: 'PTCL', region: 'Nationwide', icon: 'wifi' },
    { id: 7, name: 'StormFiber', region: 'Nationwide', icon: 'wifi' },
  ],
  mobile: [
    { id: 8, name: 'Jazz Postpaid', region: '', icon: 'smartphone' },
    { id: 9, name: 'Zong Postpaid', region: '', icon: 'smartphone' },
  ],
};

export const mockOperators = [
  { id: 1, name: 'Jazz', color: '#E4002B', prefixes: '030x' },
  { id: 2, name: 'Zong', color: '#5B2D90', prefixes: '031x' },
  { id: 3, name: 'Telenor', color: '#0066B3', prefixes: '034x' },
  { id: 4, name: 'Ufone', color: '#00A8E0', prefixes: '033x' },
];

export const mockTopupContacts = [
  { id: 1, name: 'Hina Fatima', initials: 'HF', color: '#1D9E75', phone: '03001234567', operatorId: 1 },
  { id: 2, name: 'Bilal Ahmed', initials: 'BA', color: '#D85A30', phone: '03151234567', operatorId: 2 },
  { id: 3, name: 'Sara Khan', initials: 'SK', color: '#534AB7', phone: '03451234567', operatorId: 3 },
  { id: 4, name: 'Ahmed Khan', initials: 'AK', color: '#185FA5', phone: '03331234567', operatorId: 4 },
  { id: 5, name: 'My Number', initials: 'ME', color: '#1D9E75', phone: '03009876543', operatorId: 1 },
];

export const mockTopupAmounts = [100, 200, 500, 1000, 1500, 2000];

export const mockScannedMerchant = {
  name: 'Cafe Aylanto',
  account: 'Merchant •••• 7732',
  suggestedAmount: 1250,
};

export const BANKS = ['UBL', 'HBL', 'Meezan', 'Allied', 'MCB', 'Bank Alfalah'];
