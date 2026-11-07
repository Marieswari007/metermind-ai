export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export interface UsageRecord {
  id?: string;
  _id?: string;
  user_id?: string;
  service_name: string;
  request_count: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens?: number;
  idempotency_key?: string;
  status?: 'unbilled' | 'billed';
  invoice_id?: string | null;
  timestamp?: string;
  created_at?: string;
}

export interface UsageTrackPayload {
  service_name: string;
  request_count: number;
  input_tokens: number;
  output_tokens: number;
  idempotency_key?: string;
}

export interface UsageFilterParams {
  start_date?: string;
  end_date?: string;
  limit?: number;
  skip?: number;
}

export interface BillingSummary {
  total_requests: number;
  total_tokens: number;
  unbilled_usage: number;
  current_bill: number | string;
}

export interface Invoice {
  id: string;
  _id?: string;
  invoice_id?: string;
  user_id: string;
  amount: number | string;
  total_requests: number;
  total_tokens: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
  paid_at?: string;
  paypal_order_id?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  approval_url?: string;
  status?: string;
}

export interface CapturePaymentResponse {
  message?: string;
  status: string;
  payment_id?: string;
  order_id?: string;
  amount?: number | string;
  captured_at?: string;
}
