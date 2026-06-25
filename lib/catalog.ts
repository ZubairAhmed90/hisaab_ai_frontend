export const BILLERS = {
  electricity: [
    { id: 1, name: 'LESCO', region: 'Lahore', icon: 'zap' as const },
    { id: 2, name: 'K-Electric', region: 'Karachi', icon: 'zap' as const },
    { id: 3, name: 'IESCO', region: 'Islamabad', icon: 'zap' as const },
  ],
  gas: [
    { id: 4, name: 'SNGPL', region: 'North', icon: 'flame' as const },
    { id: 5, name: 'SSGC', region: 'South', icon: 'flame' as const },
  ],
  internet: [
    { id: 6, name: 'PTCL', region: 'Nationwide', icon: 'wifi' as const },
    { id: 7, name: 'StormFiber', region: 'Nationwide', icon: 'wifi' as const },
  ],
  mobile: [
    { id: 8, name: 'Jazz Postpaid', region: '', icon: 'smartphone' as const },
    { id: 9, name: 'Zong Postpaid', region: '', icon: 'smartphone' as const },
  ],
} as const;

export type BillerCategory = keyof typeof BILLERS;

export const OPERATORS = [
  { id: 1, name: 'Jazz', color: '#E4002B', prefixes: '030x' },
  { id: 2, name: 'Zong', color: '#5B2D90', prefixes: '031x' },
  { id: 3, name: 'Telenor', color: '#0066B3', prefixes: '034x' },
  { id: 4, name: 'Ufone', color: '#00A8E0', prefixes: '033x' },
];

export function detectOperatorId(phone: string): number {
  const prefix = phone.replace(/\D/g, '').slice(0, 3);
  if (prefix.startsWith('030')) return 1;
  if (prefix.startsWith('031')) return 2;
  if (prefix.startsWith('034')) return 3;
  if (prefix.startsWith('033')) return 4;
  return 1;
}

export function billerIcon(name: string): 'zap' | 'flame' | 'wifi' | 'smartphone' {
  const lower = name.toLowerCase();
  if (lower.includes('gas') || lower.includes('sngpl') || lower.includes('ssgc')) return 'flame';
  if (lower.includes('mobile') || lower.includes('jazz') || lower.includes('zong')) return 'smartphone';
  if (lower.includes('internet') || lower.includes('ptcl') || lower.includes('fiber')) return 'wifi';
  return 'zap';
}
