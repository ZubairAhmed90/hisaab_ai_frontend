export type TopupPackage = {
  id: string;
  label: string;
  amount: number;
  validity?: string;
  data?: string;
  type: 'balance' | 'bundle';
};

/** Default recharge packages per Pakistani network */
export const mockTopupPackages: Record<number, TopupPackage[]> = {
  1: [
    { id: 'j-100', label: 'Rs 100 Balance', amount: 100, type: 'balance' },
    { id: 'j-200', label: 'Rs 200 Balance', amount: 200, type: 'balance' },
    { id: 'j-weekly', label: 'Weekly Super', amount: 350, validity: '7 days', data: '4GB + 1000 mins', type: 'bundle' },
    { id: 'j-daily', label: 'Daily Data', amount: 80, validity: '1 day', data: '1.5GB', type: 'bundle' },
    { id: 'j-monthly', label: 'Monthly Mega', amount: 1500, validity: '30 days', data: '12GB + SMS', type: 'bundle' },
    { id: 'j-500', label: 'Rs 500 Balance', amount: 500, type: 'balance' },
  ],
  2: [
    { id: 'z-100', label: 'Rs 100 Balance', amount: 100, type: 'balance' },
    { id: 'z-200', label: 'Rs 200 Balance', amount: 200, type: 'balance' },
    { id: 'z-weekly', label: 'Weekly Premium', amount: 400, validity: '7 days', data: '5GB + 1500 mins', type: 'bundle' },
    { id: 'z-daily', label: 'Daily Plus', amount: 90, validity: '1 day', data: '2GB', type: 'bundle' },
    { id: 'z-monthly', label: 'Monthly Pro', amount: 1600, validity: '30 days', data: '15GB', type: 'bundle' },
    { id: 'z-500', label: 'Rs 500 Balance', amount: 500, type: 'balance' },
  ],
  3: [
    { id: 't-100', label: 'Rs 100 Balance', amount: 100, type: 'balance' },
    { id: 't-200', label: 'Rs 200 Balance', amount: 200, type: 'balance' },
    { id: 't-weekly', label: 'Weekly Easy', amount: 300, validity: '7 days', data: '3GB + 800 mins', type: 'bundle' },
    { id: 't-daily', label: 'Daily Social', amount: 75, validity: '1 day', data: '1GB', type: 'bundle' },
    { id: 't-monthly', label: 'Monthly Max', amount: 1400, validity: '30 days', data: '10GB', type: 'bundle' },
    { id: 't-1000', label: 'Rs 1000 Balance', amount: 1000, type: 'balance' },
  ],
  4: [
    { id: 'u-100', label: 'Rs 100 Balance', amount: 100, type: 'balance' },
    { id: 'u-200', label: 'Rs 200 Balance', amount: 200, type: 'balance' },
    { id: 'u-weekly', label: 'Weekly Super', amount: 320, validity: '7 days', data: '4GB + 900 mins', type: 'bundle' },
    { id: 'u-daily', label: 'Daily Offer', amount: 85, validity: '1 day', data: '1.2GB', type: 'bundle' },
    { id: 'u-monthly', label: 'Monthly Bundle', amount: 1450, validity: '30 days', data: '11GB', type: 'bundle' },
    { id: 'u-500', label: 'Rs 500 Balance', amount: 500, type: 'balance' },
  ],
};

export const mockTopupAmounts = [100, 200, 500, 1000, 1500, 2000];

export function getPackagesForOperator(operatorId: number): TopupPackage[] {
  return mockTopupPackages[operatorId] || mockTopupAmounts.map((amount) => ({
    id: `default-${amount}`,
    label: `Rs ${amount}`,
    amount,
    type: 'balance' as const,
  }));
}
