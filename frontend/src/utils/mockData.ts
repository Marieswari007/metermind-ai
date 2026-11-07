import { BillingSummary, Invoice, UsageRecord, User } from '../types';

export const MOCK_USER: User = {
  id: 'usr_demo_8839210',
  name: 'Demo Provider (MeterMind)',
  email: 'demo@metermind.ai',
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const MOCK_SUMMARY: BillingSummary = {
  total_requests: 14850,
  total_tokens: 28450120,
  unbilled_usage: 2350,
  current_bill: 23.50, // (2350 / 100) * 1.00 = 23.50
};

export const MOCK_USAGE_HISTORY: UsageRecord[] = [
  {
    id: 'usg_001',
    service_name: 'gpt-4o',
    request_count: 120,
    input_tokens: 184500,
    output_tokens: 38200,
    total_tokens: 222700,
    idempotency_key: 'idemp-90214a1c-8b83',
    status: 'unbilled',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'usg_002',
    service_name: 'claude-3-5-sonnet',
    request_count: 450,
    input_tokens: 920000,
    output_tokens: 110400,
    total_tokens: 1030400,
    idempotency_key: 'idemp-e8b419c2-55af',
    status: 'unbilled',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'usg_003',
    service_name: 'gemini-1.5-pro',
    request_count: 85,
    input_tokens: 412000,
    output_tokens: 45000,
    total_tokens: 457000,
    idempotency_key: 'idemp-27cc1a00-33da',
    status: 'unbilled',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'usg_004',
    service_name: 'llama-3.1-70b',
    request_count: 1695,
    input_tokens: 2150000,
    output_tokens: 345000,
    total_tokens: 2495000,
    idempotency_key: 'idemp-bb391204-cc81',
    status: 'unbilled',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'usg_005',
    service_name: 'gpt-4o',
    request_count: 5000,
    input_tokens: 7200000,
    output_tokens: 950000,
    total_tokens: 8150000,
    idempotency_key: 'idemp-7718aa00-8812',
    status: 'billed',
    invoice_id: 'inv_oct_2026_001',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'usg_006',
    service_name: 'claude-3-5-sonnet',
    request_count: 7500,
    input_tokens: 11400000,
    output_tokens: 1800000,
    total_tokens: 13200000,
    idempotency_key: 'idemp-11928374-aabb',
    status: 'billed',
    invoice_id: 'inv_oct_2026_001',
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv_oct_2026_001',
    user_id: 'usr_demo_8839210',
    amount: 125.00,
    total_requests: 12500,
    total_tokens: 21350000,
    status: 'paid',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    paid_at: new Date(Date.now() - 86400000 * 4 + 3600000).toISOString(),
    paypal_order_id: 'PAYID-MOCK-991827461',
  },
  {
    id: 'inv_sep_2026_002',
    user_id: 'usr_demo_8839210',
    amount: 84.00,
    total_requests: 8400,
    total_tokens: 14200000,
    status: 'paid',
    created_at: new Date(Date.now() - 86400000 * 34).toISOString(),
    paid_at: new Date(Date.now() - 86400000 * 34 + 1800000).toISOString(),
    paypal_order_id: 'PAYID-MOCK-772910384',
  },
];
