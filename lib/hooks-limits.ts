'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Fetch limits set by the current user
export function useLimitsSet() {
  return useQuery({
    queryKey: ['limits-set'],
    queryFn: async () => (await api.get('/limits')).data.data,
  });
}

// Fetch limits that apply to the current user
export function useLimitsMine() {
  return useQuery({
    queryKey: ['limits-mine'],
    queryFn: async () => (await api.get('/limits/mine')).data.data,
  });
}

// Fetch linked partner spending summary
export function usePartnerSummary() {
  return useQuery({
    queryKey: ['partner-summary'],
    queryFn: async () => (await api.get('/limits/partner')).data.data,
  });
}

// Create a new spending limit
export function useCreateLimit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: object) => api.post('/limits', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['limits-set'] });
      qc.invalidateQueries({ queryKey: ['limits-mine'] });
      qc.invalidateQueries({ queryKey: ['partner-summary'] });
    },
  });
}

// Delete a spending limit
export function useDeleteLimit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/limits/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['limits-set'] }),
  });
}

// Link a partner account by email
export function useLinkPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => api.post('/limits/link-partner', { email }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['partner-summary'] });
      qc.invalidateQueries({ queryKey: ['limits-set'] });
    },
  });
}

export function useUnlinkPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/limits/unlink-partner'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['partner-summary'] });
      qc.invalidateQueries({ queryKey: ['limits-set'] });
      qc.invalidateQueries({ queryKey: ['limits-mine'] });
    },
  });
}
