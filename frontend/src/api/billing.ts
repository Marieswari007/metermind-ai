import { api } from './client';
import { BillingSummary } from '../types';
import { MOCK_SUMMARY } from '../utils/mockData';

export async function getBillingSummary(): Promise<BillingSummary> {
  if (api.getMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_SUMMARY;
  }
  return api.request<BillingSummary>('/billing/summary');
}
