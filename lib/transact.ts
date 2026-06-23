import api from './api';

export type PaymentPayload = {
  amount: number;
  description: string;
  category: string;
  merchant?: string;
  source: 'transfer' | 'bill_pay' | 'topup' | 'request';
};

export async function recordPayment(payload: PaymentPayload) {
  const today = new Date().toISOString().slice(0, 10);
  return api.post('/transactions', {
    amount: payload.amount,
    description: payload.description,
    category: payload.category,
    merchant: payload.merchant,
    source: payload.source,
    date: today,
  });
}

export function getBeneficiary(id: string) {
  // dynamic import avoided — callers pass beneficiary from mockData
  return id;
}
