'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Fetch current month transaction summary by category
export function useTransactionSummary() {
  return useQuery({
    queryKey: ['transactions', 'summary'],
    queryFn: async () => (await api.get('/transactions/summary')).data.data,
  });
}

// Fetch paginated user transactions
export function useTransactions(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['transactions', page, limit],
    queryFn: async () => (await api.get('/transactions', { params: { page, limit } })).data.data,
  });
}

// Fetch investment mirror data for a time period
export function useMirror(period: '1m' | '3m' | '6m' | '12m') {
  return useQuery({
    queryKey: ['mirror', period],
    queryFn: async () => (await api.get('/mirror', { params: { period } })).data.data,
  });
}

// Fetch user budgets with current month spend
export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => (await api.get('/budgets')).data.data,
  });
}

// Fetch all user savings goals
export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => (await api.get('/goals')).data.data,
  });
}

// Fetch top personalized offers
export function useOffers() {
  return useQuery({
    queryKey: ['offers'],
    queryFn: async () => (await api.get('/offers')).data.data,
  });
}

// Fetch monthly financial report card
export function useReport(month: string) {
  return useQuery({
    queryKey: ['reports', month],
    queryFn: async () => (await api.get('/reports/monthly', { params: { month } })).data.data,
    enabled: !!month,
  });
}

// Fetch AI-generated saving tips
export function useAiTips(language = 'en') {
  return useQuery({
    queryKey: ['ai', 'tips', language],
    queryFn: async () => (await api.get('/ai/tips', { params: { language } })).data.data,
  });
}

// Add a new transaction
export function useAddTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: object) => api.post('/transactions', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      qc.invalidateQueries({ queryKey: ['budgets'] });
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

// Delete a transaction by id
export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/transactions/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}

// Create a new budget
export function useAddBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: object) => api.post('/budgets', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

// Update an existing budget
export function useUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) => api.put(`/budgets/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

// Delete a budget by id
export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/budgets/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

// Redeem an offer
export function useRedeemOffer() {
  return useMutation({
    mutationFn: (id: number) => api.post(`/offers/${id}/redeem`),
  });
}

// Create a new savings goal
export function useAddGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: object) => api.post('/goals', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
}

// Update saved amount on a goal
export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, saved_amount }: { id: number; saved_amount: number }) =>
      api.put(`/goals/${id}`, { saved_amount }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
}

// Delete a savings goal
export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/goals/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
}

// Send a message to the AI advisor
export function useAiChat() {
  return useMutation({
    mutationFn: (data: { message: string; language: string }) => api.post('/ai/chat', data),
  });
}

// Fetch all cached market prices
export function useMarket() {
  return useQuery({
    queryKey: ['market'],
    queryFn: async () => (await api.get('/market/all')).data.data,
  });
}

// Fetch user PSX portfolio holdings
export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => (await api.get('/portfolio')).data.data,
  });
}

export function useBuyStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { ticker: string; quantity: number }) =>
      api.post('/portfolio/buy', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useSellStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { ticker: string; quantity: number }) =>
      api.post('/portfolio/sell', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useTransferBalance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; direction: 'to_account' | 'to_wallet' }) =>
      api.post('/portfolio/transfer', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => (await api.get('/admin/users')).data.data,
    retry: false,
  });
}

export function useAdminCredit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, amount, note }: { userId: number; amount: number; note?: string }) =>
      api.post(`/admin/users/${userId}/credit`, { amount, note }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => (await api.get('/auth/me')).data.data,
  });
}

// Record a payment / transfer as a transaction
export function useRecordPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      amount: number;
      description: string;
      category: string;
      merchant?: string;
      source: string;
    }) => {
      const today = new Date().toISOString().slice(0, 10);
      return api.post('/transactions', { ...data, date: today });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      qc.invalidateQueries({ queryKey: ['wallet'] });
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

// Update a transaction category
export function useUpdateTransactionCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, category }: { id: number; category: string }) =>
      api.patch(`/transactions/${id}/category`, { category }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}

export * from './hooks-limits';
